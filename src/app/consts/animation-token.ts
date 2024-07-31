import { InjectionToken } from '@angular/core';

export const ANIMATION_MODULE_TYPE = new InjectionToken<'NoopAnimations' | 'BrowserAnimations'>('AnimationModuleType');