type QrBlock = readonly [count: number, totalCodewords: number, dataCodewords: number];

const LOW_BLOCKS: readonly (readonly QrBlock[])[] = [
  [],
  [[1, 26, 19]], [[1, 44, 34]], [[1, 70, 55]], [[1, 100, 80]], [[1, 134, 108]],
  [[2, 86, 68]], [[2, 98, 78]], [[2, 121, 97]], [[2, 146, 116]],
  [[2, 86, 68], [2, 87, 69]], [[4, 101, 81]], [[2, 116, 92], [2, 117, 93]],
  [[4, 133, 107]], [[3, 145, 115], [1, 146, 116]], [[5, 109, 87], [1, 110, 88]],
  [[5, 122, 98], [1, 123, 99]], [[1, 135, 107], [5, 136, 108]],
  [[5, 150, 120], [1, 151, 121]], [[3, 141, 113], [4, 142, 114]],
  [[3, 135, 107], [5, 136, 108]],
];

const ALIGNMENT_POSITIONS: readonly (readonly number[])[] = [
  [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38],
  [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58],
  [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74],
  [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
];

function appendBits(target: number[], value: number, length: number) {
  for (let bit = length - 1; bit >= 0; bit -= 1) target.push((value >>> bit) & 1);
}

function multiply(a: number, b: number) {
  let result = 0;
  for (let i = 0; i < 8; i += 1) {
    if (b & 1) result ^= a;
    const high = a & 0x80;
    a = (a << 1) & 0xff;
    if (high) a ^= 0x1d;
    b >>>= 1;
  }
  return result;
}

function reedSolomonDivisor(degree: number) {
  const result = Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = multiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = multiply(root, 2);
  }
  return result;
}

function reedSolomonRemainder(data: readonly number[], degree: number) {
  const divisor = reedSolomonDivisor(degree);
  const result = Array<number>(degree).fill(0);
  for (const value of data) {
    const factor = value ^ result[0];
    result.shift();
    result.push(0);
    for (let i = 0; i < result.length; i += 1) result[i] ^= multiply(divisor[i], factor);
  }
  return result;
}

function chooseVersion(byteLength: number) {
  for (let version = 1; version < LOW_BLOCKS.length; version += 1) {
    const dataCodewords = LOW_BLOCKS[version].reduce((sum, [count, , data]) => sum + count * data, 0);
    const countBits = version < 10 ? 8 : 16;
    if (4 + countBits + byteLength * 8 <= dataCodewords * 8) return version;
  }
  throw new Error("QR odkaz je príliš dlhý.");
}

function createCodewords(text: string, version: number) {
  const bytes = [...new TextEncoder().encode(text)];
  const blocks = LOW_BLOCKS[version];
  const dataCapacity = blocks.reduce((sum, [count, , data]) => sum + count * data, 0);
  const bits: number[] = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, version < 10 ? 8 : 16);
  for (const byte of bytes) appendBits(bits, byte, 8);
  appendBits(bits, 0, Math.min(4, dataCapacity * 8 - bits.length));
  while (bits.length % 8) bits.push(0);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) value = (value << 1) | bits[i + j];
    data.push(value);
  }
  for (let pad = 0; data.length < dataCapacity; pad += 1) data.push(pad % 2 === 0 ? 0xec : 0x11);

  const dataBlocks: number[][] = [];
  const errorBlocks: number[][] = [];
  let offset = 0;
  for (const [count, total, dataCount] of blocks) {
    for (let i = 0; i < count; i += 1) {
      const block = data.slice(offset, offset + dataCount);
      offset += dataCount;
      dataBlocks.push(block);
      errorBlocks.push(reedSolomonRemainder(block, total - dataCount));
    }
  }
  const result: number[] = [];
  const maxData = Math.max(...dataBlocks.map((block) => block.length));
  const maxError = Math.max(...errorBlocks.map((block) => block.length));
  for (let i = 0; i < maxData; i += 1) for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  for (let i = 0; i < maxError; i += 1) for (const block of errorBlocks) if (i < block.length) result.push(block[i]);
  return result;
}

function bchRemainder(value: number, polynomial: number) {
  let result = value;
  const polynomialDegree = 31 - Math.clz32(polynomial);
  while (result !== 0 && 31 - Math.clz32(result) >= polynomialDegree) {
    result ^= polynomial << (31 - Math.clz32(result) - polynomialDegree);
  }
  return result;
}

function createMatrix(text: string) {
  const byteLength = new TextEncoder().encode(text).length;
  const version = chooseVersion(byteLength);
  const size = version * 4 + 17;
  const modules = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const functions = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const setFunction = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = dark;
    functions[y][x] = true;
  };

  const drawFinder = (centerX: number, centerY: number) => {
    for (let dy = -4; dy <= 4; dy += 1) for (let dx = -4; dx <= 4; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      setFunction(centerX + dx, centerY + dy, distance !== 2 && distance !== 4);
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }
  for (const y of ALIGNMENT_POSITIONS[version]) for (const x of ALIGNMENT_POSITIONS[version]) {
    if (functions[y][x]) continue;
    for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
      setFunction(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }

  const format = ((0b01 << 3) | 0) << 10;
  const formatBits = (format | bchRemainder(format, 0x537)) ^ 0x5412;
  const formatBit = (index: number) => ((formatBits >>> index) & 1) !== 0;
  for (let i = 0; i <= 5; i += 1) setFunction(8, i, formatBit(i));
  setFunction(8, 7, formatBit(6));
  setFunction(8, 8, formatBit(7));
  setFunction(7, 8, formatBit(8));
  for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, formatBit(i));
  for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, formatBit(i));
  for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, formatBit(i));
  setFunction(8, size - 8, true);

  if (version >= 7) {
    const rawVersion = version << 12;
    const versionBits = rawVersion | bchRemainder(rawVersion, 0x1f25);
    for (let i = 0; i < 18; i += 1) {
      const dark = ((versionBits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(a, b, dark);
      setFunction(b, a, dark);
    }
  }

  const codewords = createCodewords(text, version);
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < size; vertical += 1) {
      const upward = ((right + 1) & 2) === 0;
      const y = upward ? size - 1 - vertical : vertical;
      for (let offsetX = 0; offsetX < 2; offsetX += 1) {
        const x = right - offsetX;
        if (functions[y][x]) continue;
        const bit = bitIndex < codewords.length * 8
          ? ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0
          : false;
        modules[y][x] = bit !== ((x + y) % 2 === 0);
        bitIndex += 1;
      }
    }
  }
  return modules;
}

export function qrCodeToSvg(text: string, moduleSize = 4) {
  if (!text) throw new Error("QR kód potrebuje neprázdny odkaz.");
  const modules = createMatrix(text);
  const quietZone = 4;
  const dimension = modules.length + quietZone * 2;
  const path: string[] = [];
  for (let y = 0; y < modules.length; y += 1) for (let x = 0; x < modules.length; x += 1) {
    if (modules[y][x]) path.push(`M${x + quietZone},${y + quietZone}h1v1h-1z`);
  }
  const pixels = dimension * Math.max(1, Math.round(moduleSize));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" width="${pixels}" height="${pixels}" role="img" aria-label="QR kód"><rect width="100%" height="100%" fill="#fff"/><path d="${path.join("")}" fill="#000"/></svg>`;
}
