## Setup

```bash
$ yarn && yarn tsc
```

## Usage

```bash
$ yarn dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Bucks'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5 }

$ dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Milwaukee'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5 }

$ dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Milwaukee Bucks'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5 }
```

## Errors

```bash
$ yarn dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Bukcs'
ERROR team name Bukcs matched 0 teams
```
