/**
 * asserts that the predicate has a truthy value and throws an error if it does not;
 *
 * `function` used instead of an arrow function because typescript assertion requirements:
 * https://github.com/microsoft/TypeScript/issues/34523
 */
export function assertExists(predicate: any, errorMessage: string): asserts predicate {
  if (!predicate) {
    throw new Error(errorMessage)
  }
}
