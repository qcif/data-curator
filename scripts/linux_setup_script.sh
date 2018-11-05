#!/usr/bin/env bash
set -ev
unset -f cd
shell_session_update() { :; }
if [ "${TRAVIS_BRANCH}" == "ci" ] || [ "${TRAVIS_BRANCH}" == "testci" ]; then
  sudo rm -Rf rm /tmp/.X*
  export DISPLAY=':99.0'
  Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
  sudo apt-get update -y
  sudo apt-get install -y libgtk-3-dev libgconf2-dev libnss3 libasound2 libxtst-dev libx11-xcb-dev libxss-dev
  yarn run clean
  yarn run unit
fi
set +e


