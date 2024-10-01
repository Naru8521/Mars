import * as fs from "fs";
import * as path from "path";
import cli from "cli-color";
import { FileManager } from "../managers/fileManager";
import type { LogOption, ServerYaml } from "../types";

export class Util {
    public static getFormattedTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    public static createTimeStampStrings() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const underscoreFormat = `${year}_${this.padZero(month)}_${this.padZero(day)}_${this.padZero(hours)}_${this.padZero(minutes)}_${this.padZero(seconds)}`;

        return underscoreFormat;
    }

    /**
     * 数値が1桁の場合、先頭にゼロを追加する関数
     * @param num
     */
    private static padZero(num: number) {
        return num.toString().padStart(2, "0");
    }

    /**
     * ログをカスタマイズして出力します
     * @param log 
     * @param option 
     */
    public static log(log: string | string[], option?: LogOption) {
        const cl = cli as any;
        const timestamp = this.getFormattedTimestamp();

        // タイムスタンプのカラー設定
        const timeColor = option?.timeColor ? cl[option.timeColor] : cl.cyan;
        let customLog = timeColor(timestamp) + cl.blackBright(" | ");

        // ログのタイプがある場合の処理
        if (option?.type) {
            const logType = option.type;
            const typeColorMap: { [key: string]: any } = {
                INFO: cl.cyanBright,
                WARN: cl.yellow,
                ERROR: cl.red,
            };
            const typeColor = option.logColor ? cl[option.logColor] : typeColorMap[logType] || cl.cyanBright;

            customLog += typeColor(logType) + cl.blackBright(" | ");
        }

        // メッセージのカラー設定
        const message = Array.isArray(log) ? log.join("") : log;
        const txtColor = option?.txtColor ? cl[option.txtColor] : cl.white;
        customLog += txtColor(message);

        // コンソールに出力
        console.log(customLog);
    }

    /**
     * バックアップを実行
     * @param serverYaml 
     */
    public static async handleBackup(serverYaml: ServerYaml) {
        const backupsDirPath = "./backups";
        const backupDirPath = path.join(backupsDirPath, Util.createTimeStampStrings());
        const server = serverYaml.server;
        const backup = server.backup;
        const worldDirPath = path.join(server.path, "worlds/Bedrock level");

        if (!fs.existsSync(backupsDirPath)) {
            fs.mkdirSync(backupsDirPath);
        }

        if (!fs.existsSync(backupDirPath)) {
            fs.mkdirSync(backupDirPath);
        }

        try {
            await FileManager.copyFile(path.join(server.path, "server.properties"), path.join(backupDirPath, "server.properties"));
            await FileManager.copyFile(path.join(server.path, "allowlist.json"), path.join(backupDirPath, "allowlist.json"));
            await FileManager.copyFile(path.join(server.path, "permissions.json"), path.join(backupDirPath, "permissions.json"));
            await FileManager.copyFile(path.join(worldDirPath, "level.dat"), path.join(backupDirPath, "Bedrock level", "level.dat"));
            await FileManager.copyFile(path.join(worldDirPath, "level.dat_old"), path.join(backupDirPath, "Bedrock level", "level.dat_old"));
            await FileManager.copyFile(path.join(worldDirPath, "levelname.txt"), path.join(backupDirPath, "Bedrock level", "levelname.txt"));
            await FileManager.copyDirectory(path.join(worldDirPath, "db"), path.join(backupDirPath, "Bedrock level", "db"));

            if (backup.auto_delete) {
                Util.log("バックアップ自動削除が有効です。削除を開始します", { type: "INFO" });

                if (backup.max_data < 1) {
                    Util.log(`backup max dataは1以上の値でなければなりません。指定された値: ${backup.max_data}`, { type: "ERROR" });
                    return;
                }

                const backupDirs = fs.readdirSync(backupsDirPath)
                    .filter((fileName) => fs.statSync(path.join(backupsDirPath, fileName)).isDirectory())
                    .map(fileName => ({
                        name: fileName,
                        time: fs.statSync(path.join(backupsDirPath, fileName)).mtime.getTime()
                    }))
                    .sort((a, b) => a.time - b.time);

                if (backupDirs.length > backup.max_data) {
                    const excessBackups = backupDirs.slice(0, backupDirs.length - backup.max_data);

                    for (const backup of excessBackups) {
                        const backupPath = path.join(backupsDirPath, backup.name);

                        await FileManager.deleteDirectory(backupPath);
                        Util.log(`古いバックアップを削除しました: ${backupPath}`, { type: "INFO" });
                    }
                }
            }

        } catch (error: any) {
            throw new Error(error);
        }
    }
}