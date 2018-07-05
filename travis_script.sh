#!/bin/bash
set -ev
unset -f cd
shell_session_update() { :; }
if [ "${TRAVIS_BRANCH}" = "ci" ]; then
  yarn run unit
  yarn run unit:coverage
  sudo rm -Rf rm /tmp/.X*
  export DISPLAY=':99.0'
  # sudo Xvfb :99 -ac -screen 0 1024x768x8
  Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  yarn run e2e
else
  yarn run release:predraft
fi
set +e
