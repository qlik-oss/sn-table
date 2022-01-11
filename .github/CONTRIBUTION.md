## Developing

1. Install with `yarn`
1. Transpile code: `yarn build` (or `yarn build:watch`)
1. Link to Sense Desktop (locally on your computer):
   1. In this repo: `yarn link`
   1. In sense-client repo: `yarn link "@nebula.js/sn-kpi"`
1. Or, run it using nebula with `yarn start`

## Testing

Run unit tests with:

`yarn test:unit`

## Linting

Run lint with:

`yarn lint`

## Publishing

Currently only admins are able to publish.

1. Check out master and run `git pull`.
1. Run `git clean -dfx && yarn` to make sure depenencies are up-to-date.
1. Run `npm version [major | minor | patch] -m "chore(release): v%s"`. Use semver string based on conventional commits since last release. Ex: `npm version patch -m "chore(release): v%s"`.
1. Run `git push && git push --tags` to push commit and tag.
1. Make sure all checks pass, then Circle CI automatically publishes to NPM.
