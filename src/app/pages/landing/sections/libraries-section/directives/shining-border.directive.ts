import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appShiningBorder]',
  standalone: true,
})
export class ShiningBorderDirective {
  cards: NodeListOf<HTMLDivElement> | undefined;

  // ngAfterViewInit(): void {
  //   this.cards = this.el.nativeElement.querySelectorAll('.card');
  //   console.log('cards', this.cards);
  // }

  constructor(private el: ElementRef<HTMLDivElement>) {
    console.log('HAAAALLOOOOO')
    this.cards = this.el.nativeElement.querySelectorAll('.card');
    console.log('cards', this.cards);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;

    this.cards!.forEach((card) => {
      const { left, top } = card.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;

      card.style.setProperty('--xPos', `${x}px`);
      card.style.setProperty('--yPos', `${y}px`);
    });
  }
}
