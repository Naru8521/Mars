import type { Packet } from "../../types";

export default function set_commands_enabledun(packet: Packet): Packet {
    const { params } = packet.data;

    // params.enabled: コマンドの有効化

    return params;
}