import { Server } from "raknet-native";

export function test() {
    const raknet = new Server("192.168.1.23", 25327, {
        maxConnections: 100,
        protocolVersion: 11
    });

    raknet.on('openConnection', (client) => {
        console.log(client);
    })

    raknet.on('closeConnection', (client) => {
        console.log(client);
    })

    raknet.on('encapsulated', ({ buffer, address }) => {
        console.log(buffer, address);
    })
}