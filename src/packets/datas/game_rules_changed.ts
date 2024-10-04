import type { Packet } from "../../types";

export default function game_rules_changed(packet: Packet): Packet {
    const { params } = packet.data;

    // params.rules: ゲームルール

    return params;
}