import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: false
})
export class FadeInDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    this.renderer.addClass(element, 'fade-in-section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Cuando entra en la vista -> aparece
            this.renderer.addClass(element, 'is-visible');
          } else {
            // Cuando sale de la vista -> desaparece
            this.renderer.removeClass(element, 'is-visible');
          }
        });
      },
      { threshold: 0.1 } // con que el 10% esté visible, se activa
    );

    observer.observe(element);
  }
}
