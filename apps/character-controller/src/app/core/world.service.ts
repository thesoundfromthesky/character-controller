import { injectable } from 'inversify';
import { World } from 'miniplex';

@injectable()
export class WorldService {
  #world = new World();

  public getWorld<T extends object>(): World<T> {
    return this.#world;
  }
}
