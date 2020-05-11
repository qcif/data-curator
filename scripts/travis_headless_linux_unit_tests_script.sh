#!/usr/bin/env bash
set -ev
unset -f cd
echo "executing $0"
shell_session_update() { :; }
sudo rm -Rf rm /tmp/.X*
xvfb-run --server-args="-screen 0 1024x768x24" yarn run unit
set +e
