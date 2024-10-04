import type { Packet } from "../../types";

export default function add_item(packet: Packet): Packet {
    const { params } = packet.data;

    // params.entity_id_self: アイテムエンティティに割り当てられたID
    // params.runtime_entity_id: ランタイムエンティティID
    // params.item: アイテム情報
    // params.position: アイテムのポジション
    // params.velocity: アイテムの速度ベクトル
    // params.metadata: アイテムエンティティに関する情報
    // params.is_from_fishing: 釣りによるものか

    return params;
}