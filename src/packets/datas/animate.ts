import type { Packet } from "../../types";

export default function animate(packet: Packet): Packet {
    const { params } = packet.data;

    // params.action_id: アニメーションID
    // params.runtime_entity_id: ランタイムエンティティID
    // params.boat_rowing_time: 漕ぐアニメーション

    return params;
}