import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function ready(packet: Buffer, option: LogOption) {
    // パケットId
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    // ステータス
    const status = packet.readUInt8(1);
    Util.log(`Status: ${status}`, option);

    return packet;
}