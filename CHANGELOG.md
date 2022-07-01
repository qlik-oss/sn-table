# [1.14.0](https://github.com/qlik-oss/sn-table/compare/v1.13.0...v1.14.0) (2022-07-01)

### Bug Fixes

- clicking the header cell does not always sets the focus ([#562](https://github.com/qlik-oss/sn-table/issues/562)) ([25e0681](https://github.com/qlik-oss/sn-table/commit/25e0681fdec6c82f8b1c041ea1902c93fc8583c5))
- column styling updates immediately when color expression changes ([#571](https://github.com/qlik-oss/sn-table/issues/571)) ([d5c34f7](https://github.com/qlik-oss/sn-table/commit/d5c34f7616381907cb950a44a4469a29e132a894))
- next page command and block header with focus in selections ([#556](https://github.com/qlik-oss/sn-table/issues/556)) ([cd71437](https://github.com/qlik-oss/sn-table/commit/cd71437ad53c833083a3c55c319459efaf7a80d2))
- pass isInSelectionMode explicitly ([#567](https://github.com/qlik-oss/sn-table/issues/567)) ([c7348c8](https://github.com/qlik-oss/sn-table/commit/c7348c8035ceec7034f8723983b5700918a2b592))
- pressing esc in selection mode blurs everything ([#583](https://github.com/qlik-oss/sn-table/issues/583)) ([e76ae70](https://github.com/qlik-oss/sn-table/commit/e76ae707f5c5246219bbcba1b4f1350a4fb5e086))
- remove strict mode ([#565](https://github.com/qlik-oss/sn-table/issues/565)) ([2c985ae](https://github.com/qlik-oss/sn-table/commit/2c985aed971985d97d82dd6ec180ffbd9debe7bc))
- screen reader does not announce correctly when doing selections ([#566](https://github.com/qlik-oss/sn-table/issues/566)) ([a114b98](https://github.com/qlik-oss/sn-table/commit/a114b980397d265192f8734970c7e891178fd20a))

### Features

- add totals function to sn-table ([#536](https://github.com/qlik-oss/sn-table/issues/536)) ([24ace75](https://github.com/qlik-oss/sn-table/commit/24ace752c66888c386411c350e0b816f448847e7))
- shift + arrow up/down to select multiple values ([#555](https://github.com/qlik-oss/sn-table/issues/555)) ([cb6f05d](https://github.com/qlik-oss/sn-table/commit/cb6f05dec531a218f2d889cb3efd28d51044a566))

### Performance Improvements

- call handleHorizontalScroll when scroll horizontally not vertically on the table ([#563](https://github.com/qlik-oss/sn-table/issues/563)) ([387d904](https://github.com/qlik-oss/sn-table/commit/387d904dbd89d586f972d9e842a11639a4a636c9))

### Reverts

- Revert "chore(deps): update minor and patch (#579)" (#590) ([1bfa798](https://github.com/qlik-oss/sn-table/commit/1bfa798338b9d1a79cc336e6dcb8e2c35419792d)), closes [#579](https://github.com/qlik-oss/sn-table/issues/579) [#590](https://github.com/qlik-oss/sn-table/issues/590) [#579](https://github.com/qlik-oss/sn-table/issues/579)

# [1.13.0](https://github.com/qlik-oss/sn-table/compare/v1.12.6...v1.13.0) (2022-06-09)

### Features

- when a dimension is locked, disable selections on that dimension ([#549](https://github.com/qlik-oss/sn-table/issues/549)) ([92a6ae4](https://github.com/qlik-oss/sn-table/commit/92a6ae4fa39a5a1a742ff9168c3e48cf0f45fbd5))
- increase the max amount of dimensions/measures to 1000 ([#502](https://github.com/qlik-oss/sn-table/issues/502)) ([da33b39](https://github.com/qlik-oss/sn-table/commit/da33b39e5b40e7ba06ae526160d4a4009b40a078))

## [1.12.6](https://github.com/qlik-oss/sn-table/compare/v1.12.5...v1.12.6) (2022-06-07)

### Bug Fixes

- check if table is inside object/sheet when getting computed styles ([#545](https://github.com/qlik-oss/sn-table/issues/545)) ([37ece83](https://github.com/qlik-oss/sn-table/commit/37ece833125742f3073f5e4f6206f085784209ed))

## [1.12.5](https://github.com/qlik-oss/sn-table/compare/v1.12.4...v1.12.5) (2022-05-30)

### Bug Fixes

- received false for a non-boolean attribute title ([#540](https://github.com/qlik-oss/sn-table/issues/540)) ([ce6c49b](https://github.com/qlik-oss/sn-table/commit/ce6c49b8745bba1d632ee7bd653fa49a50731885))

## [1.12.4](https://github.com/qlik-oss/sn-table/compare/v1.12.3...v1.12.4) (2022-05-26)

### Performance Improvements

- introduce `useContextSelector` to only update UI parts that changes ([#527](https://github.com/qlik-oss/sn-table/issues/527)) ([29675df](https://github.com/qlik-oss/sn-table/commit/29675df17e9268c35ce0753a42969547789b46a8))

## [1.12.3](https://github.com/qlik-oss/sn-table/compare/v1.12.2...v1.12.3) (2022-05-24)

## [1.12.2](https://github.com/qlik-oss/sn-table/compare/v1.12.1...v1.12.2) (2022-05-23)

### Bug Fixes

- avoid conflicts when using multiple roots on the same page ([#530](https://github.com/qlik-oss/sn-table/issues/530)) ([1e5c6fc](https://github.com/qlik-oss/sn-table/commit/1e5c6fc8da6402378548489840ac303c4a963a49))
- background color from theme with opacity ([#517](https://github.com/qlik-oss/sn-table/issues/517)) ([d39fceb](https://github.com/qlik-oss/sn-table/commit/d39fcebe500cf806adb7030b6bb6ec29afcdc93c))
- remove a mounted React component from the DOM ([#525](https://github.com/qlik-oss/sn-table/issues/525)) ([834b5e6](https://github.com/qlik-oss/sn-table/commit/834b5e6fde955d694dbee9b2d12edd5f27b8790a))
- sx for table row in table body ([#520](https://github.com/qlik-oss/sn-table/issues/520)) ([aa2dd81](https://github.com/qlik-oss/sn-table/commit/aa2dd81079ab09a627219dac0f22582ec055318d))
- undefined keys for select page ([#519](https://github.com/qlik-oss/sn-table/issues/519)) ([5262a9d](https://github.com/qlik-oss/sn-table/commit/5262a9d7d316ded2a1a8f561df58363cecfe9516))
- unmount react root ([#531](https://github.com/qlik-oss/sn-table/issues/531)) ([5df9bec](https://github.com/qlik-oss/sn-table/commit/5df9bec1b204b22c92a551e34b76032988975e06))
- use CreateRoot ([#523](https://github.com/qlik-oss/sn-table/issues/523)) ([337d650](https://github.com/qlik-oss/sn-table/commit/337d6509448669431d28d79c38a14dba0a6a7f17))

## [1.12.1](https://github.com/qlik-oss/sn-table/compare/v1.12.0...v1.12.1) (2022-05-05)

### Bug Fixes

- check is color set ([#514](https://github.com/qlik-oss/sn-table/issues/514)) ([a519aab](https://github.com/qlik-oss/sn-table/commit/a519aab3f0de02e31506622c1fdce2695300bc15))
- table wrapper height ([#513](https://github.com/qlik-oss/sn-table/issues/513)) ([5c6452d](https://github.com/qlik-oss/sn-table/commit/5c6452d238d39cbaf08ef78bad0cabf251a5e2e7))

# [1.12.0](https://github.com/qlik-oss/sn-table/compare/v1.11.0...v1.12.0) (2022-05-04)

### Features

- apply theme from sense ([#442](https://github.com/qlik-oss/sn-table/issues/442)) ([0224ab9](https://github.com/qlik-oss/sn-table/commit/0224ab9e9e1c82d23d730bfc76adedb1648e61ae)), closes [#446](https://github.com/qlik-oss/sn-table/issues/446) [#451](https://github.com/qlik-oss/sn-table/issues/451) [#455](https://github.com/qlik-oss/sn-table/issues/455) [#457](https://github.com/qlik-oss/sn-table/issues/457) [#459](https://github.com/qlik-oss/sn-table/issues/459) [#453](https://github.com/qlik-oss/sn-table/issues/453) [#451](https://github.com/qlik-oss/sn-table/issues/451) [#455](https://github.com/qlik-oss/sn-table/issues/455) [#457](https://github.com/qlik-oss/sn-table/issues/457) [#459](https://github.com/qlik-oss/sn-table/issues/459)

### Reverts

- Revert "chore(release): v1.12.0" ([6666f6b](https://github.com/qlik-oss/sn-table/commit/6666f6bb50271f4e413b892761292da5a1bfa33a))

# [1.11.0](https://github.com/qlik-oss/sn-table/compare/v1.10.0...v1.11.0) (2022-04-26)

### Bug Fixes

- **chore:** sync the playwright version between installed package and script files ([#501](https://github.com/qlik-oss/sn-table/issues/501)) ([95072fb](https://github.com/qlik-oss/sn-table/commit/95072fb8e02f2d9f893d10f3c19742069c7719f1))

### Features

- introduce react-native-sn-table ([#447](https://github.com/qlik-oss/sn-table/issues/447)) ([95ed544](https://github.com/qlik-oss/sn-table/commit/95ed5443e9141ff00b8d6797ca05319b2bb4732b))

# [1.10.0](https://github.com/qlik-oss/sn-table/compare/v1.9.1...v1.10.0) (2022-04-04)

### Features

- handle passive and select constraints ([#481](https://github.com/qlik-oss/sn-table/issues/481)) ([ef20090](https://github.com/qlik-oss/sn-table/commit/ef20090d31e343590f97aa48b03ea19f3b41e6be))

### Reverts

- Revert "chore(release): v1.10.0" ([68bbaee](https://github.com/qlik-oss/sn-table/commit/68bbaee4df793cd9dc7ef19e322c504f0571654d))

## [1.9.1](https://github.com/qlik-oss/sn-table/compare/v1.9.0...v1.9.1) (2022-04-04)

### Reverts

- Revert "chore(release): v1.9.1" ([654efdb](https://github.com/qlik-oss/sn-table/commit/654efdb841f25d2ae80d473f06b37f61a104573c))
- Revert "chore(release): v1.9.1" ([ec84cdf](https://github.com/qlik-oss/sn-table/commit/ec84cdffcc0b39f76b5348c099776385886383a8))

# [1.9.0](https://github.com/qlik-oss/sn-table/compare/v1.8.0...v1.9.0) (2022-03-25)

# [1.8.0](https://github.com/qlik-oss/sn-table/compare/v1.7.1...v1.8.0) (2022-03-24)

### Features

- auto hide pagination when it is not necessary ([#482](https://github.com/qlik-oss/sn-table/issues/482)) ([6562717](https://github.com/qlik-oss/sn-table/commit/6562717d5f7706be0d9555c454e5291011ed7dc4))

## [1.7.1](https://github.com/qlik-oss/sn-table/compare/v1.7.0...v1.7.1) (2022-03-15)

### Bug Fixes

- the case at the end of a horizontal scroll ([#477](https://github.com/qlik-oss/sn-table/issues/477)) ([8018a7d](https://github.com/qlik-oss/sn-table/commit/8018a7de62f24590826066cdd11495b3343b467c))

# [1.7.0](https://github.com/qlik-oss/sn-table/compare/v1.6.0...v1.7.0) (2022-03-07)

### Features

- Add option to render pagination content inside specified element. ([#456](https://github.com/qlik-oss/sn-table/issues/456)) ([88d3c04](https://github.com/qlik-oss/sn-table/commit/88d3c0456e30dc5edb9274ba1680cc8c039dcf36))

# [1.6.0](https://github.com/qlik-oss/sn-table/compare/v1.5.0...v1.6.0) (2022-03-02)

# [1.5.0](https://github.com/qlik-oss/sn-table/compare/v1.4.2...v1.5.0) (2022-02-28)

### Features

- add mashup examples of QCS and QSEoW for demo ([#437](https://github.com/qlik-oss/sn-table/issues/437)) ([13eabb6](https://github.com/qlik-oss/sn-table/commit/13eabb66070277fadacb2b906bf05b1d513f6c47)), closes [#445](https://github.com/qlik-oss/sn-table/issues/445)

## [1.4.2](https://github.com/qlik-oss/sn-table/compare/v1.4.1...v1.4.2) (2022-02-03)

## [1.4.1](https://github.com/qlik-oss/sn-table/compare/v1.4.0...v1.4.1) (2022-01-25)

### Bug Fixes

- unable to scroll horizontally in right-to-left direction ([#427](https://github.com/qlik-oss/sn-table/issues/427)) ([532e469](https://github.com/qlik-oss/sn-table/commit/532e4696cc3bb018ec6e19d62e4d3b4cd676e5cf))

# [1.4.0](https://github.com/qlik-oss/sn-table/compare/v1.3.2...v1.4.0) (2022-01-20)

### Features

- support right-to-left reading order ([#416](https://github.com/qlik-oss/sn-table/issues/416)) ([d3229fe](https://github.com/qlik-oss/sn-table/commit/d3229feec81bbf9256037e2688a1d55cf362ddd4))

## [1.3.2](https://github.com/qlik-oss/sn-table/compare/v1.3.1...v1.3.2) (2021-12-15)

### Bug Fixes

- use sort order from properties when sorting ([#410](https://github.com/qlik-oss/sn-table/issues/410)) ([e0e414b](https://github.com/qlik-oss/sn-table/commit/e0e414b54525a805d2c1814b57d2d1d1b8843347))

### Features

- make rendering testing work with enigma-mocker and test fixtures ([#376](https://github.com/qlik-oss/sn-table/issues/376)) ([b613a44](https://github.com/qlik-oss/sn-table/commit/b613a44e4044835c814c69d63b677ce12abcbf8e))

## [1.3.1](https://github.com/qlik-oss/sn-table/compare/v1.3.0...v1.3.1) (2021-12-08)

### Features

- add navigation instructions for SR ([#401](https://github.com/qlik-oss/sn-table/issues/401)) ([cec6214](https://github.com/qlik-oss/sn-table/commit/cec62144ddd8396fb86903ce9a0e8ce165182f79))
- **translations:** UI bus - 2021-12-03 ([#409](https://github.com/qlik-oss/sn-table/issues/409)) ([c785b4b](https://github.com/qlik-oss/sn-table/commit/c785b4b479ece0eda15fd9b72773b15dc81f036b))

# [1.3.0](https://github.com/qlik-oss/sn-table/compare/v1.2.0...v1.3.0) (2021-11-30)

### Bug Fixes

- **a11y:** A label must be associated with a control ([#344](https://github.com/qlik-oss/sn-table/issues/344)) ([321b189](https://github.com/qlik-oss/sn-table/commit/321b18921d8207ac9f7f72c9fcadb0e97dcd61e1))
- add missing key to check if translated string is different from its id ([#378](https://github.com/qlik-oss/sn-table/issues/378)) ([5eb4abf](https://github.com/qlik-oss/sn-table/commit/5eb4abf0438b95069ff6e02bc034c227b23896c9))
- add title to buttons ([3862bee](https://github.com/qlik-oss/sn-table/commit/3862beebe2d70930c36ada3f4aadf120924b504b))
- add translation string and fix styling ([da5aa75](https://github.com/qlik-oss/sn-table/commit/da5aa753510f4b7bc7b46fe72345ba3ff4415fb3))
- add unit tests ([34d1691](https://github.com/qlik-oss/sn-table/commit/34d169175dfeaf9be3819915cd44901fbc66f9eb))
- break out onFistPage/onLastPage booleans ([aee5ad3](https://github.com/qlik-oss/sn-table/commit/aee5ad32e24c3d9b89760a4992f984092f32f913))
- change dropdown labels to page numbers ([840edf9](https://github.com/qlik-oss/sn-table/commit/840edf9c2aff1b8d9323d88729fc023086dd558c))
- class names are regenerated for each new render ([#359](https://github.com/qlik-oss/sn-table/issues/359)) ([b73c00b](https://github.com/qlik-oss/sn-table/commit/b73c00b40b5282055e3430896544e4c7f2886251))
- comments ([3df134b](https://github.com/qlik-oss/sn-table/commit/3df134ba1e79a4a58d2f919711e83aec4866d3c5))
- comments ([f89ec99](https://github.com/qlik-oss/sn-table/commit/f89ec995ce41fa2d661a9cfec4d73cd12a0fc286))
- green text in client ([155330f](https://github.com/qlik-oss/sn-table/commit/155330f595fddf0b6652d9c5792e9858fd45b9ac))
- lint ([fe4a2af](https://github.com/qlik-oss/sn-table/commit/fe4a2af839f27d758952446304b2a825792ac969))
- lint does not work ([#305](https://github.com/qlik-oss/sn-table/issues/305)) ([262a151](https://github.com/qlik-oss/sn-table/commit/262a1517e08043bcd116cc6ed05bb92acdad5ff8))
- make sure focus works as intended with keyboardNavigation = false ([#345](https://github.com/qlik-oss/sn-table/issues/345)) ([2175f9c](https://github.com/qlik-oss/sn-table/commit/2175f9c0b485882b7a8e0bb70aa4c95547f72fef))
- make sure page for getHyperCubeData is never more than 10k cells ([#406](https://github.com/qlik-oss/sn-table/issues/406)) ([8ac7e8f](https://github.com/qlik-oss/sn-table/commit/8ac7e8f59d87b8fac5d778a6c54ce6340d306ded))
- make sure page is an int ([09aac2b](https://github.com/qlik-oss/sn-table/commit/09aac2b493ba47f0e8933ee33d123533320a8bb6))
- merge mistake ([daa5954](https://github.com/qlik-oss/sn-table/commit/daa595458cd78fbe9faf6bcb65f5d8ae6386bbe5))
- move generateClassName into StylesProvider ([#362](https://github.com/qlik-oss/sn-table/issues/362)) ([174c009](https://github.com/qlik-oss/sn-table/commit/174c009857a5513e09097b77b4bb733770e9a373))
- move material ui icons to devDependencies ([98abcc8](https://github.com/qlik-oss/sn-table/commit/98abcc839b178cd7e54840d684535884fc56e7b6))
- move pagination actions to separate file ([e5c6dde](https://github.com/qlik-oss/sn-table/commit/e5c6dde4f62d1310c4ded057ebdfa04030032376))
- mui table background color and pagination actions button color in dark mode ([#361](https://github.com/qlik-oss/sn-table/issues/361)) ([ae38249](https://github.com/qlik-oss/sn-table/commit/ae38249fe67949eda7f3bf168baa9f17c24096c7))
- onClick functions ([5e7c0f5](https://github.com/qlik-oss/sn-table/commit/5e7c0f5eeff1d04013d6d73f9e1ff8ce3e3fbd6b))
- optimize styling for use inside of sense ([85ba18a](https://github.com/qlik-oss/sn-table/commit/85ba18ac32e467920c7a028a83877ce5702130a2))
- pagination select ccolor in dark mode ([#370](https://github.com/qlik-oss/sn-table/issues/370)) ([9082c91](https://github.com/qlik-oss/sn-table/commit/9082c9129003712b88a48d66b00e7eb499820a3c))
- remove dummy functions ([5580e6f](https://github.com/qlik-oss/sn-table/commit/5580e6f03cb3fa3cc98c882a15784da87b9bac96))
- remove pagination dropdown from tabindex when not in table ([28f947a](https://github.com/qlik-oss/sn-table/commit/28f947a017d6ecd8515c147b8fd64d47b3ceee26))
- should use tabIndex ([#384](https://github.com/qlik-oss/sn-table/issues/384)) ([a9e2c3e](https://github.com/qlik-oss/sn-table/commit/a9e2c3e3039ea144c4e87b810a5e30cf7e89e06e))
- small issues from merging ([27a11d5](https://github.com/qlik-oss/sn-table/commit/27a11d59f07523c207ad85065e4147e783f7d00e))
- sort label color ([#360](https://github.com/qlik-oss/sn-table/issues/360)) ([612799f](https://github.com/qlik-oss/sn-table/commit/612799f336c2f2a0de23ec910f7d9da280f150d4))
- styling after merge and React warnings ([cbab460](https://github.com/qlik-oss/sn-table/commit/cbab460d4558d2634778b49d1e49201c3d635192))
- the sorted indication arrow is pointing the wrong direction ([#354](https://github.com/qlik-oss/sn-table/issues/354)) ([33c5d22](https://github.com/qlik-oss/sn-table/commit/33c5d22bba75517896b1fa178d6527e5c91fb738))
- the type of value supplied to tabIndex is wrong ([#390](https://github.com/qlik-oss/sn-table/issues/390)) ([8feeefa](https://github.com/qlik-oss/sn-table/commit/8feeefabe409f1ee42e98c5bbe6a8bc74f1528b4))
- use tableWidth ([ffeba04](https://github.com/qlik-oss/sn-table/commit/ffeba04ff066ea1574846cc8bc377ca24f2ccc0c))

### Features

- add custom pagination and first and last buttons ([6c5ebfd](https://github.com/qlik-oss/sn-table/commit/6c5ebfd865238f9d4147580f08eed839d798c301))
- add react hook ESLint rule ([#388](https://github.com/qlik-oss/sn-table/issues/388)) ([00dd7a4](https://github.com/qlik-oss/sn-table/commit/00dd7a45d3f9c2dda9cfffd1720b719b7a66928c))
- select page dropdown ([9320fd2](https://github.com/qlik-oss/sn-table/commit/9320fd2e85d9caedd6253c77e478f0d987900488))
- set focus on nebula selection toolbar when tabbing ([#369](https://github.com/qlik-oss/sn-table/issues/369)) ([573e1d6](https://github.com/qlik-oss/sn-table/commit/573e1d6709354152775d0258ea178148132444f2))
- sync version between package.json and api-spec version ([#399](https://github.com/qlik-oss/sn-table/issues/399)) ([a4b9b83](https://github.com/qlik-oss/sn-table/commit/a4b9b8399f040ee2eef5d80e1d1faac91845f825))
- **translations:** UI bus - 2021-11-02 ([#380](https://github.com/qlik-oss/sn-table/issues/380)) ([071f820](https://github.com/qlik-oss/sn-table/commit/071f8202db994443762c5a1bf5ad4d4aee23f2e6))

### Reverts

- Revert "1.3.0" ([4ddf2f4](https://github.com/qlik-oss/sn-table/commit/4ddf2f4d11de3760ab80a3af28474a4171160d2a))
- Revert "fix: pagination select ccolor in dark mode" ([a278b1a](https://github.com/qlik-oss/sn-table/commit/a278b1a4483affba52f4918119e555584d75a358))

# [1.2.0](https://github.com/qlik-oss/sn-table/compare/v1.1.1...v1.2.0) (2021-10-12)

### Bug Fixes

- **translations:** bugfixes - RDL-5173 - Bug Fix ([#335](https://github.com/qlik-oss/sn-table/issues/335)) ([d1d5e1e](https://github.com/qlik-oss/sn-table/commit/d1d5e1e8501869e3b363735d12ab2cf4e303c285))

### Features

- **translations:** UI bus - 2021-10-08 ([#336](https://github.com/qlik-oss/sn-table/issues/336)) ([91c4e5d](https://github.com/qlik-oss/sn-table/commit/91c4e5d80f252cc5654c7d87d3302a058e7dd18b)), closes [#303](https://github.com/qlik-oss/sn-table/issues/303)

### Reverts

- Revert "fix(translations): bugfixes - RDL-5173 - Bug Fix (#335)" (#337) ([c9c57c6](https://github.com/qlik-oss/sn-table/commit/c9c57c6183a9ac5c30e92b77179345550584f557)), closes [#335](https://github.com/qlik-oss/sn-table/issues/335) [#337](https://github.com/qlik-oss/sn-table/issues/337)

## [1.1.1](https://github.com/qlik-oss/sn-table/compare/v1.1.0...v1.1.1) (2021-10-10)

# [1.1.0](https://github.com/qlik-oss/sn-table/compare/v1.1.0-beta.3...v1.1.0) (2021-10-10)

### Bug Fixes

- disabled button should be able to be focusable for accessility purpose ([#313](https://github.com/qlik-oss/sn-table/issues/313)) ([82881b9](https://github.com/qlik-oss/sn-table/commit/82881b93e8db30e5d71563ff90a6749b5296d4c4))
- table loses focus in an embedded sheet after pressing ctrl+shift+left or right arrow to change page ([#327](https://github.com/qlik-oss/sn-table/issues/327)) ([d841e77](https://github.com/qlik-oss/sn-table/commit/d841e770ba34850c883443ec84ef960d0606b7ee))
- using the clear selection button in selection toolbar does not update the table properly ([#317](https://github.com/qlik-oss/sn-table/issues/317)) ([5771574](https://github.com/qlik-oss/sn-table/commit/577157452f5f8956d60759b7eb2423d2bb544591))

### Features

- add translated strings in TablePaginationActions ([#312](https://github.com/qlik-oss/sn-table/issues/312)) ([b72e914](https://github.com/qlik-oss/sn-table/commit/b72e914a51c67f132500bc93dcdd06fec2dc15af))
- bottom toolbar in table should be responsive ([#311](https://github.com/qlik-oss/sn-table/issues/311)) ([7bb22da](https://github.com/qlik-oss/sn-table/commit/7bb22da9ae24b3251451ee9fc92add42de58b078))
- focus in and out of selection toolbar ([#319](https://github.com/qlik-oss/sn-table/issues/319)) ([481b97a](https://github.com/qlik-oss/sn-table/commit/481b97af19fadfcb85dbaeb59f8a826db74b2301))

# [1.1.0-beta.3](https://github.com/qlik-oss/sn-table/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2021-10-06)

### Bug Fixes

- bottom toolbar in table should be responsive ([#293](https://github.com/qlik-oss/sn-table/issues/293)) ([78648e3](https://github.com/qlik-oss/sn-table/commit/78648e37cdc2fea33ad42e986da3291e0355db0b))

### Features

- add to be translated strings for DisplayedRowsLabel in Pagination ([#303](https://github.com/qlik-oss/sn-table/issues/303)) ([54586b7](https://github.com/qlik-oss/sn-table/commit/54586b7e5e3ec06dd34996847cde2ba32ca98c3f))
- handle focusing one rows per page and next/prev page ([#300](https://github.com/qlik-oss/sn-table/issues/300)) ([fd2c66e](https://github.com/qlik-oss/sn-table/commit/fd2c66ed3d613cdf6fc07cd31377d83e13b57ee2))
- **translation:** all possible to be translated strings ([#281](https://github.com/qlik-oss/sn-table/issues/281)) ([d3dd750](https://github.com/qlik-oss/sn-table/commit/d3dd750a0b26c5664054bca1a1268bafb1fba9d7))
- **translations:** UI bus - 2021-10-01 ([#306](https://github.com/qlik-oss/sn-table/issues/306)) ([baed6f0](https://github.com/qlik-oss/sn-table/commit/baed6f08d39b03cf9350ba1b97d3a39b92343395)), closes [#263](https://github.com/qlik-oss/sn-table/issues/263) [#281](https://github.com/qlik-oss/sn-table/issues/281)

# [1.1.0-beta.2](https://github.com/qlik-oss/sn-table/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2021-09-30)

### Features

- add custom pagination and first and last buttons ([#252](https://github.com/qlik-oss/sn-table/issues/252)) ([8cc1bb1](https://github.com/qlik-oss/sn-table/commit/8cc1bb1f75886ae3f9eabf015261bc8bdabbef0d))

# [1.1.0-beta.1](https://github.com/qlik-oss/sn-table/compare/v1.0.3...v1.1.0-beta.1) (2021-09-29)

### Bug Fixes

- add scope row to cells in first column ([#220](https://github.com/qlik-oss/sn-table/issues/220)) ([e8b9fbe](https://github.com/qlik-oss/sn-table/commit/e8b9fbeae5b10afbdc519fe56f7710e50777d5df))
- add th to first column ([#257](https://github.com/qlik-oss/sn-table/issues/257)) ([a127010](https://github.com/qlik-oss/sn-table/commit/a1270108be1fdcf48fbdf3b6c3595c7e99d0d0ea))
- avoid numbers at start of class ([3de03b4](https://github.com/qlik-oss/sn-table/commit/3de03b42b5187bf9281e638c5f3dcd15f554f103))
- columns use client side property for identification ([#228](https://github.com/qlik-oss/sn-table/issues/228)) ([716f8e9](https://github.com/qlik-oss/sn-table/commit/716f8e9dd70015ec22c6e9589e70871642f0810a))
- th column styling ([a03ee4c](https://github.com/qlik-oss/sn-table/commit/a03ee4cabf5bb33e305595759a971c8e4de8d397))
- variable name confusion ([#258](https://github.com/qlik-oss/sn-table/issues/258)) ([0196345](https://github.com/qlik-oss/sn-table/commit/01963453133b20bb34314d57675dc39d1766f7ff))

### Features

- **a11y:** the screen reader should always says the column name first and then the row content ([#230](https://github.com/qlik-oss/sn-table/issues/230)) ([ff0ce64](https://github.com/qlik-oss/sn-table/commit/ff0ce64b4a139f47ca68a711dbaae11732ade403))
- include sprout as json ([#251](https://github.com/qlik-oss/sn-table/issues/251)) ([d30fd4f](https://github.com/qlik-oss/sn-table/commit/d30fd4ff2eee2495fec90f2a2c8c7bc7ea1e31b7))
- **locale:** add localization ([#263](https://github.com/qlik-oss/sn-table/issues/263)) ([985f638](https://github.com/qlik-oss/sn-table/commit/985f638cccafb5c04b5bd118c9fe7434f5a9a177)), closes [#277](https://github.com/qlik-oss/sn-table/issues/277)
- use nebulas keyboard hook to proberly focus in and out of table ([#256](https://github.com/qlik-oss/sn-table/issues/256)) ([0c2a5b8](https://github.com/qlik-oss/sn-table/commit/0c2a5b8b3548b96e7c6bc1fd48810c11a09d3438))

### Reverts

- Revert "chore(deps): bump nebula version" ([ddb84b7](https://github.com/qlik-oss/sn-table/commit/ddb84b7ca2482b5361f3ae0daf1eea12098b2759))

## [1.0.3](https://github.com/qlik-oss/sn-table/compare/v1.0.2...v1.0.3) (2021-05-31)

### Bug Fixes

- columns can be sorted, but this is not indicated to screen reader users ([#219](https://github.com/qlik-oss/sn-table/issues/219)) ([67457fc](https://github.com/qlik-oss/sn-table/commit/67457fcd47fd3f6a83698c94344b3d3e535c4af7))
- rows per page drop down is inaccessible ([#218](https://github.com/qlik-oss/sn-table/issues/218)) ([65f1284](https://github.com/qlik-oss/sn-table/commit/65f1284c542e4f6568c32b7cc46a5c58ded3d04f))

## [1.0.2](https://github.com/qlik-oss/sn-table/compare/v1.0.1...v1.0.2) (2021-05-25)

## [1.0.1](https://github.com/qlik-oss/sn-table/compare/v1.0.0...v1.0.1) (2021-05-10)

# [1.0.0](https://github.com/qlik-oss/sn-table/compare/v0.2.5...v1.0.0) (2021-05-07)

## [0.2.5](https://github.com/qlik-oss/sn-table/compare/v0.2.4...v0.2.5) (2021-05-07)

### Bug Fixes

- revert header fix ([#205](https://github.com/qlik-oss/sn-table/issues/205)) ([7440227](https://github.com/qlik-oss/sn-table/commit/7440227c7b6b3d0eafa3c8161455f6bdeed7d7dd))

## [0.2.4](https://github.com/qlik-oss/sn-table/compare/v0.2.3...v0.2.4) (2021-05-06)

## [0.2.3](https://github.com/qlik-oss/sn-table/compare/v0.2.2...v0.2.3) (2021-05-04)

### Bug Fixes

- add missing unit testing ([#191](https://github.com/qlik-oss/sn-table/issues/191)) ([f07b4b6](https://github.com/qlik-oss/sn-table/commit/f07b4b652403f732b400c104a8eae65756e9161d))
- focus head styling ([fe2e66a](https://github.com/qlik-oss/sn-table/commit/fe2e66a432d2e40ba1132d5eed0341a6fd9b45f4))
- proper focus styling + refactor ([#185](https://github.com/qlik-oss/sn-table/issues/185)) ([2d4c5e5](https://github.com/qlik-oss/sn-table/commit/2d4c5e521da7c500ff5af99773475ee4511b3faa))
- put columnWidths back ([4858105](https://github.com/qlik-oss/sn-table/commit/4858105cfcdcf8a1e44dc9a99ae4532f393a1b48))
- remove total from pp ([a20ae01](https://github.com/qlik-oss/sn-table/commit/a20ae01c654989cda181810c936faaad698751c6))
- update the height of table body ([#187](https://github.com/qlik-oss/sn-table/issues/187)) ([f0f184a](https://github.com/qlik-oss/sn-table/commit/f0f184a27ae32aeda035cb1b3784d83d5f20998c))

### Features

- adding properties to pp and documentation to object-properties ([#176](https://github.com/qlik-oss/sn-table/issues/176)) ([e56548e](https://github.com/qlik-oss/sn-table/commit/e56548e1f724189312178128d8bb73f653ea2cff))
- announcing number of rows and columns when entering table ([#190](https://github.com/qlik-oss/sn-table/issues/190)) ([43c9d6c](https://github.com/qlik-oss/sn-table/commit/43c9d6c86ab0e0d35508b84d63402a8d6d2cd515))

## [0.2.2](https://github.com/qlik-oss/sn-table/compare/v0.2.1...v0.2.2) (2021-04-20)

### Bug Fixes

- handle focus correctly for confirm, changing page, changing rows per page ([#172](https://github.com/qlik-oss/sn-table/issues/172)) ([0a70a94](https://github.com/qlik-oss/sn-table/commit/0a70a94d42e4bcfe2b97aa458d13f783034b5238))
- spelling error for mui styling ([#162](https://github.com/qlik-oss/sn-table/issues/162)) ([4ebd55d](https://github.com/qlik-oss/sn-table/commit/4ebd55d7fe28556a65f675b07fd3cc66747a980a))

### Features

- inline styling to minimize style tags ([#168](https://github.com/qlik-oss/sn-table/issues/168)) ([5427cf1](https://github.com/qlik-oss/sn-table/commit/5427cf1244179a5233fb4be218fd79484a40efae))

## [0.2.1](https://github.com/qlik-oss/sn-table/compare/v0.2.0...v0.2.1) (2021-04-06)

### Bug Fixes

- Can't do the sorting if one measure is ordered before at least one dimension ([#153](https://github.com/qlik-oss/sn-table/issues/153)) ([fb9c325](https://github.com/qlik-oss/sn-table/commit/fb9c3253773f84fb0b4c3d2b57bb180afce5ac40))
- head cleanup ([#143](https://github.com/qlik-oss/sn-table/issues/143)) ([aef5861](https://github.com/qlik-oss/sn-table/commit/aef5861487ef3ba49f6deaa4cf3a3d8d3aed99a4))
- line height ([#109](https://github.com/qlik-oss/sn-table/issues/109)) ([706b927](https://github.com/qlik-oss/sn-table/commit/706b927a476c19ea0767facf140e7e7309cc477c))
- no selection on right click ([#110](https://github.com/qlik-oss/sn-table/issues/110)) ([c6f0d95](https://github.com/qlik-oss/sn-table/commit/c6f0d95940332256d4b4696c592ffa1fec525517))
- properly wait for rendering ([f9f7ed2](https://github.com/qlik-oss/sn-table/commit/f9f7ed2c6b1923b4936316d3a38cef0a9fbf509b))
- remove checkbox ([#156](https://github.com/qlik-oss/sn-table/issues/156)) ([5062cb1](https://github.com/qlik-oss/sn-table/commit/5062cb1702a174006d5b22f41ed4a574110aa0db))
- selections when one measure before one dimension ([#155](https://github.com/qlik-oss/sn-table/issues/155)) ([9afd8e1](https://github.com/qlik-oss/sn-table/commit/9afd8e1de0c6c1cc080698d81ba53b70bdd20b99))
- set inhirit on theme ([#142](https://github.com/qlik-oss/sn-table/issues/142)) ([e7b698e](https://github.com/qlik-oss/sn-table/commit/e7b698e2db5e261c9a8aa008ff1e1b649ee37f11))
- update styling when theme changes ([#145](https://github.com/qlik-oss/sn-table/issues/145)) ([ac3b0c7](https://github.com/qlik-oss/sn-table/commit/ac3b0c7c34b3300f0c5016aae8fb4bf5db742c67))

### Features

- auto font color when background is set ([#122](https://github.com/qlik-oss/sn-table/issues/122)) ([7bcb110](https://github.com/qlik-oss/sn-table/commit/7bcb1109ad4cab812a34e57b10bd802ddb9c7e90))
- change sorting by pressing enter or space ([#132](https://github.com/qlik-oss/sn-table/issues/132)) ([0a68c42](https://github.com/qlik-oss/sn-table/commit/0a68c4265503341510fdbdb7bb4df7b89de47632))
- column alignment ([#119](https://github.com/qlik-oss/sn-table/issues/119)) ([a08d9d2](https://github.com/qlik-oss/sn-table/commit/a08d9d2078501509410c66b6be42f30a4c63db70))
- column coloring ([#112](https://github.com/qlik-oss/sn-table/issues/112)) ([c28ebf3](https://github.com/qlik-oss/sn-table/commit/c28ebf3132f84525732bb7e552b7cb684c36b742))
- hide column ([#123](https://github.com/qlik-oss/sn-table/issues/123)) ([2665ab9](https://github.com/qlik-oss/sn-table/commit/2665ab994823482460deeb57ed5db053773932ce))
- sorting ([#127](https://github.com/qlik-oss/sn-table/issues/127)) ([d3ba2d7](https://github.com/qlik-oss/sn-table/commit/d3ba2d74b0930dba4e88c049a3d1ec5b424782e7))
- styling panel hover ([#100](https://github.com/qlik-oss/sn-table/issues/100)) ([dcbe629](https://github.com/qlik-oss/sn-table/commit/dcbe6298961133bf8d26c1ea73e337b17068eacb))

# [0.2.0](https://github.com/qlik-oss/sn-table/compare/v0.1.4...v0.2.0) (2021-02-23)

### Bug Fixes

- do not confirm selections when dragging scroll bar ([#79](https://github.com/qlik-oss/sn-table/issues/79)) ([6b6066b](https://github.com/qlik-oss/sn-table/commit/6b6066ba8c56fa177542b874fd217240e04d69f0))
- mui conflicts and overflow update ([#74](https://github.com/qlik-oss/sn-table/issues/74)) ([a4603e4](https://github.com/qlik-oss/sn-table/commit/a4603e4aec7a1be1662c2f16ab46cbdb6cf56ee9))
- next page button UX/UI in mobile ([#92](https://github.com/qlik-oss/sn-table/issues/92)) ([6d54f6d](https://github.com/qlik-oss/sn-table/commit/6d54f6d7c80182330f1336001ff6dbd44c6e8872))
- only confirm selections when clicking confirm or outside ([#93](https://github.com/qlik-oss/sn-table/issues/93)) ([3f60e16](https://github.com/qlik-oss/sn-table/commit/3f60e168ecde41ac07ac091f9754dd46a94c2cb0))

### Features

- add table body props ([#98](https://github.com/qlik-oss/sn-table/issues/98)) ([81a88f8](https://github.com/qlik-oss/sn-table/commit/81a88f8de237770acfdc096904d943ae89d7efa6))
- header styling ([#96](https://github.com/qlik-oss/sn-table/issues/96)) ([5a4c687](https://github.com/qlik-oss/sn-table/commit/5a4c6876057f1a32840c4c38cae1c0580938a7c9))

## [0.1.4](https://github.com/qlik-oss/sn-table/compare/v0.1.3...v0.1.4) (2021-02-04)

### Features

- disable selections in edit mode etc ([#53](https://github.com/qlik-oss/sn-table/issues/53)) ([a823adb](https://github.com/qlik-oss/sn-table/commit/a823adbbf658c2e2be5ac3551ad0962c1719257b))
- proper selection styling ([#64](https://github.com/qlik-oss/sn-table/issues/64)) ([98ac817](https://github.com/qlik-oss/sn-table/commit/98ac817df0c356d95500a97b7ecdf0f5d89b7a30))

## [0.1.3](https://github.com/qlik-oss/sn-table/compare/v0.1.3-alpha.0...v0.1.3) (2021-02-01)

### Bug Fixes

- revert exports named ([2167b2e](https://github.com/qlik-oss/sn-table/commit/2167b2e32d894b67563e7aeffcc64d133a89ec93))

### Features

- clicking outside confirms selections + refactor ([#50](https://github.com/qlik-oss/sn-table/issues/50)) ([ad9a144](https://github.com/qlik-oss/sn-table/commit/ad9a14482a1633c455ad4a84d0d5a57d876d14f7))

## [0.1.3-alpha.0](https://github.com/qlik-oss/sn-table/compare/v0.1.2...v0.1.3-alpha.0) (2021-01-26)

### Features

- enable selections with mouse click ([#38](https://github.com/qlik-oss/sn-table/issues/38)) ([ecc5e79](https://github.com/qlik-oss/sn-table/commit/ecc5e79d788cca4ad69c7d2a9fc7db7603c9c4a5))

## [0.1.2](https://github.com/qlik-oss/sn-table/compare/v0.1.1...v0.1.2) (2021-01-15)

## [0.1.1](https://github.com/qlik-oss/sn-table/compare/v0.1.0...v0.1.1) (2021-01-15)

# [0.1.0](https://github.com/qlik-oss/sn-table/compare/4135a2814bf3d56575da80e199a4ba6139a186f3...v0.1.0) (2021-01-15)

### Bug Fixes

- update rows per page correctly ([#49](https://github.com/qlik-oss/sn-table/issues/49)) ([4135a28](https://github.com/qlik-oss/sn-table/commit/4135a2814bf3d56575da80e199a4ba6139a186f3))

### Reverts

- Revert "0.1.0" ([d689f64](https://github.com/qlik-oss/sn-table/commit/d689f64116fa6e6fb0459637b2f31b9e1e051b8c))
