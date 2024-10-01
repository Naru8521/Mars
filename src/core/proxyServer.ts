import * as path from "path";
import dgram from "dgram";
import ServerPacket from "../packets/serverPacket";
import ClientPacket from "../packets/clientPacket";
import { YamlManager } from "../managers/yamlManager";
import { PropertyManager } from "../managers/propertyManager";
import { Util } from "../util/util";
import type { Proxy, Server, sessionObject } from "../types";

export class ProxyServer {
    private clientSocket: dgram.Socket;
    private sessions: Map<string, sessionObject>

    private proxy_host: string;
    private proxy_port: number;

    private server_host: string;
    private server_port: number;

    constructor() {
        this.clientSocket = dgram.createSocket("udp4");
        this.sessions = new Map();

        const serverYaml = new YamlManager("./server.yml");
        const proxy: Proxy = serverYaml.get("proxy");

        this.proxy_host = proxy.host;
        this.proxy_port = proxy.port;

        const server: Server = serverYaml.get("server");
        const serverPath = path.join(server.path);
        const propertyManager = new PropertyManager(path.join(serverPath, "server.properties"));
        const properties = propertyManager.load();

        this.server_host = "localhost";
        this.server_port = propertyManager.get(properties, "server-port");
    }

    /**
     * プロキシサーバーをUDPで起動
     */
    public start(): void {
        this.clientSocket.bind(this.proxy_port, this.proxy_host, () => {
            Util.log(`プロキシサーバーがポート${this.proxy_port}番で起動しました`, { type: "INFO" });
        });

        this.clientSocket.on("error", (err) => {
            console.error(`UDP server error: ${err}`);
            this.clientSocket.close();
        });

        this.clientSocket.on("message", (packet, rinfo) => {
            this.handleClientMessage(packet, rinfo);
        });
    }

    /**
     * プロキシサーバーを停止
     */
    public async stop(): Promise<void> {
        Util.log("プロキシサーバーを停止します...", { type: "INFO" });

        return new Promise((resolve, reject) => {
            // クライアントソケットを閉じる
            this.clientSocket.close(() => {
                Util.log("クライアントソケットを閉じました", { type: "INFO" });

                // すべてのセッションのサーバーソケットを閉じる
                for (const [sessionKey, session] of this.sessions) {
                    session.serverSocket.close();
                }

                // セッションマップをクリア
                this.sessions.clear();
                Util.log("プロキシサーバーが停止しました", { type: "INFO" });
                resolve();
            });
        });
    }

    /**
     * クライアントからのメッセージを処理する
     * @param packet 
     * @param rinfo 
     */
    private handleClientMessage(packet: Buffer, rinfo: dgram.RemoteInfo) {
        const sessionKey = `${rinfo.address}:${rinfo.port}`;

        packet = ClientPacket(packet);

        if (!this.sessions.has(sessionKey)) {
            const serverSocket = dgram.createSocket("udp4");
            const serverAddress = {
                address: this.server_host,
                port: this.server_port
            };

            this.sessions.set(sessionKey, {
                clientAddress: rinfo.address,
                clientPort: rinfo.port,
                serverSocket
            });

            serverSocket.on("message", (packet, serverRinfo) => {
                this.handleServerMessage(sessionKey, packet);
            });

            serverSocket.send(packet, serverAddress.port, serverAddress.address, (err: any) => {
                if (err) {
                    Util.log(err, { type: "ERROR" });
                }
            });
        } else {
            const session = this.sessions.get(sessionKey);

            if (session) {
                session.serverSocket.send(packet, this.server_port, this.server_host);
            }
        }
    }

    /**
     * サーバーからのメッセージを処理
     * @param sessionKey
     * @param packet
     */
    private handleServerMessage(sessionKey: string, packet: Buffer) {
        const session = this.sessions.get(sessionKey);

        packet = ServerPacket(packet);

        if (session) {
            this.clientSocket.send(packet, session.clientPort, session.clientAddress);
        }
    }
}