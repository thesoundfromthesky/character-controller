import type {
  PhysicsCharacterController,
  Quaternion,
  Vector3,
} from '@babylonjs/core';

export class PhysicsCharacterComponent {
  public constructor(
    public readonly physicsCharacter: {
      physicsCharacterController: PhysicsCharacterController;
      state: 'ON_GROUND' | 'IN_AIR' | 'START_JUMP';
      inAirSpeed: number;
      onGroundSpeed: number;
      jumpHeight: number;
      forwardLocalSpace: Vector3;
      characterOrientation: Quaternion;
      characterGravity: Vector3;
    }
  ) {}
}
