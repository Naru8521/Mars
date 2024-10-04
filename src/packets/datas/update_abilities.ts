import type { Packet } from "../../types";

export default function update_abilities(packet: Packet): Packet {
    const { params } = packet.data;

    // params.entity_unique_id: エンティティのID
    // params.permission_level: 権限
    // params.command_permission: コマンド権限
    // params.abilities: アビリティ

    return params;
}