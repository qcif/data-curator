#!/bin/bash
source ./linux_install_os_dependencies_for_testing_on_ubuntu.sh
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
yarn run unit
export NODE_OPTIONS="--max-old-space-size=8192"
#yarn run clean && yarn run pack && yarn run cucumber:postpack:impl