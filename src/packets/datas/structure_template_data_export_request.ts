import type { Packet } from "../../types";

export default function structure_template_data_export_request(packet: Packet): Packet {
    const { params } = packet.data;

    // params.name: 名前
    // params.position: 始点
    // params.settings: 設定
    // params.request_type: リクエストタイプ

    return params;
}