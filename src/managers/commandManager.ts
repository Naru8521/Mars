import childProcess from "child_process";
import { CustomCommand } from "../util/customCommand";
import type { BedrockServer } from "../core/bedrockServer";
import type { Command } from "../types";

export class CommandManager {
    private customCommand: any;
    private commands: Command[]

    /**
     * @param serverProcess 
     * @param bedrockServer 
     */
    constructor(serverProcess: childProcess.ChildProcessWithoutNullStreams, bedrockServer: BedrockServer, commands: Command[]) {
        this.customCommand = new CustomCommand(serverProcess, bedrockServer);
        this.commands = commands;
    }

    /**
     * コマンドかをチェックする
     * @param log
     * @param console
     */
    public check(log: string, consoleCommand: boolean = false): boolean {
        try {
            if (consoleCommand) {
                const matchingCommand = this.commands.find(v => v.name === log);

                if (matchingCommand && matchingCommand.console) {
                    this.customCommand[matchingCommand.name]();
                    return true;
                }
            } else {
                if (log.includes("MARS:SCRIPT_COMMAND:")) {
                    log = log.replace("MARS:SCRIPT_COMMAND:", "");

                    const command = JSON.parse(log);
                    const { name, contents } = command;
                    const matchingCommand = this.commands.find(v => v.name === name);

                    if (matchingCommand) {
                        this.customCommand[matchingCommand.name](contents);
                        return true;
                    }
                }
            }
        } catch (error: any) {
            return false;
        }

        return false;
    }
}