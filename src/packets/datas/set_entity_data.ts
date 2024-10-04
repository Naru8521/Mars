import type { Packet } from "../../types";

export default function set_entity_data(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: エンティティID
    // params.metadata: エンティティに関連するメタデータ
    // params.properties: エンティティに関連するプロパティ
    // params.tick: エンティティが生成されたゲーム内時間

    return params;
}