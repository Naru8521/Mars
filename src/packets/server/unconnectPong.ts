import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function unconnectPong(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットId
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    //time
    const time = packet.readBigInt64BE(reading_byte_index);
    Util.log(`time: ${time}`, option);
    reading_byte_index += 8;

    //server guid
    const server_guid = packet.readBigInt64BE(reading_byte_index);
    Util.log(`server_guid: ${server_guid}`, option);
    reading_byte_index += 8;

    //magic
    const magic = packet.subarray(reading_byte_index, reading_byte_index + 16).toString("hex");
    Util.log(`magic: ${magic}`, option);
    reading_byte_index += 16;

    //server motd(short + string)
    const motd_length = packet.readIntBE(reading_byte_index, 2);
    Util.log(`motd_length: ${motd_length}`, option);
    reading_byte_index += 2;

    const motd = packet.subarray(reading_byte_index, reading_byte_index + motd_length).toString();
    Util.log(`motd: ${motd}`, option);

    const motdParts = motd.split(";");

    if (motdParts.length >= 10) {
        Util.log(`Edition: ${motdParts[0]}`, option);
        Util.log(`MOTD line 1: ${motdParts[1]}`, option);
        Util.log(`Protocol Version: ${motdParts[2]}`, option);
        Util.log(`Version Name: ${motdParts[3]}`, option);
        Util.log(`Player Count: ${motdParts[4]}`, option);
        Util.log(`Max Player Count: ${motdParts[5]}`, option);
        Util.log(`Server Unique ID: ${motdParts[6]}`, option);
        Util.log(`MOTD line 2: ${motdParts[7]}`, option);
        Util.log(`Game mode: ${motdParts[8]}`, option);
        Util.log(`Game mode (numeric): ${motdParts[9]}`, option);
        Util.log(`Port (IPv4): ${motdParts[10]}`, option);

        if (motdParts.length > 11) {
            Util.log(`Port (IPv6): ${motdParts[11]}`, option);
        }
    }

    return packet;
}