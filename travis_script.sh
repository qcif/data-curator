#!/bin/bash
set -ev
if [ "${TRAVIS_BRANCH}" = "ci" ]; then
  yarn run unit
  yarn run unit:coverage
  xvfb-run yarn run e2e
else
  yarn run release:predraft
fi
