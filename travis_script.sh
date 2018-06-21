#!/bin/bash
set -ev
if [ "${TRAVIS_BRANCH}" = "ci" ]; then
  yarn run unit
else
  yarn run release:predraft
fi
