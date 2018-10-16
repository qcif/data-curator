#!/bin/bash
set -ev
unset -f cd
shell_session_update() { :; }
<<<<<<< HEAD
if [ "${TRAVIS_BRANCH}" = "ci" ]; then
=======
if [ "${TRAVIS_BRANCH}" == "ci" ] || [ "${TRAVIS_BRANCH}" == "testci" ]; then
>>>>>>> testci
  sudo rm -Rf rm /tmp/.X*
  export DISPLAY=':99.0'
  Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  yarn run clean && yarn run pack && yarn run cucumber:postpack:witharg $@
# else
#   yarn run release:predraft
fi
set +e
