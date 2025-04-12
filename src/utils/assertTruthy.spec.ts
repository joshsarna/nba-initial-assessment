import { assertTruthy } from './assertTruthy'

describe('assertTruthy', () => {
  const errorMessage: string = 'Fool of a Took!'
  it('does not throw an error for truthy values', () => {
    const truthyValues = [true, {}, [], 'well noises', 1, new Promise(() => {})]

    truthyValues.forEach((truthyValue) => {
      expect(() => assertTruthy(truthyValue, errorMessage)).not.toThrow()
    })
  })

  it('throws an error for falsy values', () => {
    const falsyValues = [false, null, undefined, '', 0, NaN]

    falsyValues.forEach((falsyValue) => {
      expect(() => assertTruthy(falsyValue, errorMessage)).toThrow(errorMessage)
    })
  })
})
