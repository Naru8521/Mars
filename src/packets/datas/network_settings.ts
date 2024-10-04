import type { Packet } from "../../types";

export default function network_settings(packet: Packet): Packet {
    const { params } = packet.data;

    // params.compression_threshold: 圧縮が適用されるデータのサイズのしきい値
    // params.compression_algorithm: データを圧縮する際に使用されるアルゴリズム
    // params.client_throttle: クライアント側での通信制限を有効にするか
    // params.client_throttle_threshold: クライアントスロットリングを適用する際のしきい値
    // params.client_throttle_scalar: スロットリングが適用された場合に、クライアントの通信速度を制限するためのスケール

    return params;
}