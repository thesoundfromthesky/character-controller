import { injectable } from 'inversify';
import { injectService } from '../injector/inject-service.function';
import { WorldService } from '../core/world.service';
import { AssetContainerService } from '../core/asset-container.service';
import { SceneService } from '../core/scene.service';
import { MeshComponent } from '../components/mesh.component';
import {
  HingeConstraint,
  type PBRMaterial,
  PhysicsAggregate,
  PhysicsShapeType,
  Texture,
  Vector3,
} from '@babylonjs/core';

@injectable('Transient')
export class LevelTestEntity {
  private readonly worldService = injectService(WorldService);
  private readonly assetContainerService = injectService(AssetContainerService);
  private readonly sceneService = injectService(SceneService);

  public constructor() {
    this.initialize();
  }

  private async initialize() {
    const { mesh } = await this.createMeshComponent();
    this.worldService.getWorld<MeshComponent>().add({ mesh });
  }

  private initLevelPrimitives() {
    const lightmap = new Texture('textures/lightmap.jpg');
    lightmap.uAng = Math.PI;
    lightmap.level = 1.6;
    lightmap.coordinatesIndex = 1;

    const lightmapped = [
      'level_primitive0',
      'level_primitive1',
      'level_primitive2',
    ];
    lightmapped.forEach((meshName) => {
      const { scene } = this.sceneService;
      const mesh = scene.getMeshByName(meshName);
      const isMeshNil = !mesh;
      if (isMeshNil) {
        throw Error(`mesh is ${isMeshNil}`);
      }

      // Create static physics shape for these particular meshes
      new PhysicsAggregate(mesh, PhysicsShapeType.MESH);
      mesh.isPickable = false;

      const { material } = mesh;

      if (material === null || material === undefined) {
        throw Error(`material is ${material}`);
      }
      const pbrMaterial = material as PBRMaterial;
      pbrMaterial.lightmapTexture = lightmap;
      pbrMaterial.useLightmapAsShadowmap = true;
      mesh.freezeWorldMatrix();
      mesh.doNotSyncBoundingInfo = true;
    });
  }

  private initCubes() {
    const cubes = [
      'Cube',
      'Cube.001',
      'Cube.002',
      'Cube.003',
      'Cube.004',
      'Cube.005',
    ];
    cubes.forEach((meshName) => {
      const { scene } = this.sceneService;
      const mesh = scene.getMeshByName(meshName);
      const isMeshNil = !mesh;
      if (isMeshNil) {
        throw Error(`mesh is ${isMeshNil}`);
      }

      new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0.1 });
    });
  }

  private initInclinedPlane() {
    const { scene } = this.sceneService;
    const planeMesh = scene.getMeshByName('Cube.006');
    const isPlaneMeshNil = !planeMesh;
    if (isPlaneMeshNil) {
      throw Error(`planeMesh is ${isPlaneMeshNil}`);
    }
    planeMesh.scaling.set(0.03, 3, 1);

    const fixedMesh = scene.getMeshByName('Cube.007');
    const isFixedMeshNil = !fixedMesh;
    if (isFixedMeshNil) {
      throw Error(`fixedMesh is ${isFixedMeshNil}`);
    }

    const fixedMass = new PhysicsAggregate(fixedMesh, PhysicsShapeType.BOX, {
      mass: 0,
    });
    const plane = new PhysicsAggregate(planeMesh, PhysicsShapeType.BOX, {
      mass: 0.1,
    });

    // plane joint
    const joint = new HingeConstraint(
      new Vector3(0.75, 0, 0),
      new Vector3(-0.25, 0, 0),
      new Vector3(0, 0, -1),
      new Vector3(0, 0, 1),
      scene
    );
    fixedMass.body.addConstraint(plane.body, joint);
  }

  private async createMeshComponent() {
    const assetContainer = await this.assetContainerService.getAssetContainer(
      'meshes/levelTest.glb'
    );
    const root = assetContainer.meshes[0];

    this.initLevelPrimitives();
    this.initCubes();
    this.initInclinedPlane();

    return new MeshComponent(root);
  }
}
