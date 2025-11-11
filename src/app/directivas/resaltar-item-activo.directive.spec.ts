import { ResaltarItemActivoDirective } from './resaltar-item-activo.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

describe('ResaltarItemActivoDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;
    const mockRenderer = {} as Renderer2;
    const mockRouter = {} as Router;
    const directive = new ResaltarItemActivoDirective(mockElementRef, mockRenderer, mockRouter);
    expect(directive).toBeTruthy();
  });
});

