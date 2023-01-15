import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { initSnail, renderTiles } from './snail.app';
import { snail } from './new.snail';

@Component({
  selector: 'app-snail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snail.component.html',
  styleUrls: ['./snail.component.scss'],
})
export class SnailComponent implements AfterViewInit {
  @Input()
  matrixSize = 10;

  @ViewChildren('tile')
  tilesRef: QueryList<ElementRef<HTMLDivElement>> | undefined;

  // tiles: number[];

  constructor() {
    snail(10);
    // this.tiles = initSnail(this.matrixSize);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // renderTiles(this.tilesRef!, this.matrixSize);
  }
}
