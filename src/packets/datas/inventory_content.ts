import type { Packet } from "../../types";

export default function inventory_content(packet: Packet): Packet {
    const { params } = packet.data;

    // params.window_id: 表示ID
    // params.input: ンベントリ内に存在するアイテムやスロットの状態
    // params.container: コンテナー
    // params.dynamic_container_size: インベントリにおける動的コンテナのサイズ

    return params;
}