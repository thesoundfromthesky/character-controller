export type Movement = {
  moveForward: number;
  moveRight: number;
  moveUpward: number;
  turn: number;
};

export class MovementComponent {
  public constructor(public readonly movement: Partial<Movement> = {}) {}
}
