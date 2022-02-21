# Contribution Guiding

## Developing

1. Install with `yarn`
1. Transpile code: `yarn build` (or `yarn build:watch`)
1. Run it using nebula dev environment with `yarn start`
1. Or, Upload the /dist folder as an extension on [Qlik Sense Enterprise for Windows](https://help.qlik.com/en-US/sense-developer/November2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm) or [Qlik Sense SaaS](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm)

## Testing

Run unit tests with:

`yarn test:unit`

Run rendering tests with:

`yarn test:rendering`

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
