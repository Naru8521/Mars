import type { Packet } from "../../types";

export default function set_spawn_position(packet: Packet): Packet {
    const { params } = packet.data;

    // params.spawn_type: スポーンタイプ => WORLD_SPAWNの場合は、この位置を常にコンパスが指す
    // params.player_position: 設定された新しい位置
    // params.dimension: ディメンション
    // params.world_position: ベクター3

    return params;
}