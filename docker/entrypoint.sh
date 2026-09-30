#!/bin/sh

set -eu

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

node ace migration:run --force
exec node bin/server.js
