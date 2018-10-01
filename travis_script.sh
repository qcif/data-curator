#!/bin/bash
set -ev
if [ "${TRAVIS_BRANCH}" == "ci" ] || [ "${TRAVIS_BRANCH}" == "test" ]; then
  yarn run unit
  yarn run unit:coverage
else
  yarn run release:predraft
fi
