#!/bin/bash
echo "Initialising nvm and node..."
. ~/.bashrc
echo "This script should be executed from the 'data-curator' root folder"
if [ "$(basename `pwd`)" != "data-curator" ]; then
echo "Not in data-curator directory"
exit 1
fi

yarn
. ./scripts/linux_headless_xvfb_init.sh
yarn run unit
yarn run e2e:impl
