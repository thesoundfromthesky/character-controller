import { Observable } from '@babylonjs/core';
import { injectable } from 'inversify';

@injectable()
export class WorldLifeCycleService {
  public readonly onInitObservable = new Observable();

  public notifyOnInitParallel() {
    const observerCallbacks = this.onInitObservable.observers.map((observer) =>
      observer.callback(undefined, undefined as never)
    );
    return Promise.all(observerCallbacks);
  }
}
