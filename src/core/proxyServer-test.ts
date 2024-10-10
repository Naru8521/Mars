import { PropertyManager } from "../managers/propertyManager";
import { YamlManager } from "../managers/yamlManager";
import type { Proxy, sessionObject, Server } from "../types";
import path from "path";
import { Client, Server as rakServer } from "jsp-raknet"; // RakNetライブラリ
import dgram from "dgram";

export class ProxyServer_test {
    private raknetClient: rakServer;
    private sessions: Map<string, sessionObject>;

    private proxy_host: string;
    private proxy_port: number;

    private server_host: string;
    private server_port: number;

    constructor() {
        this.sessions = new Map();

        const serverYaml = new YamlManager("./server.yml");
        const proxy: Proxy = serverYaml.get("proxy");

        this.proxy_host = proxy.host;
        this.proxy_port = proxy.port;

        const server: Server = serverYaml.get("server");
        const propertyManager = new PropertyManager(path.join(server.path, "server.properties"));
        const properties = propertyManager.load();

        this.server_host = "localhost";
        this.server_port = propertyManager.get(properties, "server-port");

        this.raknetClient = new rakServer(this.proxy_host, this.proxy_port, {
            motd: "test",
            version: "1.21.31",
            protocol: 11,
            serverId: "5219",
            name: "test",
            players: {
                online: 0,
                max: 10
            },
            gamemode: "creative"
        });

        this.raknetClient.startTicking();
        this.raknetClient.listen().then(() => {
            this.start();
        });
    }

    public start(): void {
        this.raknetClient.socket.on("message", (msg, rinfo) => {
            console.log(msg);
        });

        this.raknetClient.on("message", () => {
            console.log("TEST")
        });
        /*
        const udpServer = dgram.createSocket("udp4");

        udpServer.bind(this.proxy_port, this.proxy_host, () => {
            console.log("UDPサーバーが起動しました");
        });

        // UDPクライアントからのパケットを受信
        udpServer.on("message", (msg, rinfo) => {
            console.log(`クライアントからのUDPメッセージ: ${msg.toString()}`);

            // クライアントから受信したデータをRakNetサーバーに転送
            if (this.raknetClient) {
                this.raknetClient.sendBuffer(msg, {
                    address: rinfo.address,
                    port: rinfo.port,
                    version: 11,
                    hash: ""
                });
            } else {
                console.error("RakNetクライアントは接続されていません。");
            }
        });

        // RakNetサーバーからのレスポンスを受信し、クライアントに返送
        this.raknetClient.on("encapsulated", (packet) => {
            console.log("RakNetサーバーからのパケットを受信: ", packet);

            // クライアントに返送（rinfoを使って元のクライアントに返す）
            udpServer.send(packet.buffer, rinfo.port, rinfo.address, (err) => {
                if (err) {
                    console.error(`クライアントへの送信エラー: ${err}`);
                }
            });
        });
        */
    }
}
