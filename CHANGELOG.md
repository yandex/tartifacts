Changelog
=========

v1.1.3 (2016-09-02)
-------------------

### Performance

* Improved performance of file search by patterns (glob): there is no need to sort files (@blond [#41]).

[#41]: https://github.com/blond/tartifacts/pull/41

### Dependencies

* Updated `glob-stream` to version `5.3.4` (@greenkeeperio-bot [#38]).
* Updated `archiver` to version `1.1.0` (@greenkeeperio-bot [#39]).

[#38]: https://github.com/blond/tartifacts/pull/38
[#39]: https://github.com/blond/tartifacts/pull/39

v1.1.2 (2016-08-24)
-------------------

### Bug Fixes

* Fixed path to main file (@blond [#35]).

[#35]: https://github.com/blond/tartifacts/pull/35

### Dependencies

* Updated `archiver` to version `1.0.1` (@greenkeeperio-bot [#28]).
* Updated `copy` to version `0.3.0` (@greenkeeperio-bot [#26]).

[#28]: https://github.com/blond/tartifacts/pull/28
[#26]: https://github.com/blond/tartifacts/pull/26

v1.1.1 (2016-06-24)
-------------------

### Commits

* [[`7eff597`](https://github.com/blond/tartifacts/commit/7eff597)] - chore(package): update copy to version 0.2.3 (@greenkeeperio-bot)

v1.1.0 (2016-06-16)
-------------------

### CLI

* Added root dir argument to CLI (@rndD [#11]).

[#11]: https://github.com/blond/tartifacts/pull/11

### Commits

* [[`bbe949c`](https://github.com/blond/tartifacts/commit/bbe949c)] - docs(cli): update cli usage (@blond)
* [[`6be1484`](https://github.com/blond/tartifacts/commit/6be1484)] - Root dir argument in CLI (@rndD)
* [[`ee78548`](https://github.com/blond/tartifacts/commit/ee78548)] - Added .idea files to gitignore (@alex-k)
* [[`cb53d91`](https://github.com/blond/tartifacts/commit/cb53d91)] - chore(package): update ava to version 0.15.0 (@greenkeeperio-bot)

v1.0.1 (2016-05-18)
-------------------

### Bug Fixes

* Should ignore broken symlinks ([#7]).

[#7]: https://github.com/blond/tartifacts/pull/7

### Commits

* [[`f851122`](https://github.com/blond/tartifacts/commit/f8511228)] - **fix**: should ignore broken symlinks (@blond)
* [[`897cfdf`](https://github.com/blond/tartifacts/commit/897cfdf9)] - **fix**: tests in Node.js v6.2.0 (@blond)
* [[`488143b`](https://github.com/blond/tartifacts/commit/488143b5)] - chore(package): update dependencies (@greenkeeperio-bot)
