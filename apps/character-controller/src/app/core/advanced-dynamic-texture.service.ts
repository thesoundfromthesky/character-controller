import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { SceneService } from './scene.service';
import { AdvancedDynamicTexture } from '@babylonjs/gui';

@injectable()
export class AdvancedDynamicTextureService {
  private readonly sceneService = injectService(SceneService);
  public readonly advancedDynamicTexture =
    AdvancedDynamicTexture.CreateFullscreenUI(
      'ui',
      true,
      this.sceneService.scene
    );

  public constructor() {
    this.advancedDynamicTexture.idealHeight = 600;
  }
}
