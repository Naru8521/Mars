import type { Packet } from "../../types";

export default function update_player_game_type(packet: Packet): Packet {
    const { params } = packet.data;

    // params.gamemode: ゲームモード
    // params.player_unique_id: プレイヤーのUUID
    // params.tick: レイヤーのゲームモードが変更されたゲーム内のティック数

    return params;
}