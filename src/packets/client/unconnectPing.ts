import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function unconnectPing(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットID
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    // time
    const time = packet.readBigInt64BE(reading_byte_index);
    Util.log(`time: ${time}`, option);
    reading_byte_index += 8;

    // magic
    const magic = packet.subarray(reading_byte_index, reading_byte_index + 16).toString("hex");
    Util.log(`magic: ${magic}`, option);
    reading_byte_index += 16;

    // client guid
    const client_guid = packet.readBigInt64BE(reading_byte_index);
    Util.log(`client_guid: ${client_guid}`, option);
    reading_byte_index += 8;

    return packet;
}