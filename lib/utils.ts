import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import canvasConfetti from 'canvas-confetti'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

export function confetti(options: {
  particleCount?: number
  spread?: number
  origin?: { x?: number; y?: number }
}) {
  canvasConfetti({
    particleCount: options.particleCount || 100,
    spread: options.spread || 70,
    origin: {
      x: options.origin?.x || 0.5,
      y: options.origin?.y || 0.5
    }
  })
}