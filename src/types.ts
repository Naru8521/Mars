export interface ServerYaml {
    proxy: Proxy,
    server: Server
}

export interface Proxy {
    host: string,
    port: number
}

export interface Server {
    name: string,
    path: string,
    version: string,
    auto_merge: boolean,
    packs_auto_update: boolean,
    backup: Backup
}

export interface Backup {
    server_stop_auto: boolean,
    server_auto_restart: boolean,
    max_data: number,
    auto_delete: boolean
}

export interface LogOption {
    type?: "INFO" | "WARN" | "ERROR" | string
    timeColor?: string
    logColor?: string
    txtColor?: string
}

export interface sessionObject {
    clientAddress: string,
    clientPort: number,
    serverSocket: import("dgram").Socket
}

export interface Command {
    name: string,
    console: boolean   
}

export interface Packet {
    data: PacketData,
    metadata: PacketMetaData
    buffer: Buffer,
    fullBuffer: Buffer
}

export interface PacketData {
    name: string,
    params: any
}

export interface PacketMetaData {
    size: number
}