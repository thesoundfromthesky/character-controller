import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import type { PhysicsCharacterComponent } from '../components/physics-character.component';
import type { ActionComponent } from '../components/action.component';
import type { MovementComponent } from '../components/movement.component';
import { PhysicCharacterService } from '../core/physics-character.service';
import { Quaternion, Vector3 } from '@babylonjs/core';
import type { UniversalCameraComponent } from '../components/universal-camera.component';

@injectable()
export class PhysicsCharacterSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly physicCharacterService = injectService(
    PhysicCharacterService
  );
  private readonly physicsCharacterQuery = this.worldService
    .getWorld<
      PhysicsCharacterComponent &
        ActionComponent &
        MovementComponent &
        UniversalCameraComponent
    >()
    .with('physicsCharacter', 'action', 'movement', 'universalCamera');

  public constructor() {
    this.init();
  }

  private init(): void {
    const { scene } = this.sceneService;
    const physicCharacterService = this.physicCharacterService;
    scene.onAfterPhysicsObservable.add(() => {
      if (scene.deltaTime === undefined) {
        return;
      }
      const deltaTime = scene.deltaTime / 1000;
      if (deltaTime === 0) {
        return;
      }

      for (const { physicsCharacter, universalCamera, action, movement } of this
        .physicsCharacterQuery) {
        const {
          physicsCharacterController,
          characterOrientation,
          characterGravity,
        } = physicsCharacter;
        
        const down = Vector3.DownReadOnly;
        const characterSurfaceInfo = physicsCharacterController.checkSupport(
          deltaTime,
          down
        );

        Quaternion.FromEulerAnglesToRef(
          0,
          universalCamera.rotation.y,
          0,
          characterOrientation
        );

        const desiredLinearVelocity = physicCharacterService.getDesiredVelocity(
          deltaTime,
          characterSurfaceInfo,
          characterOrientation,
          physicsCharacterController.getVelocity(),
          physicsCharacter,
          action,
          movement
        );

        physicsCharacterController.setVelocity(desiredLinearVelocity);
        physicsCharacterController.integrate(
          deltaTime,
          characterSurfaceInfo,
          characterGravity
        );
      }
    });
  }
}
