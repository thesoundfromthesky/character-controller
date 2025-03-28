import type { Action } from './action.component';

export type ActionKeyboardEventCode = 'Space' | 'Escape';
export type InputAction = Record<
  ActionKeyboardEventCode,
  {
    action: keyof Action;
    isPressed?: boolean;
  }
>;
export class InputActionComponent {
  public constructor(public readonly inputAction: Partial<InputAction>) {}
}
