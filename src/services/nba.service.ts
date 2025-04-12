import { BalldontlieAPI, NBAPlayer, NBATeam } from '@balldontlie/sdk'
import { secretsService } from './secrets.service'

class NbaService {
  api: BalldontlieAPI

  constructor() {
    const apiKey: string = secretsService.getBallDontLieApiKey()
    this.api = new BalldontlieAPI({ apiKey })
  }

  getTeams = async (): Promise<NBATeam[]> => {
    const response = await this.api.nba.getTeams()
    return response?.data || []
  }

  getPlayers = async (teamId: number): Promise<NBAPlayer[]> => {
    const response = await this.api.nba.getPlayers({ team_ids: [teamId] })
    return response?.data || []
  }

  getPlayersPerDraftRound = async (teamId: number): Promise<Record<string, number>> => {
    const players: NBAPlayer[] = await this.getPlayers(teamId)
    const playersPerDraftRound: Record<string, number> = {}
    players.forEach((player) => {
      if (player.draft_round) {
        if (!playersPerDraftRound[player.draft_round]) {
          playersPerDraftRound[player.draft_round] = 0
        }
        playersPerDraftRound[player.draft_round]++
      }
    })

    return playersPerDraftRound
  }
}

export const nbaService = new NbaService()
