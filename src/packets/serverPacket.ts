import type { Packet } from "../types";
import { createDeserializer, createSerializer } from "./packet-operation/serializer.cjs";
import { Framer } from "./packet-operation/framer.cjs";

import add_entity from "./datas/add_entity";
import add_item from "./datas/add_item_entity";
import add_player from "./datas/add_player";
import animate from "./datas/animate";
import move_player from "./datas/move_player";
import available_commands from "./datas/available_commands";
import available_entity_identifiers from "./datas/available_entity_identifiers";
import biome_definition_list from "./datas/biome_definition_list";
import block_entity_data from "./datas/block_entity_data";
import camera_presets from "./datas/camera_presets";
import chunk_radius_update from "./datas/chunk_radius_update";
import crafting_data from "./datas/crafting_data";
import creative_content from "./datas/creative_content";
import current_structure_feature from "./datas/current_structure_feature";
import emote_list from "./datas/emote_list";
import entity_event from "./datas/entity_event";
import game_rules_changed from "./datas/game_rules_changed";
import inventory_content from "./datas/inventory_content";
import item_component from "./datas/item_component";
import level_chunk from "./datas/level_chunk";
import level_event from "./datas/level_event";
import level_event_generic from "./datas/level_event_generic";
import level_sound_event from "./datas/level_sound_event";
import mob_effect from "./datas/mob_effect";
import mob_equipment from "./datas/mob_equipment";
import move_entity_delta from "./datas/move_entity_delta";
import network_chunk_publisher_update from "./datas/network_chunk_publisher_update";
import network_settings from "./datas/network_settings";
import play_status from "./datas/play_status";
import player_fog from "./datas/player_fog";
import player_hotbar from "./datas/player_hotbar";
import player_list from "./datas/player_list";
import remove_entity from "./datas/remove_entity";
import resource_packs_info from "./datas/resource_packs_info";
import respawn from "./datas/respawn";
import server_to_client_handshake from "./datas/server_to_client_handshake";
import set_commands_enabledun from "./datas/set_commands_enabled";
import set_difficulty from "./datas/set_difficulty";
import set_entity_data from "./datas/set_entity_data";
import set_entity_link from "./datas/set_entity_link";
import set_entity_motion from "./datas/set_entity_motion";
import set_health from "./datas/set_health";
import set_spawn_position from "./datas/set_spawn_position";
import set_time from "./datas/set_time";
import start_game from "./datas/start_game";
import sync_entity_property from "./datas/sync_entity_property";
import take_item_entity from "./datas/take_item_entity";
import text from "./datas/text";
import trim_data from "./datas/trim_data";
import unlocked_recipes from "./datas/unlocked_recipes";
import update_abilities from "./datas/update_abilities";
import update_adventure_settings from "./datas/update_adventure_settings";
import update_attributes from "./datas/update_attributes";
import update_block from "./datas/update_block";
import update_player_game_type from "./datas/update_player_game_type";
import update_subchunk_blocks from "./datas/update_subchunk_blocks";
import simple_event from "./datas/simple_event";
import resource_pack_client_response from "./datas/resource_pack_client_response";
import client_to_server_handshake from "./datas/client_to_server_handshake";
import settings_command from "./datas/settings_command";
import client_cache_miss_response from "./datas/client_cache_miss_response";
import structure_template_data_export_request from "./datas/structure_template_data_export_request";

const serializer: any = createSerializer("1.21.30");
const deserializer: any = createDeserializer("1.21.30");
const packetHandlers: Record<string, (deserialized: any) => Packet> = {
    add_entity,
    add_item,
    add_player,
    animate,
    available_commands,
    available_entity_identifiers,
    biome_definition_list,
    block_entity_data,
    camera_presets,
    chunk_radius_update,
    client_cache_miss_response,
    client_to_server_handshake,
    crafting_data,
    creative_content,
    current_structure_feature,
    emote_list,
    entity_event,
    game_rules_changed,
    inventory_content,
    item_component,
    level_chunk,
    level_event_generic,
    level_event,
    level_sound_event,
    mob_effect,
    mob_equipment,
    move_entity_delta,
    move_player,
    network_chunk_publisher_update,
    network_settings,
    play_status,
    player_fog,
    player_hotbar,
    player_list,
    remove_entity,
    resource_pack_client_response,
    resource_packs_info,
    respawn,
    server_to_client_handshake,
    set_commands_enabledun,
    set_difficulty,
    set_entity_data,
    set_entity_link,
    set_entity_motion,
    set_health,
    set_spawn_position,
    set_time,
    settings_command,
    simple_event,
    start_game,
    structure_template_data_export_request,
    sync_entity_property,
    take_item_entity,
    text,
    trim_data,
    unlocked_recipes,
    update_abilities,
    update_adventure_settings,
    update_attributes,
    update_block,
    update_player_game_type,
    update_subchunk_blocks
};

/**
 * サーバーからのパケットを解析
 * @param packet
 * @returns 
 */
export default function ServerPacket(packet: Buffer): Buffer {
    try {
        const des = deserializer.parsePacketBuffer(packet);
        const { name } = des.data;

        console.log(name);

        if (packetHandlers[name](des)) {
            return createPacket(packetHandlers[name](des));
        }

        if (isNaN(name)) {
            console.log(des);
        }
    } catch (error) { }

    return packet;
}

/**
 * パケットをシリアライズしてバッファに変換
 * @param packet 
 * @returns
 */
function createPacket(packet: Packet): Buffer {
    return serializer.createPacketBuffer({
        name: packet.data.name,
        params: packet.data.params
    });
}
