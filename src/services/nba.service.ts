import { ApiResponse, BalldontlieAPI, NBAPlayer, NBATeam } from '@balldontlie/sdk'
import { NBAClient } from '@balldontlie/sdk/dist/nba'
import { secretsService } from './secrets.service'
import { assertTruthy } from '../utils/assertTruthy'

class NbaService {
  client: NBAClient

  constructor() {
    const apiKey: string = secretsService.getBallDontLieApiKey()
    this.client = new BalldontlieAPI({ apiKey }).nba
  }

  /**
   * Returns teams matching the name passed in;
   * the name can be a city, a team name, or both
   */
  searchTeamsByName = async (name: string): Promise<NBATeam[]> => {
    const teams: NBATeam[] = await this.getTeams()
    return teams.filter((team: NBATeam) => team.full_name?.includes(name))
  }

  /**
   * Returns a single team matching the name passed in;
   * the name can be a city, a team name, or both;
   * if more than one team matches the name passed in, this will throw an error;
   * use `searchTeamsByName` if multiple results are desired
   */
  getTeamByName = async (name: string): Promise<NBATeam> => {
    const matchingTeams: NBATeam[] = await this.searchTeamsByName(name)
    assertTruthy(matchingTeams.length === 1, `team name ${name} matched ${matchingTeams.length} teams`)
    return matchingTeams[0]
  }

  /**
   * Returns a breakdown of how many players were obtained in each draft round for a team
   */
  getPlayersPerDraftRound = async (teamId: number): Promise<Record<string, number>> => {
    const players: NBAPlayer[] = await this.getPlayers(teamId)
    return this.countPlayersPerDraftRound(players)
  }

  private countPlayersPerDraftRound = (players: NBAPlayer[]): Record<string, number> => {
    const playersPerDraftRound: Record<string, number> = {}
    players.forEach((player) => {
      if (!playersPerDraftRound[player.draft_round]) {
        playersPerDraftRound[player.draft_round] = 0
      }
      playersPerDraftRound[player.draft_round]++
    })

    return playersPerDraftRound
  }

  private getTeams = async (): Promise<NBATeam[]> => {
    const response = await this.makeRequest<NBATeam>(() => this.client.getTeams())
    return response?.data || []
  }

  private getPlayers = async (teamId: number): Promise<NBAPlayer[]> => {
    const players: NBAPlayer[] = []
    let nextCursor: number
    do {
      const response = await this.makeRequest(() => {
        return this.client.getPlayers({ team_ids: [teamId], per_page: 100, cursor: nextCursor })
      })

      nextCursor = response?.meta?.next_cursor
      if (response?.data) {
        players.push(...response.data)
      }
    } while (nextCursor)
    return players
  }

  private makeRequest = async <T>(
    request: () => Promise<ApiResponse<T[]>>,
    /**
     * When set to true, this will cause requests that reeturn a 500-level error to retry once
     */
    shouldRetry500s: boolean = true,
  ): Promise<ApiResponse<T[]>> => {
    let result: ApiResponse<T[]>
    try {
      result = await request()
    } catch (error) {
      // retry once on 500 errors;
      // documentation (https://docs.balldontlie.io/#errors) calls out 500 and 503,
      // but they also sometimes throw 502 Bad Gateway
      if (error?.statusCode >= 500 && shouldRetry500s) {
        return this.makeRequest(request, false)
      }
      throw new Error(error.message)
    }

    return result
  }
}

export const nbaService = new NbaService()
