import { injectable } from 'inversify';
import { EngineService } from './engine.service';
import { Scene, ScenePerformancePriority } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';

@injectable()
export class SceneService {
  private readonly engineService = injectService(EngineService);
  public readonly scene = new Scene(this.engineService.engine);

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.scene.performancePriority = ScenePerformancePriority.Intermediate;
    this.scene.freezeActiveMeshes(true);
  }

  private render(): void {
    this.scene.render();
  }

  public runRenderLoop(): void {
    this.engineService.engine.runRenderLoop(this.render.bind(this));
  }
  
  public focusCanvas() {
    this.engineService.engine.getRenderingCanvas()?.focus();
  }
}
