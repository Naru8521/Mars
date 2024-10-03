import minecraft_data from "minecraft-data";
const { FullPacketParser, Serializer, Parser, ProtoDef } = require('protodef');
const { ProtoDefCompiler } = require("protodef").Compiler;

export function test(packet: Buffer) {
    // Minecraftのバージョンに対応するデータを取得（例: 1.16.5のバージョン番号は 729）
    const data = minecraft_data(729);  // ここでバージョン番号を指定
    const protocol = data.protocol;
    const types = protocol.types;

    // ProtoDefインスタンスを作成し、Minecraftのプロトコルに対応する型を登録
    const proto = new ProtoDef();
    proto.addTypes(types);  // 必要な型をProtoDefに追加

    // パーサーを設定
    const parser = new FullPacketParser(proto, "packet");

    // パケットをパース
    try {
        const parsedData = parser.parsePacketBuffer(packet);
        console.log("Parsed Packet:", parsedData);
    } catch (error) {
        console.error("Error parsing packet:", error);
    }
}
// https://github.com/PrismarineJS/minecraft-classic-protocol