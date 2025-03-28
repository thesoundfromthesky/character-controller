import type { Injector } from './injector';
import type { ServiceIdentifier } from 'inversify';

let currentInjector: Injector | undefined;

/**
 * https://github.com/angular/angular/blob/main/packages/core/src/di/injector_compatibility.ts
 */
export function getInjector(): Injector {
  if (currentInjector) {
    return currentInjector;
  }

  throw Error(
    'injectService() must be called in constructor or field initializer'
  );
}

export function setInjector(injector: Injector | undefined): void {
  currentInjector = injector;
}

export function injectService<T>(serviceIdentifier: ServiceIdentifier<T>): T {
  return getInjector().getService(serviceIdentifier);
}
