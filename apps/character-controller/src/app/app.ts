import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { Injector } from './injector/injector';
import { injectable } from 'inversify';
import { CanvasService } from './core/canvas.service';
import { EngineService } from './core/engine.service';
import { SceneService } from './core/scene.service';
import { AdvancedDynamicTextureService } from './core/advanced-dynamic-texture.service';
import { injectService } from './injector/inject-service.function';
import type { Class } from 'type-fest';
import { WorldService } from './core/world.service';
import { AssetContainerService } from './core/asset-container.service';
import { WorldLifeCycleService } from './core/world-life-cycle.service';
import { PhysicsService } from './core/physics.service';
import { DemoWorld } from './worlds/demo.world';
import { PhysicCharacterService } from './core/physics-character.service';

registerBuiltInLoaders();

const injector = new Injector();
injector.container.bind(Injector).toConstantValue(injector);
injector.container.bind(CanvasService).toSelf();
injector.container.bind(EngineService).toSelf();
injector.container.bind(SceneService).toSelf();
injector.container.bind(WorldService).toSelf();
injector.container.bind(AdvancedDynamicTextureService).toSelf();
injector.container.bind(AssetContainerService).toSelf();
injector.container.bind(WorldLifeCycleService).toSelf();
injector.container.bind(PhysicsService).toSelf();
injector.container.bind(PhysicCharacterService).toSelf();

@injectable()
class App {
  private readonly injector = injectService(Injector);

  public createWorld<T extends object>(world: Class<T>) {
    this.injector.createInstance(world);
  }

  public createWorlds<T extends object>(worlds: Class<T>[]) {
    worlds.forEach((world) => {
      this.createWorld(world);
    });
  }
}

async function start<T extends object>(worlds: Class<T>[]) {
  const isEmpty = worlds.length < 1;
  if (isEmpty) {
    return;
  }

  const app = injector.createInstance(App);
  app.createWorlds(worlds);
  const worldLifeCycleService = injector.getService(WorldLifeCycleService);
  await worldLifeCycleService.notifyOnInitParallel();
  const sceneService = injector.getService(SceneService);
  sceneService.runRenderLoop();

  if (import.meta.env.DEV) {
    await import('@babylonjs/core/Helpers/sceneHelpers');
    await import('@babylonjs/core/Debug/debugLayer');
    await import('@babylonjs/inspector');
    const { Inspector } = await import('@babylonjs/inspector');
    Inspector.Show(sceneService.scene, { embedMode: true });
  }
  sceneService.focusCanvas();
}

start([DemoWorld]);
