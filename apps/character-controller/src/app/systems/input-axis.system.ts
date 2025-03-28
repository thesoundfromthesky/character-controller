import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { KeyboardEventTypes } from '@babylonjs/core';
import { injectService } from '../injector/inject-service.function';
import type {
  InputAxisComponent,
  AxisKeyboardEventCode,
} from '../components/input-axis.component';

@injectable()
export class InputAxisSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly inputAxisQuery = this.worldService
    .getWorld<InputAxisComponent>()
    .with('inputAxis');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.initKeyboardEvent();
  }

  private initKeyboardEvent() {
    this.sceneService.scene.onKeyboardObservable.add(
      ({ type, event: { code } }) => {
        for (const { inputAxis } of this.inputAxisQuery) {
          const axis = inputAxis[code as AxisKeyboardEventCode];
          if (axis) {
            switch (type) {
              case KeyboardEventTypes.KEYDOWN:
                axis['isPressed'] = true;
                break;
              case KeyboardEventTypes.KEYUP:
                axis['isPressed'] = false;
                break;
            }
          }
        }
      }
    );
  }
}
