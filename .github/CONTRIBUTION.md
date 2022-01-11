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

## Releasing

Currently only admins are able to create a release. A release consists of the following:

- Bumping the package version based on your commits
- Updating the API specification
- Creating a new commit with the changed files
- Creating a tag with the new version
- Pushing the release commit and tag to master

### Step-By-Step

1. Check out master and run `git pull`.
1. Run `git clean -dfx && yarn` to make sure depenencies are up-to-date.
1. Run `npm version [major | minor | patch] -m "chore(release): v%s"`. Use semver string based on conventional commits since last release. Ex: `npm version patch -m "chore(release): v%s"`.
1. Run `git push && git push --tags` to push commit and tag.
1. Make sure all checks pass, then Circle CI automatically publishes to NPM.

### On version command failure

If you would run `npm version` and it for some reason fails, or you would like to revert the tag you just created:

1. Run `git tag` to check if a new tag was created (or already existed).
1. If a tag was created, delete it with `git tag -d <tag>`.
