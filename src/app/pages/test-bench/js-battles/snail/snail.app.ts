interface CalcData {
  i: number;
  n: number;
  loop: number;
  sumOfLastBreakpoints: number;
  direction: number;
  sidelength: number;
  relativePos: number;
}

export function snail(n = 10): number[] {
  const sidelengths: number[] = getSidelengths(n);
  const breakpoints: number[] = getBreakpoints(sidelengths);
  const snailArray = Array.from({ length: n * n }, (_, i) => i).map((i) => {
    const loop = getCurrentLoop(i, breakpoints);
    const sidelength = sidelengths[loop];
    const sumOfLastBreakpoints = getSumOfLastBreakpoints(loop, sidelengths);
    const direction = Math.floor((i - sumOfLastBreakpoints) / sidelength);
    const relativePos =
      (i - sumOfLastBreakpoints - direction * sidelength) % sidelength;
    console.log({
      i,
      loop,
      sidelength,
      sumOfLastBreakpoints,
      direction,
      relativePos,
    });
    const pos = calculate({
      i,
      n,
      loop,
      sumOfLastBreakpoints,
      direction,
      sidelength,
      relativePos,
    });

    // Variant 2, later
    const numbersArrays = Array.from({ length: n }, (_, i) => i).map((_, i) => {
      return Array.from({ length: n }, (_, j) => i * n + j + 1);
    });

    return pos;
  });

  return snailArray;
}

function calculate({
  i,
  n,
  loop,
  sumOfLastBreakpoints,
  direction,
  sidelength,
  relativePos,
}: CalcData): number {
  const calculations = [
    () =>
      loop * n + loop + (i - sumOfLastBreakpoints - direction * sidelength) + 1,
    () => loop * n + sidelength + 1 + loop + relativePos * n,
    () => n * n - loop * n - relativePos - loop,
    () => n * (n - loop) - (n - loop - 1) - relativePos * n,
  ];

  return calculations[direction]();
}

function getSumOfLastBreakpoints(n: number, sidelenghts: number[]): number {
  return Array.from({ length: n }, (_, i) => sidelenghts[i] * 4).reduce(
    (acc, i) => acc + i,
    0
  );
}

function getSidelengths(n: number): number[] {
  return Array.from({ length: Math.round(n / 2) }, (_, lap) => n - 1 - lap * 2);
}

function getBreakpoints(sidelengths: number[]): number[] {
  return sidelengths.reduce((acc, sidelength, index) => {
    const prev = acc[index - 1] || 0;
    const current: number = sidelength * 4 + prev;
    return [...acc, current];
  }, [] as number[]);
}

function getCurrentLoop(i: number, breakpoints: number[]) {
  return breakpoints.reduce((acc, breakpoint, index) => {
    return i >= breakpoint ? index + 1 : acc;
  }, 0);
}
