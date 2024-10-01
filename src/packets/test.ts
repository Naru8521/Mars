import zlib from "zlib";
import minecraft_data from "minecraft-data";
const { FullPacketParser, Serializer } = require('protodef');
const { ProtoDefCompiler, CompiledProtodef } = require("protodef").Compiler;
const [readVarInt, writeVarInt, sizeOfVarInt] = require("protodef").types.varint;

export function decode(buf: Buffer) {
    if (buf[0] !== 0xfe) return;

    const buffer = buf.subarray(0);
    let decompressed;

    try {
        decompressed = zlib.inflateRawSync(buffer, { chunkSize: 512000 })
    } catch (e) {
        decompressed = buffer;
    }

    return getPackets(decompressed);
}

/*
const protocol = minecraft_data(729).protocol;
const compiler = new ProtoDefCompiler();

compiler.addTypesToCompile(protocol.types)
compiler.addTypes(require("../datatypes/compiler-minecraft"));
compiler.addTypes(require('prismarine-nbt/zigzag').compiler);

const compiledProto = compiler.compileProtoDefSync();
const deserializer = new FullPacketParser(compiledProto, "mcpe_packet");
*/

export function getPackets(buffer: Buffer) {
    const packets = []
    let offset = 0

    while (offset < buffer.byteLength) {
        const { value, size } = readVarInt(buffer, offset);
        const dec = Buffer.allocUnsafe(value);

        offset += size;
        offset += buffer.copy(dec, 0, offset, offset + value);
        packets.push(dec);
    }

    for (const packet of packets) {
        // console.log(packet);
    }
}