import * as fs from "fs";
import * as path from "path";

export class FileManager {
    /**
     * ファイルをコピー
     * @param sourcePath 
     * @param outputPath 
     */
    static async copyFile(sourcePath: string, outputPath: string): Promise<void> {
        try {
            if (!fs.existsSync(sourcePath)) return;

            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.copyFileSync(sourcePath, outputPath);
        } catch { }
    }

    /**
     * ディレクトリーをコピー
     * @param sourcePath
     * @param outputPath
     */
    static async copyDirectory(sourcePath: string, outputPath: string): Promise<void> {
        try {
            fs.mkdirSync(outputPath, { recursive: true });

            const files = fs.readdirSync(sourcePath);

            for (const file of files) {
                const srcPath = path.join(sourcePath, file);
                const outPath = path.join(outputPath, file);
                const stats = fs.statSync(srcPath);

                if (stats.isDirectory()) {
                    FileManager.copyDirectory(srcPath, outPath);
                } else {
                    FileManager.copyFile(srcPath, outPath);
                }
            }
        } catch { }
    }

    /**
     * ファイルを削除
     * @param filePath
     */
    static async deleteFile(filePath: string): Promise<void> {
        try {
            fs.unlinkSync(filePath);
        } catch { }
    }

    /**
     * ディレクトリーを削除
     * @param directoryPath
     */
    static async deleteDirectory(directoryPath: string): Promise<void> {
        try {
            fs.rmSync(directoryPath, { recursive: true, force: true });
        } catch { }
    }
}