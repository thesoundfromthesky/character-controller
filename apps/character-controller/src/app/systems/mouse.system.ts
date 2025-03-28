import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { SceneService } from '../core/scene.service';
import { MouseComponent } from '../components/mouse.component';
import { PointerEventTypes } from '@babylonjs/core';

enum PointerButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
}

@injectable()
export class MouseSystem {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);
  private readonly mouseQuery = this.worldService
    .getWorld<MouseComponent>()
    .with('mouse');

  public constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.initMouseEvent();
  }

  private initMouseEvent() {
    this.sceneService.scene.onPointerObservable.add(
      ({ event: { button }, type }) => {
        for (const { mouse } of this.mouseQuery) {
          switch (button) {
            case PointerButton.Left:
              mouse.leftMouseButton ??= {};
              mouse.leftMouseButton.isPressed =
                type === PointerEventTypes.POINTERDOWN;
              break;
            case PointerButton.Middle:
              mouse.middleMouseButton ??= {};
              mouse.middleMouseButton.isPressed =
                type === PointerEventTypes.POINTERDOWN;
              break;
            case PointerButton.Right:
              mouse.rightMouseButton ??= {};
              mouse.rightMouseButton.isPressed =
                type === PointerEventTypes.POINTERDOWN;
              break;
          }
        }
      }
    );
  }
}
