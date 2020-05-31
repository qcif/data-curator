#!/bin/bash
. ./scripts/linux_headless_xvfb_init.sh
yarn run unit
yarn run e2e:impl