#!/bin/bash

# Go to the submodule directory
cd ./shared-types

# Path to the git executable
# GIT_PATH=/usr/bin/git

# Fetch the latest changes from the remote repository
git pull origin/master

git merge origin/master
# Merge the remote changes with your local version
# $GIT_PATH merge origin/master
