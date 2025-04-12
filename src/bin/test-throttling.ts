try {
  require('../localConfig')
} catch {
  //
}

import { nbaService } from '../services/nba.service'

const MAX_REQUESTS_PER_MINUTE: number = 30

/**
 * Test error handling of the nbaService
 */
const main = async () => {
  for (let i = 0; i < MAX_REQUESTS_PER_MINUTE + 1; i++) {
    await nbaService.searchTeamsByName('Fellowship of the Ring')
  }
}

void main().catch((error) => {
  console.log('ERROR', error?.message)
})
