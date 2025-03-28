import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import type { MeshComponent } from '../components/mesh.component';
import { SceneService } from '../core/scene.service';
import {
  type AbstractMesh,
  PointerEventTypes,
  type TargetCamera,
  Vector3,
} from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import { PhysicsCharacterComponent } from '../components/physics-character.component';
import { UniversalCameraComponent } from '../components/universal-camera.component';
import type { MouseComponent } from '../components/mouse.component';

@injectable()
export class CharacterSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly characterQuery = this.worldService
    .getWorld<
      MeshComponent &
        PhysicsCharacterComponent &
        UniversalCameraComponent &
        MouseComponent
    >()
    .with('mesh', 'universalCamera', 'physicsCharacter', 'mouse');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.initCharacterCameraRotation();
    this.initCharacterAndCameraPosition();
  }

  private initCharacterAndCameraPosition() {
    this.sceneService.scene.onBeforeRenderObservable.add(() => {
      for (const {
        mesh,
        physicsCharacter: { physicsCharacterController },
        universalCamera,
      } of this.characterQuery) {
        this.updateCharacterPosition(
          mesh,
          physicsCharacterController.getPosition()
        );
        this.updateCharacterCameraPosition(universalCamera, mesh);
      }
    });
  }

  private updateCharacterPosition(
    characterMesh: AbstractMesh,
    physicsCharacterControllerPosition: Vector3
  ) {
    characterMesh.position.copyFrom(physicsCharacterControllerPosition);
  }

  private updateCharacterCameraPosition(
    characterCamera: TargetCamera,
    characterMesh: AbstractMesh
  ) {
    const cameraDirection = characterCamera.getDirection(
      Vector3.LeftHandedForwardReadOnly
    );
    cameraDirection.y = 0;
    cameraDirection.normalize();
    characterCamera.setTarget(
      Vector3.Lerp(characterCamera.getTarget(), characterMesh.position, 0.1)
    );
    const dist = Vector3.Distance(
      characterCamera.position,
      characterMesh.position
    );
    const amount = (Math.min(dist - 6, 0) + Math.max(dist - 9, 0)) * 0.04;
    cameraDirection.scaleAndAddToRef(amount, characterCamera.position);
    characterCamera.position.y +=
      (characterMesh.position.y + 2 - characterCamera.position.y) * 0.04;
  }

  private initCharacterCameraRotation() {
    this.sceneService.scene.onPointerObservable.add(
      ({ type, event: { movementX } }) => {
        for (const { mouse, universalCamera } of this.characterQuery) {
          if (
            mouse.leftMouseButton?.isPressed &&
            type === PointerEventTypes.POINTERMOVE
          ) {
            const target = universalCamera.getTarget().clone();
            universalCamera.position.addInPlace(
              universalCamera
                .getDirection(Vector3.Right())
                .scale(movementX * -0.02)
            );
            universalCamera.setTarget(target);
          }
        }
      }
    );
  }
}
