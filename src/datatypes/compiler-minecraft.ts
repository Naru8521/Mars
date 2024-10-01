/* eslint-disable */
import * as minecraft from './minecraft';
import UUID from 'uuid-1345';
import { Read, Write, SizeOf } from './varlong';

/**
 * UUIDs
 */
Read.uuid = ['native', (buffer: Buffer, offset: number) => {
    return {
        value: UUID.stringify(buffer.slice(offset, 16 + offset)),
        size: 16
    };
}];

Write.uuid = ['native', (value: string, buffer: Buffer, offset: number) => {
    const buf = UUID.parse(value);
    buf.copy(buffer, offset);
    return offset + 16;
}];

SizeOf.uuid = ['native', 16];

// entityMetadataLoopの定義を追加
Read.entityMetadataLoop = ['context', (buffer: Buffer, offset: number) => {
    const values = [];
    while (buffer[offset] != 0) {
        const n = ctx.entityMetadata(buffer, offset); // ここで `entityMetadata` 関数を呼び出す
        values.push(n.value);
        offset += n.size;
    }
    return { value: values, size: buffer.length - offset };
}];

Write.entityMetadataLoop = ['context', (value: any[], buffer: Buffer, offset: number) => {
    for (const val of value) {
        offset = ctx.entityMetadata(val, buffer, offset); // ここで `entityMetadata` を書き込む
    }
    buffer.writeUint8(0, offset);
    return offset + 1;
}];

SizeOf.entityMetadataLoop = ['context', (value: any[], buffer: Buffer, offset: number) => {
    let size = 1;
    for (const val of value) {
        size += ctx.entityMetadata(val, buffer, offset); // ここで `entityMetadata` のサイズを計算
    }
    return size;
}];


/**
 * Rest of buffer
 */
Read.restBuffer = ['native', (buffer: Buffer, offset: number) => {
    return {
        value: buffer.slice(offset),
        size: buffer.length - offset
    };
}];

Write.restBuffer = ['native', (value: Buffer, buffer: Buffer, offset: number) => {
    value.copy(buffer, offset);
    return offset + value.length;
}];

SizeOf.restBuffer = ['native', (value: Buffer) => {
    return value.length;
}];

/**
 * Encapsulated data with length prefix
 */
Read.encapsulated = ['parametrizable', (compiler: any, { lengthType, type }: any) => {
    return compiler.wrapCode(`
  const payloadSize = ${compiler.callType(lengthType, 'offset')}
  const { value, size } = ctx.${type}(buffer, offset + payloadSize.size)
  return { value, size: size + payloadSize.size }
`.trim());
}];

Write.encapsulated = ['parametrizable', (compiler: any, { lengthType, type }: any) => {
    return compiler.wrapCode(`
  const buf = Buffer.allocUnsafe(buffer.length - offset)
  const payloadSize = (ctx.${type})(value, buf, 0)
  let size = (ctx.${lengthType})(payloadSize, buffer, offset)
  size += buf.copy(buffer, size, 0, payloadSize)
  return size
`.trim());
}];

SizeOf.encapsulated = ['parametrizable', (compiler: any, { lengthType, type }: any) => {
    return compiler.wrapCode(`
    const payloadSize = (ctx.${type})(value)
    return (ctx.${lengthType})(payloadSize) + payloadSize
`.trim());
}];

/**
 * Read NBT until end of buffer or \0
 */
Read.nbtLoop = ['context', (buffer: Buffer, offset: number) => {
    const values = [];
    while (buffer[offset] != 0) {
        const n = ctx.nbt(buffer, offset);
        values.push(n.value);
        offset += n.size;
    }
    return { value: values, size: buffer.length - offset };
}];

Write.nbtLoop = ['context', (value: any[], buffer: Buffer, offset: number) => {
    for (const val of value) {
        offset = ctx.nbt(val, buffer, offset);
    }
    buffer.writeUint8(0, offset);
    return offset + 1;
}];

SizeOf.nbtLoop = ['context', (value: any[], buffer: Buffer, offset: number) => {
    let size = 1;
    for (const val of value) {
        size += ctx.nbt(val, buffer, offset);
    }
    return size;
}];

/**
 * Read rotation float encoded as a byte
 */
Read.byterot = ['context', (buffer: Buffer, offset: number) => {
    const val = buffer.readUint8(offset);
    return { value: val * (360 / 256), size: 1 };
}];

Write.byterot = ['context', (value: number, buffer: Buffer, offset: number) => {
    const val = value / (360 / 256);
    buffer.writeUint8(val, offset);
    return offset + 1;
}];

SizeOf.byterot = ['context', () => 1];

/**
 * NBT
 */
Read.nbt = ['native', minecraft.nbt[0]];
Write.nbt = ['native', minecraft.nbt[1]];
SizeOf.nbt = ['native', minecraft.nbt[2]];

Read.lnbt = ['native', minecraft.lnbt[0]];
Write.lnbt = ['native', minecraft.lnbt[1]];
SizeOf.lnbt = ['native', minecraft.lnbt[2]];

/**
 * Bits
 */
Read.bitflags = ['parametrizable', (compiler: any, { type, flags, shift, big }: any) => {
    let fstr = JSON.stringify(flags);
    if (Array.isArray(flags)) {
        fstr = '{';
        flags.map((v: any, k: any) => fstr += `"${v}": ${big ? 1n << BigInt(k) : 1 << k}` + (big ? 'n,' : ','));
        fstr += '}';
    } else if (shift) {
        fstr = '{';
        for (const key in flags) fstr += `"${key}": ${1 << flags[key]},`;
        fstr += '}';
    }
    return compiler.wrapCode(`
    const { value: _value, size } = ${compiler.callType(type, 'offset')}
    const value = { _value }
    const flags = ${fstr}
    for (const key in flags) {
      value[key] = (_value & flags[key]) == flags[key]
    }
    return { value, size }
  `.trim());
}];

Write.bitflags = ['parametrizable', (compiler: any, { type, flags, shift, big }: any) => {
    let fstr = JSON.stringify(flags);
    if (Array.isArray(flags)) {
        fstr = '{';
        flags.map((v: any, k: any) => fstr += `"${v}": ${big ? 1n << BigInt(k) : 1 << k}` + (big ? 'n,' : ','));
        fstr += '}';
    } else if (shift) {
        fstr = '{';
        for (const key in flags) fstr += `"${key}": ${1 << flags[key]},`;
        fstr += '}';
    }
    return compiler.wrapCode(`
    const flags = ${fstr}
    let val = value._value ${big ? '|| 0n' : ''}
    for (const key in flags) {
      if (value[key]) val |= flags[key]
    }
    return (ctx.${type})(val, buffer, offset)
  `.trim());
}];

SizeOf.bitflags = ['parametrizable', (compiler: any, { type, flags, shift, big }: any) => {
    let fstr = JSON.stringify(flags);
    if (Array.isArray(flags)) {
        fstr = '{';
        flags.map((v: any, k: any) => fstr += `"${v}": ${big ? 1n << BigInt(k) : 1 << k}` + (big ? 'n,' : ','));
        fstr += '}';
    } else if (shift) {
        fstr = '{';
        for (const key in flags) fstr += `"${key}": ${1 << flags[key]},`;
        fstr += '}';
    }
    return compiler.wrapCode(`
    const flags = ${fstr}
    let val = value._value ${big ? '|| 0n' : ''}
    for (const key in flags) {
      if (value[key]) val |= flags[key]
    }
    return (ctx.${type})(val)
  `.trim());
}];

/**
 * Command Packet
 * - used for determining the size of the following enum
 */
Read.enum_size_based_on_values_len = ['parametrizable', (compiler: any) => {
    return compiler.wrapCode(js(() => {
        if (values_len <= 0xff) return { value: 'byte', size: 0 };
        if (values_len <= 0xffff) return { value: 'short', size: 0 };
        if (values_len <= 0xffffff) return { value: 'int', size: 0 };
    }));
}];

Write.enum_size_based_on_values_len = ['parametrizable', (compiler: any) => {
    return str(() => {
        if (value.values_len <= 0xff) _enum_type = 'byte';
        else if (value.values_len <= 0xffff) _enum_type = 'short';
        else if (value.values_len <= 0xffffff) _enum_type = 'int';
        return offset;
    });
}];

SizeOf.enum_size_based_on_values_len = ['parametrizable', (compiler: any) => {
    return str(() => {
        if (value.values_len <= 0xff) _enum_type = 'byte';
        else if (value.values_len <= 0xffff) _enum_type = 'short';
        else if (value.values_len <= 0xffffff) _enum_type = 'int';
        return 0;
    });
}];

function js(fn: () => void) {
    return fn.toString().split('\n').slice(1, -1).join('\n').trim();
}

function str(fn: () => void) {
    return fn.toString() + ')();(()=>{}';
}

export { Read, Write, SizeOf };
