import { BalldontlieAPI, NBAPlayer, NBATeam } from '@balldontlie/sdk'
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
    const response = await this.client.getTeams()
    return response?.data || []
  }

  private getPlayers = async (teamId: number): Promise<NBAPlayer[]> => {
    const response = await this.client.getPlayers({ team_ids: [teamId] })
    return response?.data || []
  }
}

export const nbaService = new NbaService()
