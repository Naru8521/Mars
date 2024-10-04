import type { Packet } from "../../types";

export default function move_player(packet: Packet): Packet {
    const { params } = packet.data;

    // params.runtime_id: ランタイムID
    // params.position: プレイヤーのポジション
    // params.pitch: プレイヤーの縦方向の視線角度
    // params.yaw: プレイヤーの水平回転角度
    // params.head_yaw: プレイヤーの頭の向き
    // params.mode: 移動モード
    // params.on_ground: 地面に接しているかどうか
    // params.ridden_runtime_id: 他のエンティティに乗っているか
    // params.teleport: テレポートされているか
    // params.tick: この移動が起きたゲーム内ティック

    return params;
}