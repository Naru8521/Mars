import type { Packet } from "../../types";

export default function add_entity(packet: Packet): Packet {
    const { params } = packet.data;

    // params.unuque_id: エンティティID
    // params.runtime_id: エンティティランタイムID
    // params.entity_type: エンティティTypeId
    // params.position: エンティティが生成されるワールド内の座標
    // params.velocity: エンティティの速度ベクトル
    // params.pitch: エンティティの縦方向の回転角度
    // params.yaw: エンティティの水平回転角度
    // params.head_yaw | body_yaw: エンティティの頭や体がどの方向を向いているか
    // params.attributes: エンティティが持つ属性
    // params.metadata: エンティティに関連する追加のメタデータ
    // params.properties: エンティティに関連する特定のプロパティ
    // params.links: 他のエンティティとのリンク

    return params;
}