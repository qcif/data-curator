#!/usr/bin/env bash
set -eo pipefail

sudo apt-get install -y curl
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update && sudo apt install --no-install-recommends yarn

rm -Rf ~/.nvm
mkdir -p ~/.nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

if [ "${NVM_DIR}" == "" ]; then
  export NVM_DIR=~/.nvm
fi

[ -s "${NVM_DIR}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh"
[ -s "${NVM_DIR}/bash_completion" ] && . "${NVM_DIR}/bash_completion"

nvm install 14 --lts
nvm use 14
node --version
