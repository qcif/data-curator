#!/usr/bin/env bash
set -ev
unset -f cd
shell_session_update() { :; }
git stash
git remote set-branches --add origin develop || exit
git fetch origin develop || exit
git checkout --track origin/develop || exit
git checkout ${TRAVIS_BRANCH} || exit
git checkout develop -- src || exit
set +e
