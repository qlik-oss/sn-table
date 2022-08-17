# Contribution Guiding

## Developing

1. Install dependencies with `yarn`
1. Transpile code with `yarn build` (or `yarn build:watch`)
1. Run it using nebula development server with `yarn start`
   - The development server needs to connect to and communicate with the Qlik Associative Engine running within any of Qlik's product offerings.
   - For the Saas Edition of Qlik Sense, you can add your webIntegrationId and pointing the engine URL to your tenant following [Nebula serve configuration file](https://qlik.dev/libraries-and-tools/nebulajs/nebula-serve#configuration-file) or the introduction page of `http://localhost:8000` when you run the development server.
1. Or, Upload the /dist folder as an extension on [Qlik Sense Enterprise for Windows](https://help.qlik.com/en-US/sense-developer/November2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm) or [Qlik Sense SaaS](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm)

## API spec generating and verification

Run API spec generating and verification with:

    yarn spec

It verifies the [table object properties](../src/object-properties.js) (a JSDoc file) and generates a [Scriptappy](https://github.com/qlik-oss/scriptappy) definition documentation (a API spec) from that file.

> Note: When there is any change for the [API spec](../api-specifications/properties.json), DO NOT commit the file. The change will be merged into the main branch when doing the Releasing.

## Testing

### Unit test

Run unit tests with:

    yarn test:unit

### Rendering test

Run rendering tests with:

    # Install dependencies
    yarn --frozen-lockfile

    # Build nebula.js visualization
    yarn build

    chmod 777 ./test/rendering/scripts/run-rendering-test.sh
    yarn test:local:rendering

Look into [overview and guide](../test/rendering/README.md) to learn more about the rendering test

## Linting

Run lint with:

    yarn lint

## Type checking

Run type checking with:

    yarn types:check

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
