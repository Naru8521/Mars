import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function openConnectionReply1(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットId
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    // magic
    const magic = packet.subarray(reading_byte_index, reading_byte_index + 16).toString("hex");
    Util.log(`magic: ${magic}`, option);
    reading_byte_index += 16;

    // server guid
    const server_guid = packet.readBigInt64BE(reading_byte_index);
    Util.log(`server_guid: ${server_guid}`, option);
    reading_byte_index += 8;

    // Use security?(bool)
    const is_use_security = packet[reading_byte_index] === 1;
    Util.log(`is_use_security: ${is_use_security}`, option);
    reading_byte_index += 1;

    // cookie
    if (is_use_security) {
        const cookie = packet.readInt32BE(reading_byte_index);

        Util.log(`cookie: ${cookie}`, option);
        reading_byte_index += 4;
    }

    // MTU
    const mtu = packet.readInt16BE(reading_byte_index);
    Util.log(`mtu: ${mtu}`, option);
    reading_byte_index += 2;

    return packet;
}