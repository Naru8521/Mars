import type { Packet } from "../../types";

export default function mob_effect(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.event_id: イベントID
    // params.effect_id: エフェクトID
    // params.amplifier: レベル
    // params.particles: パーティクル表示
    // params.duration: 時間
    // params.tick: このイベントが起こったゲーム内時間

    return params;
}