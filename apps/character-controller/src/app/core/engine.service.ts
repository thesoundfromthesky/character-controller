import { injectable } from 'inversify';
import { CanvasService } from './canvas.service';
import { Database, Engine, Observable } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class EngineService {
  private readonly canvasService = injectService(CanvasService);

  public readonly engine = new Engine(
    this.canvasService.getCanvasOrThrow(),
    true
  );
  public readonly onResizingObservable = new Observable<void>();

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    // https://forum.babylonjs.com/t/is-babylon-caching-to-indexeddb-works-as-expected/26962/10
    Database.IDBStorageEnabled = true;
    this.engine.enableOfflineSupport = true;
    this.engine.disableManifestCheck = true;
    // this will disable adaptToDeviceRatio option
    // this.engine.setHardwareScalingLevel(2);
 
    const resizeObserver = new ResizeObserver(() => {
      this.engine.resize();
      this.onResizingObservable.notifyObservers();
      // https://forum.babylonjs.com/t/stop-the-resize-how/10513/8
    });

    resizeObserver.observe(this.canvasService.getCanvasOrThrow());
  }
}
