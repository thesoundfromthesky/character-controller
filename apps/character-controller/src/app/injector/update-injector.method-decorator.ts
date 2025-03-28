import { setInjector } from './inject-service.function';

import type { Injector } from './injector';

export function UpdateInjector(): MethodDecorator {
  return function (
    this: undefined,
    target: unknown,
    name: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const original = descriptor.value;

    descriptor.value = function (this: Injector, ...args: unknown[]) {
      setInjector(this);
      const result = original.apply(this, args);
      setInjector(undefined);
      return result;
    };

    return descriptor;
  };
}
