# Changes

## 2.0.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git
history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0` (was
  `>=3||>=4.0.0-rc2`). Seneca 3 users stay on `@seneca/gateway-auth@1`.
* Node.js 24 or later (`engines.node` `>=24`).
* The peer dependency `@seneca/gateway` is `^2.0.0` (was `>=1.3`), the
  Seneca 4 release of the gateway.
* The entity plugin peer is `@seneca/entity` `^29.0.0` (was
  `seneca-entity` `>=26`), and the user plugin peer is `@seneca/user`
  `^7.0.0` (was `>=6`). Both are now optional peers: npm no longer
  installs them with this plugin. Install them when you use them: a cookie
  spec calls `sys:user,auth:user`, which `@seneca/user` provides, and the
  REPL command `gateway-user` loads `sys/user` entities.
* The peer dependency `seneca-promisify` is removed. Seneca 4 has
  promises built in, and the tests no longer load the plugin (D4).
* The option defaults are built with the validator that Seneca passes to
  the plugin: `defaults` is now a function of `{ valid }` (B1). Seneca 4
  validates options with shape and rejects defaults built with Gubu, so
  1.1.0 stops at startup there with `plugin_gubu_shape`. The gubu import
  is removed; gubu was never a declared dependency, and the type
  declarations no longer refer to it. The option keys and values are
  unchanged. Unknown option keys, such as an unknown spec name or an extra
  key in `token`, are rejected with `invalid_plugin_option` (B13).
* The runtime dependency `cookie` is `^0.7.2` (was `^0.6.0`), for the
  advisory GHSA-pxg6-pf52-xh8x. The plugin only parses cookies.
* The tests check the resolved `spec` options and the gateway hooks an
  active spec adds, and run a message through `@seneca/gateway` with the
  `lambda_cookie` spec, with and without a valid cookie.
