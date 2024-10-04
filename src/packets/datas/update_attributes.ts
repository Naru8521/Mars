import type { Packet } from "../../types";

export default function update_attributes(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_entity_id: エンティティID
    // params.attributes: エンティティの特性
    // params.tick: エンティティが生成されてからの時間

    return params;
}