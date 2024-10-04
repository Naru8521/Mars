import type { Packet } from "../../types";

export default function client_cache_miss_response(packet: Packet): Packet {
    const { params } = packet.data;

    // params.blobs: クライアントのキャッシュミス応答

    return params;
}