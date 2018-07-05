#!/bin/bash
set -ev
unset -f cd
shell_session_update() { :; }
if [ "${TRAVIS_BRANCH}" = "ci" ]; then
  yarn run unit
  yarn run unit:coverage
  Xvfb :99 -ac -screen 0 1024x768x8 && yarn run e2e
else
  yarn run release:predraft
fi
