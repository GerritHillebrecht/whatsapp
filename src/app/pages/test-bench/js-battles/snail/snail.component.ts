import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { snail } from './snail.app';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-snail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './snail.component.html',
  styleUrls: ['./snail.component.scss'],
})
export class SnailComponent implements AfterViewInit {
  @Input()
  matrixSize = 20;

  @ViewChildren('tile')
  tilesRef: QueryList<ElementRef<HTMLDivElement>> | undefined;
  tiles: number[];

  form: FormGroup = new FormGroup({
    matrixSize: new FormControl(this.matrixSize),
  });

  constructor() {
    this.tiles = snail(this.matrixSize);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.form
      .get('matrixSize')
      ?.valueChanges.pipe(startWith(this.matrixSize))
      .subscribe((value) => {
        this.matrixSize = value;
        this.tiles = snail(this.matrixSize);
        this.renderTiles(this.tilesRef!.toArray());
      });
  }

  renderTiles(tiles: ElementRef<HTMLDivElement>[]) {
    tiles.forEach((tile) => tile.nativeElement.classList.remove('active'));
    tiles.forEach((tile, index) => {
      const currentTile = tiles[this.tiles[index] - 1];
      currentTile.nativeElement.style.setProperty(
        '--transition-delay',
        `${index * 20}ms`
      );
      currentTile.nativeElement.style.setProperty(
        '--tile-color',
        `hsl(210, 100%, ${Math.round(
          (index / Math.pow(this.matrixSize, 2)) * 100
        )}%)`
      );
      setTimeout(() => {
        currentTile.nativeElement.classList.add('active');
      }, 1);
    });
  }
}
