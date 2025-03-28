type MouseButton = {
  leftMouseButton: { isPressed?: boolean };
  middleMouseButton: { isPressed?: boolean };
  rightMouseButton: { isPressed?: boolean };
};

export class MouseComponent {
  public constructor(public readonly mouse: Partial<MouseButton> = {}) {}
}
