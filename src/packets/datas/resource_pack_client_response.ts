import type { Packet } from "../../types";

export default function resource_pack_client_response(packet: Packet): Packet {
    const { params } = packet.data;

    // params.response_status: 返ってくるステータス
    // params.resourcepackids: リソースパックのIDリスト

    return params;
}