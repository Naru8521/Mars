import type { Packet } from "../../types";

export default function set_entity_motion(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.velocity: 移動速度ベクトル
    // params.tick: エンティティのモーションが設定されたゲーム内のティック数

    return params;
}