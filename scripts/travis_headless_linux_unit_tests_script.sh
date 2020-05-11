#!/usr/bin/env bash
set -ev
unset -f cd
echo "executing $0"
shell_session_update() { :; }
sudo rm -Rf rm /tmp/.X*
#export DISPLAY=:99.0
#sh -e /etc/init.d/xvfb start
#Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
#export DISPLAY=':99.0'
xvfb-run -a --server-args="-screen 0 1024x768x24" yarn run unit
set +e
