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
