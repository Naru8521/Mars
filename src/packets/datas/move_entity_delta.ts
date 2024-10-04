import type { Packet } from "../../types";

export default function move_entity_delta(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.flags: エンティティの移動に関する特定のフラグ
    // params.x | y | z: エンティティの移動量
    // params.rot_x | rot_y | rot_z: エンティティの回転量

    return params;
}