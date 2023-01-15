export function snail(n = 10) {
  const path = createPath(n);
  console.log({ path });
}

function createSnailArray(n: number) {
  const array = Array.from({ length: n }, (_, i) => i);
  return array.map((_, i) => array.map((_, j) => i * n + j + 1));
}

function createPath(n: number) {
  const array: number[][] = createSnailArray(n);
  return Array.from({ length: n * n }, (_, i) => {
    return getCoordinates(i, n, array);
  });
}

function getCoordinates(i: number, n: number, array: number[][]) {
  const calculus = [
    (x: number, y: number) => array[y][x],
    (x: number, y: number) => array[x][y],
    (x: number, y: number) => array[y][x],
    (x: number, y: number) => array[x][y],
  ];
  const lap = Math.floor(Math.floor(i / n) / 4);
  const x: number = (i - (lap * 2)) % (n - 1);
  const y: number = Math.floor((i - lap) / n);

  console.log({ lap, i, x, y, calculus: calculus[lap] });

  return calculus[lap](x, y);
}
