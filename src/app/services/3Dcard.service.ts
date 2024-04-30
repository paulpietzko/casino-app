import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardEffectsService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  applyEffect(cardElement: HTMLElement) {
    let bounds: DOMRect;

    const rotateToMouse = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;
      const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2,
      };
      const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

      this.renderer.setStyle(
        cardElement,
        'transform',
        `scale3d(1.07, 1.07, 1.07) rotate3d(${center.y / 100}, ${-center.x / 100}, 0, ${Math.log(distance) * 2}deg)`,
      );

      const glowElement = cardElement.querySelector('.glow') as HTMLElement;
      this.renderer.setStyle(
        glowElement,
        'background-image',
        `radial-gradient(circle at ${center.x * 2 + bounds.width / 2}px ${center.y * 2 + bounds.height / 2}px, #ffffff55, #0000000f)`,
      );
    };

    const mouseMoveListener = this.renderer.listen(
      'document',
      'mousemove',
      rotateToMouse,
    );

    const mouseEnterListener = this.renderer.listen(
      cardElement,
      'mouseenter',
      () => {
        bounds = cardElement.getBoundingClientRect();
      },
    );

    const mouseLeaveListener = this.renderer.listen(
      cardElement,
      'mouseleave',
      () => {
        mouseMoveListener(); // Rufen Sie die Funktion auf, die von listen zurückgegeben wurde, um den Listener zu entfernen.
        this.renderer.setStyle(cardElement, 'transform', '');
        const glowElement = cardElement.querySelector('.glow') as HTMLElement;
        this.renderer.setStyle(glowElement, 'background-image', '');
      },
    );
  }
}
