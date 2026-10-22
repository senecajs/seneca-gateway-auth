# Changes

## 2.0.0 2026-10-22

* Seneca 4 support. Seneca 4.0.0 validates with
  [shape](https://github.com/rjrodger/shape), the renamed successor of
  Gubu, and rejects option defaults built with Gubu, so 1.1.0 stops the
  process at startup there (`plugin_gubu_shape`). `defaults` is now a
  function of `{ valid }`, the builders Seneca passes to it: shape on
  Seneca 4, Gubu on Seneca 3. The options are unchanged.
* The gubu import is removed. gubu was never a declared dependency; it
  was available only through Seneca's own dependency on it. The type
  declarations no longer refer to it.
* Breaking: Seneca 3 support starts at 3.38. The peer range is
  `>=3.38||>=4.0.0-rc5` (was `>=3||>=4.0.0-rc2`).
* Breaking: the entity plugin peer is `@seneca/entity` `>=29` (was
  `seneca-entity` `>=26`); the entity plugin is published as
  `@seneca/entity` from 29.0.0.
* The tests run against Seneca 4.0.0, 4.0.0-rc5 (the development
  dependency, `^4.0.0-rc5`) and 3.38 (with seneca-promisify), and check
  the resolved `spec` options and the gateway hooks an active spec adds.
  `.npmrc` sets `legacy-peer-deps` while published test dependencies
  exclude the Seneca 4 prerelease from their peer range.
