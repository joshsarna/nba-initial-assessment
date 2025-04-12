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
    return teams.filter((team: NBATeam) => team.full_name?.toLowerCase().includes(name?.toLowerCase()))
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
  getPlayersPerDraftRound = async (
    /**
     * the BALLDONTLIE API's ID for the team; can be found on the response from the `getTeams` function
     */
    teamId: number,
  ): Promise<Record<string, number>> => {
    const players: NBAPlayer[] = await this.getPlayers(teamId)
    return this.countPlayersPerDraftRound(players)
  }

  /**
   * Returns an object with keys of round numbers and values of the number of players
   * acquired in that round; players without a draft round will be counted with a key of 'null'
   */
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

  /**
   * Gets a list of NBA teams
   */
  private getTeams = async (): Promise<NBATeam[]> => {
    const response = await this.makeRequest<NBATeam>(() => this.client.getTeams())
    return response?.data || []
  }

  /**
   * Gets a list of players for a given NBA team
   */
  private getPlayers = async (
    /**
     * the BALLDONTLIE API's ID for the team; can be found on the response from the `getTeams` function
     */
    teamId: number,
  ): Promise<NBAPlayer[]> => {
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

  /**
   * Handles calling the BALLDONTLIE API through the sdk;
   * retries requests that return 500-level errors (unless explicitly told not to)
   * and throws all other errors
   */
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
