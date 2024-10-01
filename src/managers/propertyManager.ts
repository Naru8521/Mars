import * as fs from "fs";

export class PropertyManager {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * propertiesファイル
     */
    public load(): any {
        try {
            const data = fs.readFileSync(this.path, "utf-8");
            const lines = data.split("\n");
            const properties = [];
    
            for (let line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith("#") || trimmedLine === "") {
                    properties.push({
                        type: "comment",
                        value: line
                    });
                } else {
                    const [key, ...value] = trimmedLine.split("=");
                    const trimmedValue = value.join("=").trim();
                    let result;
    
                    if (trimmedValue) {
                        if (Number.isNaN(parseFloat(trimmedValue))) {
                            if (trimmedValue === "true") {
                                result = true;
                            } else if (trimmedValue === "false") {
                                result = false;
                            } else {
                                result = trimmedValue;
                            }
                        } else {
                            result = parseFloat(trimmedValue);
                        }
                    } else {
                        result = trimmedValue;
                    }
    
                    properties.push({
                        type: "property",
                        key: key.trim(),
                        value: result
                    });
                }
            }
    
            return properties;
        } catch (error) {
            throw new Error(`${this.path}が見つかりませんでした`);
        }
    }

    /**
     * keyからvalueを取得します
     * @param key 
     */
    public get(properties: any[], key: string) {
        for (const property of properties) {
            if (property.type === "property" && property.key === key) {
                return property.value;
            }
        }

        return undefined;
    }
}