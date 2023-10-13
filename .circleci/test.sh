#!/usr/bin/env bash

set -euo pipefail

npx jest --coverage --coverageReporters=text-lcov | npx coveralls
