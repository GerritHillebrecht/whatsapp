import { ElementRef, QueryList } from '@angular/core';

export function initSnail(size: number): number[] {
  return Array.from({ length: Math.pow(size, 2) }, (_, i) => i).map((val) =>
    tileNumber(size, val + 1)
  );
}

function tileNumber(size: number, i: number) {
  const { breakpoint, sideLength, lap } = lapBreakpoints(size).find(
    ({ breakpoint }) => i >= breakpoint
  );

  const lapOffset = lap * size + Math.floor((size - sideLength) / 2);
  const fixMeLater = breakpoint > 0 ? 0 : 1;
  const dir = Math.floor((i - breakpoint - fixMeLater) / sideLength) % 4;
  const lineOffset = directionScore(
    size,
    lap,
    dir,
    ((i - breakpoint - fixMeLater) % sideLength) + 1
  );
  const tilePosition = lapOffset + lineOffset;

  console.table({
    i,
    dir,
    tilePosition,
    lapOffset,
    lineOffset,
    breakpoint,
    sideLength,
    lap,
  });
  return tilePosition;
}

function directionScore(
  size: number,
  lap: number,
  dir: number,
  lineOffset: number
): number {
  return [
    () => lineOffset * 1,
    () => (size - lap) * lineOffset,
    () => Math.pow(size - lap, 2) - lineOffset * 1 + 1,
    () => size * (size - lap) - size * lineOffset + 1,
  ][dir]();
}

function lapBreakpoints(size: number): any[] {
  return Array.from({ length: Math.ceil(size / 2) }, (_, i) => i)
    .map((lap) => {
      const breakpoint = sumLapBreakpoints(size, lap);
      const sideLength = calculateBreakpoint(size, lap) / 4;
      return {
        breakpoint,
        sideLength,
        lap,
      };
    })
    .reverse();
}

function sumLapBreakpoints(size: number, lap: number): number {
  return Array.from({ length: lap }, (_, i) => i).reduce(
    (acc, lap) => acc + calculateBreakpoint(size, lap),
    0
  );
}

function calculateBreakpoint(size: number, lap: number): number {
  return (size - (lap * 2 + 1)) * 4;
}

export function renderTiles(
  tiles: QueryList<ElementRef<HTMLDivElement>>,
  matrixSize: number
) {
  tiles.toArray().forEach((tile, i) => {
    tile.nativeElement.style.setProperty('--transition-delay', `${i * 20}ms`);
    tile.nativeElement.style.setProperty(
      '--tile-color',
      `hsl(210, 100%, ${Math.round((i / Math.pow(matrixSize, 2)) * 100)}%)`
    );
    setTimeout(() => {
      tile.nativeElement.classList.add('active');
    }, 1);
  });
}
