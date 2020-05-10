#!/bin/bash
echo "Checking Ubuntu release compatibility..."
if [ "$(lsb_release -cs)" != "xenial" ] && [ "$(lsb_release -cs)" != "bionic" ]; then
  echo "Installation tested for Ubuntu 16 (xenial) and Ubuntu 18(bionic) only."
  exit 1
fi

echo "Updating Ubuntu release configuration...";
export extra_pkgs=$(echo 'libnss3-1d')
if [ "$(lsb_release -cs)" == "bionic" ]; then
export extra_pkgs=$(echo 'libnss3-dev')
fi

sudo apt-get update -y
sudo apt-get install -y xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic xvfb libgtk-3-0 libxss-dev libgconf2-dev ${extra_pkgs} libasound2 x11-apps
sudo apt-get install -y imagemagick
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
yarn run unit
export NODE_OPTIONS="--max-old-space-size=8192"
#yarn run clean && yarn run pack && yarn run cucumber:postpack:impl