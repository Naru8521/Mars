import type { Packet } from "../../types";

export default function player_hotbar(packet: Packet): Packet {
    const { params } = packet.data;

    // params.selected_slot: プレイヤーがホットバーで現在選択しているスロット
    // params.window_id: ホットバーがどのインベントリウィンドウに属しているか
    // params.select_slot: ホットバーのスロットが現在選択されている状態であるか

    return params;
}