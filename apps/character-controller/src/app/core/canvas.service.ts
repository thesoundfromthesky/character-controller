import { injectable } from 'inversify';

@injectable()
export class CanvasService {
  public getCanvasOrThrow(): HTMLCanvasElement {
    const canvas = globalThis.document.getElementById('game-canvas') as
      | HTMLCanvasElement
      | undefined;

    if (canvas) {
      return canvas;
    }

    throw Error('canvas is undefined');
  }
}
