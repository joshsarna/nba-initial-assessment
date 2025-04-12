import { assertTruthy } from '../utils/assertTruthy'

/**
 * This service handles fetching secrets.
 *
 * Secrets should eventually be stored in a more secured shared place (e.g. AWS SSM)
 */
class SecretsService {
  /**
   * Get API key for the BALLDONTLIE API;
   * if the API key is not set in `process.env`, this will throw
   */
  getBallDontLieApiKey = (): string => {
    const ballDontLieApiKey: string = process.env.BALL_DONT_LIE_API_KEY
    assertTruthy(ballDontLieApiKey, 'API key for BALLDONTLIE must be set on process.env')

    return ballDontLieApiKey
  }
}

export const secretsService = new SecretsService()
