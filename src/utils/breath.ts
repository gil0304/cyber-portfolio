export const BREATH_SPEED = 1.2

export const breathSine = (time: number) => Math.sin(time * BREATH_SPEED)

export const breathPulse = (time: number) => 0.5 + 0.5 * breathSine(time)
