import type { Packet } from "../../types";

export default function mob_equipment(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: ランタイムエンティティID
    // params.item: モブが装備するアイテムの情報
    // params.slot: モブのインベントリ内のスロット番号
    // params.selected_slot: 現在選択されているスロット
    // params.window_id: アイテムがどのインベントリウィンドウに関連しているか

    return params;
}