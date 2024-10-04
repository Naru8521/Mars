import type { Packet } from "../../types";

export default function network_chunk_publisher_update(packet: Packet): Packet {
    const { params } = packet.data;

    // params.coordinates: チャンクの更新が行われる中心位置
    // params.radius: プレイヤーを中心にどの範囲のチャンクがクライアントに送信されるか
    // params.saved_chunks: クライアント側で既に保存されている（またはキャッシュされている）チャンクのリスト

    return params;
}