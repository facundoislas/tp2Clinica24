import { ResaltarDirective } from './resaltar.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('ResaltarDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;
    const mockRenderer = {} as Renderer2;
    const directive = new ResaltarDirective(mockElementRef, mockRenderer);
    expect(directive).toBeTruthy();
  });
});

