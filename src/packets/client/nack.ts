import { Util } from "../../util/util";
import type { LogOption } from "../../types";

export default function nack(packet: Buffer, option: LogOption) {
    let reading_byte_index = 1;

    // パケットId
    Util.log(`packet id: 0x${packet[0].toString(16)}`, option);

    //レコード数
    const record_count = packet.readIntBE(reading_byte_index, 2);
    Util.log(`record_count: ${record_count}`, option);
    reading_byte_index += 2;

    //シングルシーケンス番号か？
    const is_single_sequence_number = packet[reading_byte_index] === 1;
    Util.log(`is_single_sequence_number: ${is_single_sequence_number}`, option);
    reading_byte_index += 1;

    if (is_single_sequence_number) {
        //シングルシーケンスの場合
        //シーケンス番号(3byte)
        const sequence_number = packet.readUintLE(reading_byte_index, 3);
        Util.log(`sequence_number: ${sequence_number}`, option);
        reading_byte_index += 3;
    } else {
        //シーケンスが複数の場合
        //開始シーケンス番号(3byte)
        const start_sequence_number = packet.readUintLE(reading_byte_index, 3);
        Util.log(`start_sequence_number: ${start_sequence_number}`, option);
        reading_byte_index += 3;

        //終了シーケンス番号(3byte)
        const end_sequence_number = packet.readUintLE(reading_byte_index, 3);
        Util.log(`end_sequence_number: ${end_sequence_number}`, option);
        reading_byte_index += 3;
    }

    return packet;
}