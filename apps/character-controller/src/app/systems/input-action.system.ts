import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from '../core/scene.service';
import {
  type ActionKeyboardEventCode,
  type InputActionComponent,
} from '../components/input-action.component';
import { KeyboardEventTypes } from '@babylonjs/core';
import type { ActionComponent } from '../components/action.component';

@injectable()
export class InputActionSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly inputActionQuery = this.worldService
    .getWorld<InputActionComponent & ActionComponent>()
    .with('inputAction', 'action');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.initKeyboardEvent();
  }

  private initKeyboardEvent() {
    this.sceneService.scene.onKeyboardObservable.add(
      ({ type, event: { code } }) => {
        for (const { inputAction, action } of this.inputActionQuery) {
          const actionState= inputAction[code as ActionKeyboardEventCode];
          if (actionState) {
            switch (type) {
              case KeyboardEventTypes.KEYDOWN:
                actionState['isPressed'] = true;
                break;
              case KeyboardEventTypes.KEYUP:
                actionState['isPressed'] = false;
                action[actionState.action] = false;
                break;
            }
          }
        }
      }
    );
  }
}
