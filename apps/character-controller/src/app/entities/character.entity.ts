import {
  type AbstractMesh,
  CreateCapsule,
  PhysicsCharacterController,
  Quaternion,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { MeshComponent } from '../components/mesh.component';
import { PhysicsCharacterComponent } from '../components/physics-character.component';
import { UniversalCameraComponent } from '../components/universal-camera.component';
import { InputAxisComponent } from '../components/input-axis.component';
import { InputActionComponent } from '../components/input-action.component';
import { MovementComponent } from '../components/movement.component';
import { MouseComponent } from '../components/mouse.component';
import { ActionComponent } from '../components/action.component';

@injectable('Transient')
export class CharacterEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private async initialize() {
    const { mesh } = await this.createMeshComponent();
    const { physicsCharacter } =
      this.createPhysicsCharacterControllerComponent(mesh);
    const { physicsCharacterController } = physicsCharacter;
    const characterPosition = physicsCharacterController.getPosition();
    const { universalCamera } =
      this.createUniversalCameraComponent(characterPosition);
    const { inputAxis } = this.createInputAxisComponent();
    const { movement } = this.createMovementComponent();
    const { inputAction } = this.createInputActionComponent();
    const { mouse } = this.createMouseComponent();
    const { action } = this.createActionComponent();

    this.worldService
      .getWorld<
        MeshComponent &
          PhysicsCharacterComponent &
          UniversalCameraComponent &
          InputAxisComponent &
          MovementComponent &
          InputActionComponent &
          ActionComponent &
          MouseComponent
      >()
      .add({
        mesh,
        physicsCharacter,
        universalCamera,
        inputAxis,
        movement,
        inputAction,
        mouse,
        action,
      });
  }

  private createMouseComponent() {
    return new MouseComponent();
  }

  private async createMeshComponent() {
    const { scene } = this.sceneService;
    const height = 1.8;
    const radius = 0.6;
    const displayCapsule = CreateCapsule(
      'character_display',
      { height, radius },
      scene
    );

    return new MeshComponent(displayCapsule);
  }

  private createInputActionComponent() {
    return new InputActionComponent({ Space: { action: 'jump' } });
  }

  private createActionComponent() {
    return new ActionComponent();
  }

  private createInputAxisComponent() {
    const inputAxisComponent = new InputAxisComponent({
      KeyD: { scale: 1, axis: 'moveRight' },
      KeyA: { scale: -1, axis: 'moveRight' },
      KeyW: { scale: 1, axis: 'moveForward' },
      KeyS: { scale: -1, axis: 'moveForward' },
    });

    return inputAxisComponent;
  }

  private createMovementComponent() {
    return new MovementComponent();
  }

  private createUniversalCameraComponent(target: Vector3) {
    const { scene } = this.sceneService;
    const universalCamera = new UniversalCamera(
      'character_camera',
      new Vector3(-0.0320209262304308, 0.9768531578888376, -9.907048770744069),
      scene
    );

    scene.switchActiveCamera(universalCamera, false);
    universalCamera.setTarget(target);
    universalCamera.minZ = 0;

    // universalCamera.attachControl();
    // universalCamera.speed = 0.2;
    // universalCamera.maxZ = 9999999;
    // universalCamera.inputs.clear();

    return new UniversalCameraComponent(universalCamera);
  }

  private createPhysicsCharacterControllerComponent(mesh: AbstractMesh) {
    const { scene } = this.sceneService;
    const characterPosition = new Vector3(3, 0.3, -8);

    const { x, y } = mesh.getBoundingInfo().boundingBox.extendSizeWorld;
    const physicsCharacterController = new PhysicsCharacterController(
      characterPosition,
      { capsuleRadius: x, capsuleHeight: y * 2 },
      scene
    );

    return new PhysicsCharacterComponent({
      physicsCharacterController: physicsCharacterController,
      state: 'IN_AIR',
      inAirSpeed: 8,
      onGroundSpeed: 10,
      jumpHeight: 1.5,
      forwardLocalSpace: new Vector3(0, 0, 1),
      characterOrientation: Quaternion.Identity(),
      characterGravity: new Vector3(0, -18, 0),
    });
  }
}
