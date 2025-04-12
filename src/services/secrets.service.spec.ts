import { secretsService } from './secrets.service'

describe('secretsService', () => {
  describe('getBallDontLieApiKey tests', () => {
    const apiKey: string = 'melon'
    it('fetches the api key', () => {
      process.env.BALL_DONT_LIE_API_KEY = apiKey
      const fetchedApiKey = secretsService.getBallDontLieApiKey()
      expect(fetchedApiKey).toBeTruthy()
      expect(fetchedApiKey).toBe(apiKey)
    })

    it('throws an error when the api key could not be fetched', () => {
      delete process.env.BALL_DONT_LIE_API_KEY
      expect(secretsService.getBallDontLieApiKey).toThrow()
    })
  })
})
