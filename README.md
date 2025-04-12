## Setup

```bash
$ yarn && yarn tsc
```

An API key for BALLDONTLIE is required to run this code. Get one [here](https://app.balldontlie.io/signup).

Once you have an API key, set it as an environment variable, either when running a script:

```bash
$ BALL_DONT_LIE_API_KEY=<your api key> yarn dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Bucks'
```

or in `src/localConfig.ts`:

```
process.env.BALL_DONT_LIE_API_KEY = <your api key>
```

## Usage

```bash
$ yarn dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Bucks'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5, null: 2 }

$ dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Milwaukee'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5, null: 2 }

$ dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Milwaukee Bucks'
Team Name: Milwaukee Bucks
Draft Rounds: { '1': 18, '2': 5, null: 2 }
```

## Errors

```bash
$ yarn dbin src/bin/get-draft-round-breakdown-for-team.ts --team='Bukcs'
ERROR team name Bukcs matched 0 teams
```

## Testing

#### To run all tests:

```bash
$ yarn test
```

#### To run a single test

```bash
$ yarn run-test <test name>
```

This will not exit but will instead watch for compile changes; run with:

```bash
$ yarn tsc -w
```

to have test re-run on hot reload.
