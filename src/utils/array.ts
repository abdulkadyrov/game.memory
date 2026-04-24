export function shuffle<T>(input: T[], rng: () => number) {
  const copy = [...input];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

export function unique<T>(values: T[]) {
  return [...new Set(values)];
}

