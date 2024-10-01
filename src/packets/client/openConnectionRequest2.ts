import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function openConnectionRequest2(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットID
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    // magic
    const magic = Buffer.from(packet.buffer.slice(reading_byte_index, reading_byte_index + 16)).toString("hex");
    Util.log(`magic: ${magic}`, option);
    reading_byte_index += 16;

    // server address
    const server_address = packet.subarray(reading_byte_index, reading_byte_index + 7);
    Util.log(`ip version: ${server_address[0]}`, option);

    // IPアドレスのバイトをそのまま取得し、ドット区切りで結合する
    const address = [...server_address.subarray(1, 5)].join('.');
    Util.log(`address: ${address}`, option);

    // port
    const port = server_address.readUInt16BE(5);
    Util.log(`port: ${port}`, option);

    reading_byte_index += 7;

    return packet;
}