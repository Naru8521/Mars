import type { Packet } from "../../types";

export default function level_chunk(packet: Packet): Packet {
    const { params } = packet.data;

    // params.x | z: チャンク
    // params.dimension: チャンクのディメンション
    // params.sub_chunk_count: そのチャンク内でサブチャンクの数
    // params.highest_subchunk_count: チャンク内での最大のサブチャンク数
    // params.cache_enabled: チャンクデータがキャッシュされているか
    // params.blobs: 追加のデータ
    // params.payload: チャンクに関連するデータのバイナリ表現

    return params;
}