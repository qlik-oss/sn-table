# Guiding

## Developing

1. Install with `yarn`
1. Transpile code: `yarn build` (or `yarn build:watch`)
1. Link to Sense Desktop (locally on your computer):
   1. In this repo: `yarn link`
   1. In sense-client repo: `yarn link "@nebula.js/sn-kpi"`
1. Or, Upload the /dist folder as an extension on [Qlik Sense Enterprise for Windows](https://help.qlik.com/en-US/sense-developer/November2021/Subsystems/Extensions/Content/Sense_Extensions/Howtos/deploy-extensions.htm) or [Qlik Sense SaaS](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-extensions.htm)
1. Or, Run it using nebula dev environment with `yarn start`

## Testing

Run unit tests with:

`yarn test:unit`

Run rendering tests with:

`yarn test:rendering`

## Linting

Run lint with:

`yarn lint`

## Publishing

Currently only admins are able to publish.

1. Check out master and make sure it is up to date
2. Run `npm version [<newversion> | major | minor | patch]`
3. Verify changes in `package.json`, commit and run `git push && git push --tags`
4. Make sure all checks pass, then Circle automatically publishes to NPM.
