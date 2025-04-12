import { NBAPlayer, NBATeam } from '@balldontlie/sdk'
import { nbaService } from './nba.service'
import { secretsService } from './secrets.service'

describe('nbaService', () => {
  const players: NBAPlayer[] = [
    { id: 1, first_name: 'Frodo', last_name: 'Baggins', position: 'Ringbearer', draft_round: null },
    { id: 2, first_name: 'Gandalf', last_name: 'The Grey', position: 'Guide', draft_round: 1 },
    {
      id: 3,
      first_name: 'Aragorn',
      position: 'Sword',
      draft_round: 1,
    },
    {
      id: 4,
      first_name: 'Legolas',
      position: 'Bow',
      draft_round: 1,
    },
    {
      id: 5,
      first_name: 'Gimli',
      position: 'Axe',
      draft_round: 1,
    },
    {
      id: 6,
      first_name: 'Boromir',
      /* Gondor will see it done */
      position: 'Supervisor',
      draft_round: 2,
    },
    {
      id: 7,
      first_name: 'Samwise',
      last_name: 'Gamgee',
      position: 'Hero',
      draft_round: 3,
    },
    {
      id: 8,
      first_name: 'Meriadoc',
      last_name: 'Brandybuck',
      position: 'Intelligence',
      draft_round: 3,
    },
    {
      id: 9,
      first_name: 'Peregrin',
      last_name: 'Took',
      /* You need people of intelligence on this sort of mission. Quest. Thing. */
      position: 'Intelligence',
      draft_round: 3,
    },
  ] as NBAPlayer[]
  const teams: NBATeam[] = [{ id: 1, full_name: 'The Fellowship of the Ring' }] as NBATeam[]
  const teamNameWithNoMatches: string = 'thirteen dwarves, one hobbit'
  const expectedDraftRoundCounts: Record<string, number> = {
    null: 1,
    '1': 4,
    '2': 1,
    '3': 3,
  }

  beforeEach(() => {
    jest.spyOn(secretsService, 'getBallDontLieApiKey').mockReturnValue(null)
    //@ts-ignore // getPlayers is private
    jest.spyOn(nbaService, 'getPlayers').mockResolvedValue(players)
    //@ts-ignore // getTeams is private
    jest.spyOn(nbaService, 'getTeams').mockResolvedValue(teams)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('searchTeamsByName', () => {
    it('gets teams that match a search term', async () => {
      const result = await nbaService.searchTeamsByName('Fellowship')
      expect(result.length).toBe(1)
      expect(result[0]).toEqual(teams[0])
    })

    it('ignores casing', async () => {
      const result = await nbaService.searchTeamsByName('fellowship')
      expect(result.length).toBe(1)
      expect(result[0]).toEqual(teams[0])
    })

    it('returns no results when there are no matches', async () => {
      const result = await nbaService.searchTeamsByName(teamNameWithNoMatches)
      expect(result.length).toBe(0)
    })
  })

  describe('getTeamByName', () => {
    it('gets a team that matches a search term', async () => {
      const result = await nbaService.getTeamByName('Fellowship')
      expect(result).toBeTruthy()
      expect(result).toEqual(teams[0])
    })

    it('ignores casing', async () => {
      const result = await nbaService.getTeamByName('fellowship')
      expect(result).toBeTruthy()
      expect(result).toEqual(teams[0])
    })

    it('throws an error when there are no matches', async () => {
      await expect(async () => await nbaService.getTeamByName(teamNameWithNoMatches)).rejects.toThrow(
        `team name ${teamNameWithNoMatches} matched 0 teams`,
      )
    })
  })

  describe('getPlayersPerDraftRound tests', () => {
    it('counts players per draft round for a team', async () => {
      const result = await nbaService.getPlayersPerDraftRound(1)

      expect(result).toEqual(expectedDraftRoundCounts)
    })
  })

  describe('countPlayersPerDraftRound tests', () => {
    it('counts players per draft round', () => {
      //@ts-ignore // countPlayersPerDraftRound is private
      const result = nbaService.countPlayersPerDraftRound(players)

      expect(result).toEqual(expectedDraftRoundCounts)
    })
  })

  describe('makeRequest tests', () => {
    it('retries when encountering a 500 error', async () => {
      let requestCount: number = 0
      const request = (): { data: string[] } => {
        requestCount++
        throw { statusCode: 502, message: 'Bad Gateway' }
      }
      try {
        //@ts-ignore // makeRequest is private
        await nbaService.makeRequest<string>(async () => request())
      } catch {}

      expect(requestCount).toBe(2)
    })

    it('does not retry told not to', async () => {
      let requestCount: number = 0
      const request = (): { data: string[] } => {
        requestCount++
        throw { statusCode: 502, message: 'Bad Gateway' }
      }
      try {
        //@ts-ignore // makeRequest is private
        await nbaService.makeRequest<string>(async () => request(), false)
      } catch {}

      expect(requestCount).toBe(1)
    })
  })
})
