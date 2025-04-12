try {
  require('./localConfig')
} catch (error) {
  //
}

import { nbaService } from './services/nba.service'

const main = async () => {
  const teams = await nbaService.getTeams()

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i]
    console.log('Team Name:', team.name)

    const playersPerDraftRound = await nbaService.getPlayersPerDraftRound(team.id)
    console.log('Draft Rounds:', playersPerDraftRound, '\n')
  }
}

void main().catch((error) => {
  console.log('SCRIPT FAILED', error)
})
