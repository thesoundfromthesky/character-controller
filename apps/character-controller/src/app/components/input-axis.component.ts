import type { Movement } from './movement.component';

export type AxisKeyboardEventCode =
  | 'KeyW'
  | 'KeyS'
  | 'KeyA'
  | 'KeyD'
  | 'KeyQ'
  | 'KeyE';

// export enum AxisKeyboardEventCode {
//   'KeyW' = 87,
//   'KeyS' = 83,
//   'KeyA' = 65,
//   'KeyD' = 68,
//   'KeyQ' = 81,
//   'KeyE' = 69,
// }

export type InputAxis = Record<
AxisKeyboardEventCode,
  { scale: number; axis: keyof Movement; isPressed?: boolean }
>;

export class InputAxisComponent {
  public constructor(public readonly inputAxis: Partial<InputAxis>) {}
}
