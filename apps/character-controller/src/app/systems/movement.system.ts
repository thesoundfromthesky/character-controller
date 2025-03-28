import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import type {
  Movement,
  MovementComponent,
} from '../components/movement.component';
import type {
  InputAxisComponent,
  AxisKeyboardEventCode,
} from '../components/input-axis.component';

@injectable()
export class MovementSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly movementQuery = this.worldService
    .getWorld<InputAxisComponent & MovementComponent>()
    .with('movement', 'inputAxis');

  public constructor() {
    this.init();
  }

  private init(): void {
    this.initMovementSystem();
  }

  private initMovementSystem() {
    this.sceneService.scene.onBeforeAnimationsObservable.add(() => {
      for (const { inputAxis, movement } of this.movementQuery) {
        for (const direction in movement) {
          movement[direction as keyof Movement] = 0;
        }

        for (const code in inputAxis) {
          const input = inputAxis[code as AxisKeyboardEventCode];
          if (input && input.isPressed) {
            const { axis } = input;
            const sum = movement[axis] ?? 0;
            let newSum = sum + input.scale;

            if (newSum > 1) {
              newSum = 1;
            } else if (newSum < -1) {
              newSum = -1;
            }

            movement[axis] = newSum;
          }
        }
      }
    });
  }
}
