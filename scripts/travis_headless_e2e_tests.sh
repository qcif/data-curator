#!/bin/bash
set -ev
unset -f cd
shell_session_update() { :; }
#sudo rm -Rf rm /tmp/.X*
#export DISPLAY=:99.0
#sh -e /etc/init.d/xvfb start
#Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
#export DISPLAY=':99.0'
#sleep 5
#"/sbin/start-stop-daemon --start --quiet --pidfile /tmp/custom_xvfb_99.pid --make-pidfile --background --exec /usr/bin/Xvfb -- :99 -ac -screen 0 1280x1024x16"
yarn run clean && yarn run pack && yarn run cucumber:postpack:witharg $@
set +e
