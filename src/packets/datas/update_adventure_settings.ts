import type { Packet } from "../../types";

export default function update_adventure_settings(packet: Packet): Packet {
    const { params } = packet.data;

    // params.no_pvm: プレイヤーがモンスターを攻撃する
    // params.no_mvp: モンスターがプレイヤーを攻撃する
    // params.immutable_world: 世界が変更不可
    // params.show_name_tags: 名前タグの表示
    // params.auto_jump: 自動ジャンプ

    return params;
}