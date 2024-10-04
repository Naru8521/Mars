import type { Packet } from "../../types";

export default function respawn(packet: Packet): Packet {
    const { params } = packet.data;

    // params.position: スポーンポジション
    // params.state: ステート
    // params.runtime_entity_id: エンティティID

    return params;
}