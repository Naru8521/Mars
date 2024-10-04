import type { Packet } from "../../types";

export default function set_health(packet: Packet): Packet {
    const { params } = packet.data;

    // params.health: プレイヤーの体力

    return params;
}