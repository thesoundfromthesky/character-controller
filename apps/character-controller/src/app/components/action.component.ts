export type Action = {
  jump: boolean;
};

export class ActionComponent {
  public constructor(public readonly action: Partial<Action> = {}) {}
}
