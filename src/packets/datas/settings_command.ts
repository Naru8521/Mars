import type { Packet } from "../../types";

export default function settings_command(packet: Packet): Packet {
    const { params } = packet.data;

    // params.command_line: コマンドライン
    // params.suppress_output: 出力を抑える

    return params;
}