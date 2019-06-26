#!/bin/bash
sudo apt-get install -y xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic xvfb libgtk-3-0 libxss-dev libgconf2-dev libnss3-1d libasound2 x11-apps
sudo apt-get install -y imagemagick
Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &
export DISPLAY=':99.0'
yarn run unit
yarn run clean && yarn run pack && yarn run cucumber:postpack:impl