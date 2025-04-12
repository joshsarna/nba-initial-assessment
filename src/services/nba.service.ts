import { BalldontlieAPI, NBAPlayer, NBATeam } from '@balldontlie/sdk'

class NbaService {
  api: BalldontlieAPI

  constructor() {
    const apiKey = process.env.BALL_DONT_LIE_API_KEY
    if (!apiKey) {
      throw new Error('API key for BALLDONTLIE must be set on process.env')
    }

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
