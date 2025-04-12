import { assertExists } from './assertExists'

describe('assertExists', () => {
  const errorMessage: string = 'Fool of a Took!'
  it('does not throw an error for truthy values', () => {
    const truthyValues: any[] = [true, {}, [], 'well noises', 1, new Promise(() => {})]

    truthyValues.forEach((truthyValue) => {
      expect(() => assertExists(truthyValue, errorMessage)).not.toThrow()
    })
  })

  it('throws an error for falsy values', () => {
    const falsyValues: any[] = [false, null, undefined, '', 0, NaN]

    falsyValues.forEach((falsyValue) => {
      expect(() => assertExists(falsyValue, errorMessage)).toThrow(errorMessage)
    })
  })
})
