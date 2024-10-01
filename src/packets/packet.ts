import minecraft_data from "minecraft-data";
const { FullPacketParser, Serializer, Parser, ProtoDef } = require('protodef');
const { ProtoDefCompiler } = require("protodef").Compiler;

export function test(packet: Buffer) {
    const data = minecraft_data(729);
    const protocol = data.protocol;
    const types = protocol.types;

    // compiler.addTypesToCompile(types);
    // const compiledProto = compiler.compileProtoDefSync();
    // const deserializer = new FullPacketParser(compiledProto, "mcpe_packet");
    // console.log(deserializer);
}
// https://github.com/PrismarineJS/minecraft-classic-protocol