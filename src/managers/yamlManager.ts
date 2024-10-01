import * as fs from "fs";
import * as yaml from "js-yaml";

export class YamlManager {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * YAMLファイルを読み込む
     */
    public load(): any[] | undefined {
        try {
            const fileContents = fs.readFileSync(this.path, "utf-8");
            const data = yaml.loadAll(fileContents);

            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        } catch (error) {
            throw new Error("YAMLの読み込みに失敗しました");
        }
    }

    /**
     * YAMLファイルから特定のプロパティの値を取得する
     * @param property 
     */
    public get(property: string): any | undefined {
        const data = this.load();

        if (data) {
            for (const doc of data) {
                if (typeof doc === "object" && doc !== null && property in doc) {
                    return doc[property];
                }
            }
        }
    }

    /**
     * YAMLファイルを生テキストとして読み込む
     * @param path
     */
    private loadRaw(path: string): string {
        if (!fs.existsSync(path)) {
            throw new Error(`YAMLファイルが存在しません: ${path}`);
        }

        try {
            return fs.readFileSync(path, "utf-8");
        } catch (error) {
            throw new Error("YAMLの読み込みに失敗しました");
        }
    }

    /**
     * コメントを保持したままYAMLファイルをマージする
     * @param sourcePath 
     */
    public merge(sourcePath: string): void {
        const sourceRaw = this.loadRaw(sourcePath);
        const targetRaw = this.loadRaw(this.path);

        const sourceLines = sourceRaw.split("\n");
        const targetLines = targetRaw.split("\n");

        const mergedYaml = this.mergeLines(sourceLines, targetLines);

        fs.writeFileSync(this.path, mergedYaml.join("\n"), "utf-8");
    }

    /**
     * マージする
     * @param sourceLines ソースの行
     * @param targetLines ターゲットの行
     */
    private mergeLines(sourceLines: string[], targetLines: string[]): string[] {
        const resultLines: string[] = [];
        const processedKeys = new Set<string>();
        const processedComments = new Set<string>();

        // ソースファイルの順番で処理
        for (let i = 0; i < sourceLines.length; i++) {
            const sourceLine = sourceLines[i];
            const trimmedSourceLine = sourceLine.trim();

            if (trimmedSourceLine.startsWith("#") || !trimmedSourceLine) {
                // コメント行や空行をそのまま保持
                resultLines.push(sourceLine);
                processedComments.add(trimmedSourceLine);
            } else {
                const sourceKey = this.extractKeyFromLine(trimmedSourceLine);
                const targetLineIndex = targetLines.findIndex(line => this.extractKeyFromLine(line.trim()) === sourceKey);

                if (targetLineIndex !== -1) {
                    // ターゲットに同じキーが存在する場合、その値を保持
                    resultLines.push(targetLines[targetLineIndex]);
                    processedKeys.add(sourceKey);
                } else {
                    // ターゲットにない場合はソースの値をそのまま追加
                    resultLines.push(sourceLine);
                }

                // ソースに関連するコメント行も追加する
                this.addSourceComments(sourceLines, i, resultLines, processedComments);
            }
        }

        // ターゲットに存在するがソースにないプロパティは追加しない（削除する）
        return resultLines;
    }

    /**
     * ソースファイルからプロパティに関連するコメント行を追加
     * @param sourceLines ソースの全行
     * @param index プロパティ行のインデックス
     * @param resultLines マージ結果の行
     * @param processedComments 処理済みのコメントセット
     */
    private addSourceComments(sourceLines: string[], index: number, resultLines: string[], processedComments: Set<string>) {
        let i = index - 1;
        while (i >= 0 && sourceLines[i].trim().startsWith("#")) {
            if (!processedComments.has(sourceLines[i].trim())) {
                resultLines.push(sourceLines[i]);
                processedComments.add(sourceLines[i].trim());
            }
            i--;
        }
    }

    /**
     * 行からキーを抽出する
     * @param line 
     * @returns 
     */
    private extractKeyFromLine(line: string): string {
        const colonIndex = line.indexOf(":");
        return colonIndex !== -1 ? line.substring(0, colonIndex).trim() : line;
    }
}
