#!/usr/bin/env bash
set -ev
unset -f cd
echo "executing $0"
shell_session_update() { :; }
sudo rm -Rf rm /tmp/.X*
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
yarn run unit
set +e
