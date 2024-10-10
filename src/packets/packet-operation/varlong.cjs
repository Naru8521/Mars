function sizeOfVarLong(value) {
    if (typeof value.valueOf() === 'object') {
        value = (BigInt(value[0]) << 32n) | BigInt(value[1]);
    } else if (typeof value !== 'bigint') {
        value = BigInt(value);
    }

    let cursor = 0;

    while (value > 127n) {
        value >>= 7n;
        cursor++;
    }

    return cursor + 1;
}

function readVarLong(buffer, offset) {
    let result = BigInt(0);
    let shift = 0n;
    let cursor = offset;
    let size = 0;

    while (true) {
        if (cursor + 1 > buffer.length) {
            throw new Error('unexpected buffer end');
        }

        const b = buffer.readUInt8(cursor);
        result |= (BigInt(b) & 0x7fn) << shift;
        cursor++;

        if (!(b & 0x80)) {
            size = cursor - offset;
            break;
        }

        shift += 7n;
        if (shift > 63n) throw new Error(`varint is too big: ${shift}`);
    }

    return { value: result, size };
}

function writeVarLong(value, buffer, offset) {
    if (typeof value.valueOf() === 'object') {
        value = BigInt.asIntN(64, (BigInt(value[0]) << 32n)) | BigInt(value[1]);
    } else if (typeof value !== 'bigint') {
        value = BigInt(value);
    }

    let cursor = 0;

    while (value > 127n) {
        const num = Number(value & 0xFFn);

        buffer.writeUInt8(num | 0x80, offset + cursor);
        cursor++;
        value >>= 7n;
    }

    buffer.writeUInt8(Number(value), offset + cursor);

    return offset + cursor + 1;
}

module.exports = {
    Read: { varint64: ['native', readVarLong] },
    Write: { varint64: ['native', writeVarLong] },
    SizeOf: { varint64: ['native', sizeOfVarLong] }
};
