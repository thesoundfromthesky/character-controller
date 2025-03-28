import { injectable } from 'inversify';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { injectService } from '../injector/inject-service.function';
import type {
  ActionKeyboardEventCode,
  InputActionComponent,
} from '../components/input-action.component';
import type { ActionComponent } from '../components/action.component';

@injectable()
export class ActionSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly actionQuery = this.worldService
    .getWorld<InputActionComponent & ActionComponent>()
    .with('inputAction', 'action');

  public constructor() {
    this.init();
  }

  private init(): void {
    this.initActionSystem();
  }

  private initActionSystem() {
    this.sceneService.scene.onBeforeAnimationsObservable.add(() => {
      for (const { action, inputAction } of this.actionQuery) {
        for (const code in inputAction) {
          const input = inputAction[code as ActionKeyboardEventCode];
          if (input && input.isPressed) {
            const { action: actionName } = input;
            action[actionName] = true;
          }
        }
      }
    });
  }
}
