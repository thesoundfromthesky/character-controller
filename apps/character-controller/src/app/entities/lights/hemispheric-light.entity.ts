import { injectable } from 'inversify';
import { SceneService } from '../../core/scene.service';
import { WorldService } from '../../core/world.service';
import { HemisphericLightComponent } from '../../components/hemispheric-light.component';
import { Color3, HemisphericLight, Vector3 } from '@babylonjs/core';
import { injectService } from '../../injector/inject-service.function';

@injectable()
export class HemisphericLightEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { hemisphericLight } = this.createHemisphericLightComponent();

    this.worldService
      .getWorld<HemisphericLightComponent>()
      .add({ hemisphericLight });
  }

  private createHemisphericLightComponent() {
    const hemisphericLight = new HemisphericLight(
      'hemispheric_light',
      new Vector3(0, 1, 0),
      this.sceneService.scene
    );
    hemisphericLight.intensity = 0.7;
    hemisphericLight.specular = Color3.Black();

    return new HemisphericLightComponent(hemisphericLight);
  }
}
