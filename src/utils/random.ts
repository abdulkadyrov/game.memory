export function createSeed() {
  const timeSeed = Date.now() % 2147483647;
  const randomSeed = Math.floor(Math.random() * 2147483647);

  return (timeSeed ^ randomSeed) >>> 0;
}

export function mulberry32(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

