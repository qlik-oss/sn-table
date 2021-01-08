## Developing

1. Install with `yarn`
2. Transpile code: `yarn build` (or `yarn build:watch`)
3. Link to Sense Desktop (locally on your computer):

- In this repo: `yarn link`
- In sense-client repo: `yarn link "@nebula.js/sn-kpi"`

Or, render the chart in nebula: `yarn start`

## Testing

Run unit tests with:

- `yarn test:unit`

## Linting

Run lint with:

- `yarn lint`

## Publishing

Currently only admins are able to publish.

1. Check out master and make sure it is up to date
2. Run `npm version minor/patch`
3. Verify changes in `package.json`, commit and run `git push && git push --tags`
4. Make sure all checks pass, then Circle automatically publishes to NPM.
