/* eslint-disable */
import * as nbts from 'prismarine-nbt';
import UUID from 'uuid-1345';
import { Buffer } from 'buffer'; // Node.js標準のBufferをインポート

const protoLE = nbts.protos.little;
const protoLEV = nbts.protos.littleVarint;
// TODO: deal with this:
import * as zigzag from 'prismarine-nbt/zigzag';

export function readUUID(buffer: Buffer, offset: number) {
    if (offset + 16 > buffer.length) {
        throw new Error('PartialReadError');
    }
    return {
        value: UUID.stringify(buffer.slice(offset, 16 + offset)),
        size: 16
    };
}

export function writeUUID(value: string, buffer: Buffer, offset: number) {
    const buf = UUID.parse(value);
    buf.copy(buffer, offset);
    return offset + 16;
}

// Little Endian + varints

export function readNbt(buffer: Buffer, offset: number) {
    return protoLEV.read(buffer, offset, 'nbt');
}

export function writeNbt(value: any, buffer: Buffer, offset: number) {
    return protoLEV.write(value, buffer, offset, 'nbt');
}

export function sizeOfNbt(value: any) {
    return protoLEV.sizeOf(value, 'nbt');
}

// Little Endian

export function readNbtLE(buffer: Buffer, offset: number) {
    const r = protoLE.read(buffer, offset, 'nbt');
    // End size is 3 for some reason
    if (r.value.type === 'end') return { value: r.value, size: 1 };
    return r;
}

export function writeNbtLE(value: any, buffer: Buffer, offset: number) {
    if (value.type === 'end') {
        buffer.writeInt8(0, offset);
        return offset + 1;
    }
    return protoLE.write(value, buffer, offset, 'nbt');
}

export function sizeOfNbtLE(value: any) {
    if (value.type === 'end') return 1;
    return protoLE.sizeOf(value, 'nbt');
}

export function readEntityMetadata(buffer: Buffer, offset: number, _ref: { type: string, endVal: number }) {
    const type = _ref.type;
    const endVal = _ref.endVal;

    let cursor = offset;
    const metadata: any[] = [];
    let item;
    while (true) {
        if (offset + 1 > buffer.length) throw new Error('PartialReadError');
        item = buffer.readUInt8(cursor);
        if (item === endVal) {
            return {
                value: metadata,
                size: cursor + 1 - offset
            };
        }
        const results = readNbt(buffer, cursor);
        metadata.push(results.value);
        cursor += results.size;
    }
}

export function writeEntityMetadata(value: any[], buffer: Buffer, offset: number, _ref: { type: string, endVal: number }) {
    const type = _ref.type;
    const endVal = _ref.endVal;

    value.forEach(function (item) {
        offset = writeNbt(item, buffer, offset);
    });
    buffer.writeUInt8(endVal, offset);
    return offset + 1;
}

export function sizeOfEntityMetadata(value: any[], _ref: { type: string }) {
    const type = _ref.type;

    let size = 1;
    for (let i = 0; i < value.length; ++i) {
        size += sizeOfNbt(value[i]);
    }
    return size;
}

export function readIpAddress(buffer: Buffer, offset: number) {
    const address = buffer[offset] + '.' + buffer[offset + 1] + '.' + buffer[offset + 2] + '.' + buffer[offset + 3];
    return {
        size: 4,
        value: address
    };
}

export function writeIpAddress(value: string, buffer: Buffer, offset: number) {
    const address = value.split('.');

    address.forEach(function (b) {
        buffer[offset] = parseInt(b);
        offset++;
    });

    return offset;
}

export function readEndOfArray(buffer: Buffer, offset: number, typeArgs: { type: string }) {
    const type = typeArgs.type;
    let cursor = offset;
    const elements: any[] = [];
    while (cursor < buffer.length) {
        const results = readNbt(buffer, cursor);
        elements.push(results.value);
        cursor += results.size;
    }
    return {
        value: elements,
        size: cursor - offset
    };
}

export function writeEndOfArray(value: any[], buffer: Buffer, offset: number, typeArgs: { type: string }) {
    const type = typeArgs.type;
    value.forEach(function (item) {
        offset = writeNbt(item, buffer, offset);
    });
    return offset;
}

export function sizeOfEndOfArray(value: any[], typeArgs: { type: string }) {
    const type = typeArgs.type;
    let size = 0;
    for (let i = 0; i < value.length; ++i) {
        size += sizeOfNbt(value[i]);
    }
    return size;
}

export const zigzag32 = zigzag.interpret.zigzag32;
export const zigzag64 = zigzag.interpret.zigzag64;

export const uuid = [readUUID, writeUUID, 16];
export const nbt = [readNbt, writeNbt, sizeOfNbt];
export const lnbt = [readNbtLE, writeNbtLE, sizeOfNbtLE];
export const entityMetadataLoop = [readEntityMetadata, writeEntityMetadata, sizeOfEntityMetadata];
export const ipAddress = [readIpAddress, writeIpAddress, 4];
export const endOfArray = [readEndOfArray, writeEndOfArray, sizeOfEndOfArray];
