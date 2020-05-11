#!/usr/bin/env bash
source ./linux_install_os_dependencies_for_testing_on_ubuntu.sh
set -ev
unset -f cd
echo "executing $0"
shell_session_update() { :; }
sudo rm -Rf rm /tmp/.X*
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
chmod +x
yarn run unit
set +e
