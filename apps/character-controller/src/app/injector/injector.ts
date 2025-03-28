import { Container, type Newable, type ServiceIdentifier } from 'inversify';
import { UpdateInjector } from './update-injector.method-decorator';

export class Injector {
  public container = new Container({ defaultScope: 'Singleton' });

  @UpdateInjector()
  public createInstance<T>(newableClasses: Newable<T>): T {
    this.container.bind(newableClasses).toSelf().inTransientScope();
    const instance = this.container.get(newableClasses);

    return instance;
  }

  public createInstances(newableClass: Newable<object>[]): void {
    newableClass.forEach((newableClass) => {
      this.createInstance(newableClass);
    });
  }

  public getService<T>(serviceIdentifier: ServiceIdentifier<T>): T {
    return this.container.get(serviceIdentifier);
  }
}
