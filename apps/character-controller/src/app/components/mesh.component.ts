import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

export class MeshComponent {
  public constructor(public readonly mesh: AbstractMesh) {}
}
