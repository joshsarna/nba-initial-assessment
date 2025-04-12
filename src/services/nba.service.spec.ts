import { NBAPlayer } from '@balldontlie/sdk'
import { nbaService } from './nba.service'

describe('nbaService', () => {
  describe('countPlayersPerDraftRound tests', () => {
    const players: NBAPlayer[] = [
      { id: 1, first_name: 'Frodo', last_name: 'Baggins', position: 'Ringbearer', draft_round: null },
      { id: 1, first_name: 'Gandalf', last_name: 'The Grey', position: 'Guide', draft_round: 1 },
      {
        id: 1,
        first_name: 'Aragorn',
        position: 'Sword',
        draft_round: 1,
      },
      {
        id: 1,
        first_name: 'Legolas',
        position: 'Bow',
        draft_round: 1,
      },
      {
        id: 1,
        first_name: 'Gimli',
        position: 'Axe',
        draft_round: 1,
      },
      {
        id: 1,
        first_name: 'Boromir',
        /* Gondor will see it done */
        position: 'Supervisor',
        draft_round: 2,
      },
      {
        id: 1,
        first_name: 'Samwise',
        last_name: 'Gamgee',
        position: 'Hero',
        draft_round: 3,
      },
      {
        id: 1,
        first_name: 'Meriadoc',
        last_name: 'Brandybuck',
        position: 'Intelligence',
        draft_round: 3,
      },
      {
        id: 1,
        first_name: 'Peregrin',
        last_name: 'Took',
        /* You need people of intelligence on this sort of mission. Quest. Thing. */
        position: 'Intelligence',
        draft_round: 3,
      },
    ] as NBAPlayer[]

    it('counts players per draft round', () => {
      //@ts-ignore // countPlayersPerDraftRound is private
      const result = nbaService.countPlayersPerDraftRound(players)

      expect(result).toEqual({
        null: 1,
        '1': 4,
        '2': 1,
        '3': 3,
      })
    })
  })
})
