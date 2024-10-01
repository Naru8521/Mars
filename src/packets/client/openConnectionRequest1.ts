import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function openConnectionRequest1(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットId
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    // magic
    const magic = packet.subarray(reading_byte_index, reading_byte_index + 16).toString("hex");
    Util.log(`magic: ${magic}`, option);
    reading_byte_index += 16;

    // protcol version(多分raknetの)
    const protcol_version = packet[reading_byte_index];
    Util.log(`protcol_version: ${protcol_version}`, option);
    reading_byte_index += 1;

    // 残りはゼロパディング(MTUを測るためらしい)
    Util.log(`zero padding length: ${packet.byteLength - reading_byte_index}`, option);

    return packet;
}