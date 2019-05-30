#!/usr/bin/env bash
set -ev
unset -f cd
echo "executing $0"
shell_session_update() { :; }
sudo rm -Rf rm /tmp/.X*
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
#sudo apt-get update -y
#sudo apt-get install -y libgtk-3-dev libgconf2-dev libnss3 libasound2 libxtst-dev libx11-xcb-dev libxss-dev
yarn run unit
set +e
