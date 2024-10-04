import type { Packet } from "../../types";

export default function chunk_radius_update(packet: Packet): Packet {
    const { params } = packet.data;

    // params.chunk_radius: プレイヤーを中心にして読み込まれるチャンクの半径

    return params;
}