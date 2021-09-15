
```sh
pwd
```

sn-table/locale

```sh
yarn
yarn run build
```

the core idea:

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
