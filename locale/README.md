# Locale

## The core idea

Registers a string in multiple locales

```js
translator.add({
  id: 'company.hello_user',
  locale: {
    'en-US': 'Hello {0}',
    'sv-SE': 'Hej {0}',
  },
});
translator.get('company.hello_user', ['John']); // Hello John
```

## Command

Generate all.json

```sh
yarn  locale:generate
```

verify locale

```sh
yarn locale:verify
```


## Locale specific strings

The English resource (string) container [en.json](./locales/en.json) on `main` branch is monitored for changes. All modifications will automatically be picked up and propagated to the other locale files by the Globalization Services team at Qlik at regular intervals (normally at least twice a week).

## Pull requests touching English string resources

Please request a review from a technical writer on all PRs touching English string resources, to ensure changes are consistent with style guides and translatability requirements.
The primary contact is the technical writer assigned to a HLP (documentation) task on the related PS (product scenario). If unsure, please ask in [slack: #content-and-media](https://qlikdev.slack.com/archives/C05642TAY)

**Important**

Any changes to **non-English files** will be overwritten on next translation delivery. If you need to modify the non-English strings for any reason, please contact Qlik Globalization Services via [slack: #globalization](https://qlikdev.slack.com/archives/C053CAF3Y) or [@qlik-oss/globalization](https://github.com/orgs/qlik-oss/teams/globalization).