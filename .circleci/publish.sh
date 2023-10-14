#!/usr/bin/env bash

set -euo pipefail

if [ "${CIRCLE_BRANCH}" == "main" ]; then
  npx lerna version --conventional-commits --create-release github --force-git-tag -y
  npx lerna publish from-git -y
fi
