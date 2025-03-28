import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { Injector } from '../injector/injector';
import { SceneService } from '../core/scene.service';
import { WorldLifeCycleService } from '../core/world-life-cycle.service';
import { PhysicsService } from '../core/physics.service';
import { MainCameraEntity } from '../entities/cameras/main-camera.entity';
import { HemisphericLightEntity } from '../entities/lights/hemispheric-light.entity';
import { LevelTestEntity } from '../entities/level-test.entity';
import { CharacterEntity } from '../entities/character.entity';
import { CharacterSystem } from '../systems/character.system';
import { InputAxisSystem } from '../systems/input-axis.system';
import { MovementSystem } from '../systems/movement.system';
import { InputActionSystem } from '../systems/input-action.system';
import { MouseSystem } from '../systems/mouse.system';
import { ActionSystem } from '../systems/action.system';
import { PhysicsCharacterSystem } from '../systems/physics-character.system';

@injectable()
export class DemoWorld {
  private readonly injector = injectService(Injector);
  private readonly sceneService = injectService(SceneService);
  private readonly worldLifeCycleService = injectService(WorldLifeCycleService);
  private readonly physicsService = injectService(PhysicsService);

  public constructor() {
    this.worldLifeCycleService.onInitObservable.add(async () => {
      await this.initialize();
    });
  }

  private async initialize() {
    await this.physicsService.init(this.sceneService.scene);
    this.initEntities();
  }

  private initEntities() {
    const inputSystems = [
      InputAxisSystem,
      InputActionSystem,
      MouseSystem,
      ActionSystem,
      MovementSystem,
    ];
    this.injector.createInstances([
      MainCameraEntity,
      HemisphericLightEntity,
      ...inputSystems,
      PhysicsCharacterSystem,
      CharacterSystem,
      LevelTestEntity,
      CharacterEntity,
    ]);
  }
}
