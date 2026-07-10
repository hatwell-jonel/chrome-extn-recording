import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('should handle arrays', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('should handle objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600')
  })

  it('should return empty string for no arguments', () => {
    expect(cn()).toBe('')
  })

  it('should handle undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})
