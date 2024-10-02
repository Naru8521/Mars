import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as https from "https";
import AdmZip from "adm-zip";
import childProcess from "child_process";
import { YamlManager } from "../managers/yamlManager";
import { Util } from "../util/util";
import { ProxyServer } from "./proxyServer";
import { CommandManager } from "../managers/commandManager";
import type { ServerYaml } from "../types";

const serverURL = "https://minecraft.azureedge.net/bin-{device}/bedrock-server-{version}.zip";
let isRestart = false;
let isMerge = false;

export class BedrockServer {
    private serverYamlPath: string
    private serverYaml: ServerYaml
    private platform: NodeJS.Platform
    private serverProcess: childProcess.ChildProcessWithoutNullStreams | null

    constructor() {
        this.serverYamlPath = path.resolve(__dirname, "../../assets/server.yml");

        if (!fs.existsSync("./server.yml")) {
            fs.copyFileSync(this.serverYamlPath, "./server.yml");
        }

        const yamlManager = new YamlManager("./server.yml");

        yamlManager.merge(this.serverYamlPath);
        this.serverYaml = yamlManager.load()?.[0] as unknown as ServerYaml;
        this.platform = os.platform();
        this.serverProcess = null;

        isRestart = false;
        isMerge = false;
    }

    /**
     * マインクラフトサーバーを起動する
     */
    public async start(merge: boolean = false): Promise<void> {
        const isInitialize = await this.initializeServer();

        if (!isInitialize && (merge || this.serverYaml.server.auto_merge)) {
            await this.merge();
        }

        await this.packsUpdate();

        // プロキシサーバーを起動
        const proxy = new ProxyServer();

        proxy.start();

        this.serverProcess = childProcess.spawn(this.getServerExecutablePath(), [], {
            stdio: ["pipe", "pipe", "pipe"]
        });

        const commandManager = new CommandManager(this.serverProcess, this, [
            { name: "stop", console: true },
            { name: "reload", console: true },
            { name: "restart", console: true },
            { name: "backup", console: true },
            { name: "merge", console: true },
            { name: "allowlist", console: false },
            { name: "kick", console: false },
            { name: "transfer", console: false }
        ]);

        process.stdin.on("data", (data) => {
            if (this.serverProcess) {
                const input = data.toString().trim();

                if (!commandManager.check(input, true)) {
                    this.serverProcess.stdin.write(data);
                }
            }
        });

        this.serverProcess.stdout.on("data", (data) => {
            const lines = data.toString().split("\n");

            lines.forEach((line: string) => {
                if (line.trim()) {
                    let type = "INFO";

                    if (line.includes("INFO")) type = "INFO";
                    if (line.includes("WARN")) type = "WARN";
                    if (line.includes("ERROR")) type = "ERROR";
                    if (line.indexOf("]") !== -1) {
                        line = line.slice(line.indexOf("]") + 1).trim();
                    }

                    line = line.replace("[Scripting]", "").trim();

                    if (!commandManager.check(line)) {
                        if (line.includes("Starting Server")) {
                            line = line.replace("Starting Server", `Starting ${this.serverYaml.server.name} Server`);
                            Util.log(line, { type });
                        } else if (line.includes("Server started.")) {
                            line = line.replace("Server started.", `${this.serverYaml.server.name} server started.`);
                            Util.log(line, { type });
                        } else {
                            Util.log(line, { type });
                        }
                    }
                }
            });
        });

        this.serverProcess.stderr.on("data", (data) => {
            Util.log(data.toString(), { type: "ERROR" });
        });

        this.serverProcess.on("close", async (code, signal) => {
            const server = this.serverYaml.server;
            const backup = server.backup;

            // エラーによる終了かどうかを確認
            if (code !== 0 && code !== null) {
                Util.log(`サーバープロセスがエラーコード ${code} で終了しました`, { type: "ERROR" });
                process.exit(0);
            }

            if (this.serverProcess) {
                this.serverProcess.kill();
                this.serverProcess = null;
            }

            if (backup.server_stop_auto) {
                await Util.handleBackup(this.serverYaml);

                if (backup.server_auto_restart) {
                    await new BedrockServer().start(isMerge);
                    return;
                }
            }

            if (isRestart) {
                await new BedrockServer().start(isMerge);
                return;
            } else {
                process.exit(0);
            }
        });

        this.serverProcess.on("error", (error) => {
            Util.log(`サーバーの起動中にエラーが発生しました: ${error}`, { type: "ERROR" });
        });
    }

    /**
     * マインクラフトサーバーを閉じる
     */
    public stop(restart: boolean = false, merge: boolean = false): void {
        if (this.serverProcess) {
            // 再起動
            isRestart = restart;

            // マージ
            isMerge = merge;

            // サーバープロセスを停止
            this.serverProcess.stdin.write("stop\n");
        } else {
            Util.log("サーバーは既に停止しています", { type: "WARN" });
        }
    }


    /**
     * マインクラフトサーバーを初期化する
     */
    private async initializeServer(): Promise<boolean> {
        if (this.isExecutableFile()) return false;

        Util.log("サーバーの初期化を開始します", { type: "INFO" });

        const downloadURL = this.getDownloadURL();

        if (!downloadURL) return false;

        const server = this.serverYaml.server;
        const zipFilePath = path.join(server.path, this.getZipFile());
        const downloadSuccess = await this.downloadFile(downloadURL, zipFilePath);

        if (!downloadSuccess) return false;

        await this.unzipServerFile(zipFilePath);
        Util.log("サーバーの初期化が完了しました", { type: "INFO", txtColor: "greenBright" });

        if (this.serverYaml.proxy.host === "127.0.0.1") {
            Util.log("server.ymlのproxy.hostを設定してください。", { type: "SYSTEM", logColor: "yellow" });
            process.exit(0);
        }

        return true;
    }

    /**
     * サーバーのマージ
     */
    private async merge(): Promise<boolean> {
        Util.log("サーバーのマージを開始します", { type: "INFO" });

        const server = this.serverYaml.server;
        const downloadURL = this.getDownloadURL();

        if (!downloadURL) return false;

        const zipFilePath = path.join(server.path, this.getZipFile());
        const downloadSuccess = await this.downloadFile(downloadURL, zipFilePath);

        if (!downloadSuccess) return false;

        await this.unzipServerFile(zipFilePath);
        Util.log("サーバーのマージが完了しました", { type: "INFO", txtColor: "greenBright" });
        return true;
    }

    /**
     * マインクラフトサーバーの実行ファイルがあるかを確認する
     */
    private isExecutableFile(): boolean {
        const server = this.serverYaml.server;
        const serverFolderPath = path.join(server.path);

        if (!fs.existsSync(serverFolderPath)) {
            fs.mkdirSync(serverFolderPath, { recursive: true });
            Util.log(`${server.path}フォルダーを作成しました`, { type: "INFO", txtColor: "greenBright" });
            return false;
        }

        const files = fs.readdirSync(serverFolderPath);

        for (const file of files) {
            if (
                (this.platform === "win32" && file === "bedrock_server.exe") ||
                (this.platform === "linux" && file === "bedrock_server")
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * 実行ファイルのパスを取得する
     */
    private getServerExecutablePath(): string {
        const server = this.serverYaml.server;
        const serverFolderPath = path.join(server.path);

        return path.join(serverFolderPath, this.platform === "win32" ? "bedrock_server.exe" : "bedrock_server");
    }

    /**
     * サーバーのダウンロードURLを取得する
     */
    private getDownloadURL(): string {
        const server = this.serverYaml.server;
        let url = serverURL;

        switch (this.platform) {
            case "win32":
                url = serverURL.replace("{device}", "win").replace("{version}", server.version);
                return url;

            case "linux":
                url = serverURL.replace("{device}", "linux").replace("{version}", server.version);
                return url;

            default:
                throw new Error("無効なデバイスです");
        }
    }

    /**
     * zipファイルを取得する
     */
    private getZipFile(): string {
        const server = this.serverYaml.server;

        return `bedrock-server-${server.version}.zip`;
    }

    /**
     * サーバーをダウンロードする
     */
    private downloadFile(url: string, filePath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(filePath);

            https.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`ファイルダウンロードに失敗しました: ${response.statusCode}`));
                    return;
                }

                response.pipe(fileStream);
                fileStream.on("finish", () => {
                    fileStream.close();
                    Util.log("サーバーのダウンロードが完了しました", { type: "INFO", txtColor: "greenBright" })
                    resolve(true);
                });
            }).on("error", (error) => {
                fs.unlinkSync(filePath);
                reject(new Error(`サーバーのダウンロード中にエラーが発生しました: ${error.message}`));
            });
        });
    }

    /**
     * zipファイルを解凍する
     */
    private unzipServerFile(zipFilePath: string): Promise<boolean> {
        const server = this.serverYaml.server;
        const folderPath = path.join(server.path);
        const excludedPaths = this.getExcludedPaths();

        return new Promise((resolve, reject) => {
            try {
                const zip = new AdmZip(zipFilePath);
                const zipEntries = zip.getEntries();

                zipEntries.forEach((entry) => {
                    const entryPath = path.join(folderPath, entry.entryName);

                    if (excludedPaths.some(excludedPath => entryPath.includes(excludedPath))) {
                        if (!fs.existsSync(entryPath)) {
                            zip.extractEntryTo(entry, folderPath, true, true);
                        }
                    } else {
                        zip.extractEntryTo(entry, folderPath, true, true);
                    }
                });

                fs.unlinkSync(zipFilePath);
                Util.log("zipファイルの解凍が完了しました", { type: "INFO", txtColor: "greenBright" });
                resolve(true);
            } catch (error) {
                reject(new Error(`zipファイルの解凍中にエラーが起きました: ${error}`));
            }
        });
    }

    /**
     * マージ除外ファイルまたはフォルダ
     */
    private getExcludedPaths(): string[] {
        return [
            "config",
            "development_behavior_packs",
            "development_resource_packs",
            "development_skin_packs",
            "allowlist.json",
            "permissions.json",
            "server.properties",
            "worlds"
        ];
    }

    /**
     * ビヘイビアパック、リソースパックのmanifestをサーバーに適用する
     */
    private packsUpdate(): Promise<void> | void {
        const server = this.serverYaml.server;

        if (!server.packs_auto_update) return;

        return new Promise((resolve, reject) => {
            const server = this.serverYaml.server;
            const folderPath = server.path;

            const development_behavior_packs_path = `./${folderPath}/development_behavior_packs`;
            const development_resource_packs_path = `./${folderPath}/development_resource_packs`;

            const behavior_packs_path = `./${folderPath}/worlds/Bedrock level/behavior_packs`;
            const resource_packs_path = `./${folderPath}/worlds/Bedrock level/resource_packs`;

            const behavior_packsJson_path = `./${folderPath}/worlds/Bedrock level/world_behavior_packs.json`;
            const resource_packsJson_path = `./${folderPath}/worlds/Bedrock level/world_resource_packs.json`;

            const behavior_packsJson = [];
            const resource_packsJson = [];

            behavior_packsJson.push(...this.updatePacksJson(development_behavior_packs_path));
            behavior_packsJson.push(...this.updatePacksJson(behavior_packs_path));

            resource_packsJson.push(...this.updatePacksJson(development_resource_packs_path));
            resource_packsJson.push(...this.updatePacksJson(resource_packs_path));

            fs.writeFileSync(behavior_packsJson_path, JSON.stringify(behavior_packsJson, null, 2), "utf-8");
            fs.writeFileSync(resource_packsJson_path, JSON.stringify(resource_packsJson, null, 2), "utf-8");

            Util.log("behavior_packs.jsonを更新しました", { type: "INFO", txtColor: "yellowBright" });
            Util.log("resource_packs.jsonを更新しました", { type: "INFO", txtColor: "yellowBright" });
            resolve();
        });
    }

    /**
     * パックをアップデートする
     * @param dirPath 
     */
    private updatePacksJson(dirPath: string): any[] {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const dir = fs.readdirSync(dirPath, "utf-8");
        let packsJson = [];

        for (const file of dir) {
            const filePath = `${dirPath}/${file}`;
            const manifestPath = `${filePath}/manifest.json`;

            const manifestString = fs.readFileSync(manifestPath, "utf-8");
            const manifest = JSON.parse(manifestString);

            const uuid = manifest.header.uuid;
            const version = manifest.header.version;
            const end = manifest.header.end;

            packsJson.push({
                "pack_id": uuid,
                "version": version
            });
        }

        return packsJson;
    }
}