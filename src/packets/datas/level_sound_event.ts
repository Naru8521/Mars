import type { Packet } from "../../types";

export default function level_sound_event(packet: Packet): Packet {
    const { params } = packet.data;

    // params.sound_id: 発生するサウンドの種類
    // params.position: サウンドが発生するワールド内の座標
    // params.extra_data: サウンドイベントに付随する追加のデータ
    // params.entity_type: サウンドに関連するエンティティの種類
    // params.is_baby_mob: このサウンドイベントが子供のモブに関連しているか
    // paramsis_global: サウンドが全体に聞こえるか

    return params;
}