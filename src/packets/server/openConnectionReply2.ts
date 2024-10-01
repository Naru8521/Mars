import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function openConnectionReply2(packet: Buffer, option: LogOption) {
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

    // client address(長さ7番しか作ってない)
    const client_address = Buffer.from(packet.buffer.slice(reading_byte_index, reading_byte_index + 7));
    Util.log(`ip version: ${client_address[0]}`, option);

    const address = [...client_address.subarray(1, 1 + 4)].map((v) => parseInt(v.toString(2).replace(/1/g, "_1").replace(/0/g, "1").replace(/_1/g, "0"), 2));
    Util.log(`address: ${address}`, option);

    // MTU
    const mtu = packet.readInt16BE(reading_byte_index);
    Util.log(`mtu: ${mtu}`, option);
    reading_byte_index += 2;

    // 暗号化が有効か
    const is_encryption_enabled = packet[reading_byte_index] === 1;
    Util.log(`is_encryption_enabled: ${is_encryption_enabled}`, option);
    reading_byte_index += 1;

    return packet;
}