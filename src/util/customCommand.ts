import * as path from "path";
import * as fs from "fs";
import childProcess from "child_process";
import { Util } from "../util/util";
import { YamlManager } from "../managers/yamlManager";
import type { ServerYaml } from "../types";
import type { BedrockServer } from "../core/bedrockServer";

export class CustomCommand {
    private serverProcess: childProcess.ChildProcessWithoutNullStreams;
    private bedrockServer: BedrockServer;
    private serverYaml: ServerYaml

    constructor(serverProcess: childProcess.ChildProcessWithoutNullStreams, bedrockServer: BedrockServer) {
        const yamlManager = new YamlManager("./server.yml");

        yamlManager.merge("./server.yml");
        this.serverProcess = serverProcess;
        this.bedrockServer = bedrockServer;
        this.serverYaml = yamlManager.load()?.[0] as unknown as ServerYaml;
    }

    reload(): void {
        Util.log("サーバーのリロードを開始します", { type: "INFO" });
        this.serverProcess.stdin.write("reload\n");
    }

    stop(): void {
        Util.log("サーバーを停止します", { type: "INFO" });
        this.bedrockServer.stop();
    }

    restart(): void {
        Util.log("サーバーを再起動します", { type: "INFO" });
        this.bedrockServer.stop(true);
    }

    backup(): void {
        Util.log("サーバーのバックアップ準備を開始します", { type: "INFO" });
        this.serverProcess.stdin.write("save hold\n");

        const intervalId = setInterval(() => {
            this.serverProcess.stdin.write("save query\n");
        }, 500);

        const backupHandler = async (data: Buffer) => {
            const output = data.toString();

            if (output.includes("Data saved. Files are now ready to be copied.")) {
                clearInterval(intervalId);
                Util.log("サーバーのバックアップ準備が完了しました", { type: "INFO" });
                await Util.handleBackup(this.serverYaml);
                this.serverProcess.stdin.write("save resume\n");
                this.serverProcess.stdout.removeListener("data", backupHandler);
            }

            if (output.includes("Changes to the world are resumed.")) {
                Util.log("バックアップが完了しました", { type: "INFO" });
                this.serverProcess.stdout.removeListener("data", backupHandler);
            }
        };

        this.serverProcess.stdout.on("data", backupHandler);
    }

    merge(): void {
        Util.log("サーバーのマージを開始します", { type: "INFO" });
        this.bedrockServer.stop(true, true);
    }

    transfer(contents: any): void {
        const { player, host, port } = contents;

        this.serverProcess.stdin.write(`transfer ${player} ${host} ${port}\n`);
        Util.log(`${player}を${host}:${port}へ転送しました`, { type: "INFO" });
    }

    kick(contents: any): void {
        const { player, reason } = contents;

        this.serverProcess.stdin.write(`kick ${player} ${reason}\n`);
        Util.log(`${player}をキックしました。理由: ${reason}`, { type: "INFO" });
    }

    allowlist(contents: any): void {
        const { type, name, igLimit } = contents;

        const server = this.serverYaml.server;
        const worldDirPath = path.join(server.path, "worlds/Bedrock level");
        const allowlistPath = path.join(worldDirPath, "allowlist.json");
        const allowlist: any[] = JSON.parse(fs.readFileSync(allowlistPath, "utf-8"));

        switch (type) {
            case "add":
                if (allowlist.find(v => v.name === name)) return;

                allowlist.push({
                    ignoresPlayerLimit: igLimit,
                    name: name
                });
                fs.writeFileSync(allowlistPath, JSON.stringify(allowlist));
                Util.log(`${name} をallowlistに追加しました`, { type: "INFO" });
                break;

            case "remove":
                if (!allowlist.find(v => v.name === name)) return;

                const index = allowlist.findIndex(v => v.name === name);

                allowlist.splice(index, 1);
                fs.writeFileSync(allowlistPath, JSON.stringify(allowlist));
                Util.log(`${name} をallowlistから削除しました`, { type: "INFO" });
                break;
        }
    }
}