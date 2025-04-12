try {
  require('../localConfig')
} catch (error) {
  //
}

import { nbaService } from '../services/nba.service'
import { ArgumentParser } from 'argparse'

const parser = new ArgumentParser()

parser.add_argument('--team', {
  type: String,
  required: true,
})

const args: { team: string } = parser.parse_args()

const main = async () => {
  const team = await nbaService.getTeamByName(args.team)

  console.log('Team Name:', team.full_name)

  const playersPerDraftRound = await nbaService.getPlayersPerDraftRound(team.id)
  console.log('Draft Rounds:', playersPerDraftRound)
}

void main().catch((error) => {
  console.log('ERROR', error?.message)
})
