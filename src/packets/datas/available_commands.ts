import type { Packet } from "../../types";

export default function available_commands(packet: Packet): Packet {
    let { params } = packet.data;

    // params.values_len: 使用可能なコマンドや、サブコマンドの総数
    // params._enum_type: コマンドの列挙型
    // params.enum_values: 列挙型 [Array]
    // params.chained_subcommand_values: 連鎖するサブコマンド [Array]
    // params.suffixes: 特定のコマンドに続けて使用できる追加のパラメータや修飾子 [Array]
    // params.enums: コマンドやサブコマンドが取ることができる複数の選択肢や、選択肢に対応する値 [Array]
    // params.chained_subcommands: 特定のコマンドが連鎖的に別のコマンドと組み合わせて使用 [Array]
    // params.command_data: 各コマンドの使用方法や引数、オプション、その他の情報 [Array]
    // params.dynamic_enums: ゲームの状況によって変化する可能性があるコマンドや引数のリスト [Array]
    // params.enum_constraints: 特定のコマンドや引数が選択できる範囲や条件に関する情報 [Array]

    console.log(JSON.stringify(params.command_data[0]));

    params.command_data.push({
        name: "test",
        description: "TEST COMMAND",
        flags: 0,
        permission_level: 0,
        alias: -1,
        chained_subcommand_offsets: [],
        overloads: [
            {
                chaining: false, // コマンドがサブコマンドを持つかどうか
                parameters: [
                    {
                        parameter_name: "action", // パラメータの名前 (表示上の名前)
                        value_type: 198, // データ型
                        enum_type: "enum",
                        optional: false, // 必須かどうか (falseの時は必須)
                    },
                    {
                        parameter_name: "name", // パラメータの名前 (表示上の名前)
                        value_type: 56, // データ型 (string)
                        enum_type: "valid",
                        optional: false, // 必須かどうか (falseの時は必須)
                    }
                ]
            }
        ]
    });

    return params;
}