import { createModuleSourceGraph, isStale } from './detect-stale'

describe('createModuleSourceGraph', () => {
  test('', () => {
    expect(
      createModuleSourceGraph([{ from: 'a.ts', to: 'b.ts' }]),
    ).toEqual({ 'a.ts': new Set(['b.ts']) })
  })

  test('', () => {
    expect(
      createModuleSourceGraph([
        { from: 'a.ts', to: 'b.ts' },
        { from: 'a.ts', to: 'c.ts' },
      ]),
    ).toEqual({ 'a.ts': new Set(['b.ts', 'c.ts']) })
  })
})

describe('isStale', () => {
  test('', () => {
    expect(
      isStale({
        a: new Set(['b']),
      }),
    ).toBeFalsy()
  })

  test('', () => {
    expect(
      isStale({
        a: new Set(['b']),
        b: new Set(['a']),
      }),
    ).toBeTruthy()
  })

  test('', () => {
    expect(
      isStale({
        a: new Set(['b', 'c']),
        b: new Set(['c']),
      }),
    ).toBeFalsy()
  })

  test('', () => {
    expect(
      isStale({
        a: new Set(['b']),
        b: new Set(['c']),
        c: new Set(['d']),
        d: new Set(['e']),
        e: new Set(['a']),
      }),
    ).toBeTruthy()
  })
})
