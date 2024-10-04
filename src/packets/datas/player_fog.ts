import type { Packet } from "../../types";

export default function player_fog(packet: Packet): Packet {
    const { params } = packet.data;

    // params.stack: プレイヤーの霧

    return params;
}