import { injectable } from 'inversify';
import { SceneService } from '../../core/scene.service';
import { WorldService } from '../../core/world.service';
import { UniversalCameraComponent } from '../../components/universal-camera.component';
import { UniversalCamera, Vector3 } from '@babylonjs/core';
import { injectService } from '../../injector/inject-service.function';

@injectable()
export class MainCameraEntity {
  private readonly worldService = injectService(WorldService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private initialize() {
    const { universalCamera } = this.createUniversalCameraComponent();

    this.worldService
      .getWorld<UniversalCameraComponent>()
      .add({ universalCamera });
  }

  private createUniversalCameraComponent() {
    const universalCamera = new UniversalCamera(
      'universal_camera',
      new Vector3(-0.0320209262304308, 0.9768531578888376, -9.907048770744069),
      this.sceneService.scene
    );
    // universalCamera.attachControl();
    // universalCamera.speed = 0.2;
    // universalCamera.setTarget(Vector3.Zero());
    universalCamera.minZ = 0;
    // universalCamera.maxZ = 9999999;
    // universalCamera.inputs.clear();

    return new UniversalCameraComponent(universalCamera);
  }
}
