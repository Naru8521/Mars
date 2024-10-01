function sizeOfVarLong(value: any): number {
    if (typeof value.valueOf() === 'object') {
        value = (BigInt(value[0]) << 32n) | BigInt(value[1]);
    } else if (typeof value !== 'bigint') value = BigInt(value);

    let cursor = 0;
    while (value > 127n) {
        value >>= 7n;
        cursor++;
    }
    return cursor + 1;
}

/**
 * Reads a 64-bit VarInt as a BigInt
 */
function readVarLong(buffer: Buffer, offset: number): { value: bigint, size: number } {
    let result = BigInt(0);
    let shift = 0n;
    let cursor = offset;
    let size = 0;

    while (true) {
        if (cursor + 1 > buffer.length) {
            throw new Error('unexpected buffer end');
        }
        const b = buffer.readUInt8(cursor);
        result |= (BigInt(b) & 0x7fn) << shift; // Add the bits to our number, except MSB
        cursor++;
        if (!(b & 0x80)) { // If the MSB is not set, we return the number
            size = cursor - offset;
            break;
        }
        shift += 7n; // we only have 7 bits, MSB being the return-trigger
        if (shift > 63n) throw new Error(`varint is too big: ${shift}`);
    }

    return { value: result, size };
}

/**
 * Writes a zigzag encoded 64-bit VarInt as a BigInt
 */
function writeVarLong(value: any, buffer: Buffer, offset: number): number {
    // if an array, turn it into a BigInt
    if (typeof value.valueOf() === 'object') {
        value = BigInt.asIntN(64, (BigInt(value[0]) << 32n)) | BigInt(value[1]);
    } else if (typeof value !== 'bigint') value = BigInt(value);

    let cursor = 0;
    while (value > 127n) { // keep writing in 7 bit slices
        const num = Number(value & 0xFFn);
        buffer.writeUInt8(num | 0x80, offset + cursor);
        cursor++;
        value >>= 7n;
    }
    buffer.writeUInt8(Number(value), offset + cursor);
    return offset + cursor + 1;
}

export const Read = {
    varint64: ['native', readVarLong]
};

export const Write = {
    varint64: ['native', writeVarLong]
};

export const SizeOf = {
    varint64: ['native', sizeOfVarLong]
};
