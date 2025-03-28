import { injectable } from 'inversify';
import type { PhysicsCharacterComponent } from '../components/physics-character.component';
import {
  CharacterSupportedState,
  Quaternion,
  Vector3,
  type CharacterSurfaceInfo,
} from '@babylonjs/core';
import type { ActionComponent } from '../components/action.component';
import type { MovementComponent } from '../components/movement.component';

@injectable()
export class PhysicCharacterService {
  public getDesiredVelocity(
    deltaTime: number,
    supportInfo: CharacterSurfaceInfo,
    characterOrientation: Quaternion,
    currentVelocity: Vector3,
    physicsCharacter: PhysicsCharacterComponent['physicsCharacter'],
    { jump }: ActionComponent['action'],
    movement: MovementComponent['movement']
  ) {
    const {
      characterGravity,
      forwardLocalSpace,
      inAirSpeed,
      onGroundSpeed,
      jumpHeight,
      physicsCharacterController,
    } = physicsCharacter;
    const { moveForward, moveRight, moveUpward } = movement;

    const inputDirection = new Vector3(
      moveRight ?? 0,
      moveUpward ?? 0,
      moveForward ?? 0
    );

    const nextState = this.getNextState(
      physicsCharacter.state,
      supportInfo,
      jump as boolean
    );
    if (nextState !== physicsCharacter.state) {
      physicsCharacter.state = nextState;
    }
    const { state } = physicsCharacter;

    const upWorld = characterGravity.normalizeToNew();
    upWorld.scaleInPlace(-1.0);

    const forwardWorld =
      forwardLocalSpace.applyRotationQuaternion(characterOrientation);
    if (state === 'IN_AIR') {
      const desiredVelocity = inputDirection
        .scale(inAirSpeed)
        .applyRotationQuaternion(characterOrientation);
      const outputVelocity = physicsCharacterController.calculateMovement(
        deltaTime,
        forwardWorld,
        upWorld,
        currentVelocity,
        Vector3.ZeroReadOnly,
        desiredVelocity,
        upWorld
      );

      // Restore to original vertical component
      outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
      outputVelocity.addInPlace(upWorld.scale(currentVelocity.dot(upWorld)));
      // Add gravity
      outputVelocity.addInPlace(characterGravity.scale(deltaTime));
      return outputVelocity;
    } else if (state === 'ON_GROUND') {
      // Move character relative to the surface we're standing on
      // Correct input velocity to apply instantly any changes in the velocity of the standing surface and this way
      // avoid artifacts caused by filtering of the output velocity when standing on moving objects.
      const desiredVelocity = inputDirection
        .scale(onGroundSpeed)
        .applyRotationQuaternion(characterOrientation);

      let outputVelocity = physicsCharacterController.calculateMovement(
        deltaTime,
        forwardWorld,
        supportInfo.averageSurfaceNormal,
        currentVelocity,
        supportInfo.averageSurfaceVelocity,
        desiredVelocity,
        upWorld
      );
      // Horizontal projection
      outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
      const inv1k = 1e-3;
      if (outputVelocity.dot(upWorld) > inv1k) {
        const velLen = outputVelocity.length();
        outputVelocity.normalizeFromLength(velLen);

        // Get the desired length in the horizontal direction
        const horizLen = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);

        // Re project the velocity onto the horizontal plane
        const c = supportInfo.averageSurfaceNormal.cross(outputVelocity);
        outputVelocity = c.cross(upWorld);
        outputVelocity.scaleInPlace(horizLen);
      }

      outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
      return outputVelocity;
    } else if (state === 'START_JUMP') {
      const u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
      const curRelVel = currentVelocity.dot(upWorld);
      return currentVelocity.add(upWorld.scale(u - curRelVel));
    }
    return Vector3.Zero();
  }

  private getNextState(
    state: PhysicsCharacterComponent['physicsCharacter']['state'],
    characterSurfaceInfo: CharacterSurfaceInfo,
    jump: boolean
  ) {
    if (state === 'IN_AIR') {
      if (
        characterSurfaceInfo.supportedState ===
        CharacterSupportedState.SUPPORTED
      ) {
        return 'ON_GROUND';
      }
      return 'IN_AIR';
    } else if (state === 'ON_GROUND') {
      if (
        characterSurfaceInfo.supportedState !==
        CharacterSupportedState.SUPPORTED
      ) {
        return 'IN_AIR';
      }

      if (jump) {
        return 'START_JUMP';
      }
      return 'ON_GROUND';
    } else if (state === 'START_JUMP') {
      return 'IN_AIR';
    }

    throw Error(`${characterSurfaceInfo} is invalid.`);
  }
}
