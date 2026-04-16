#!/bin/sh
set -e

# Securely unlock the /data volume for the application user
# This runs as root only for the duration of this command
if [ -d "/data" ]; then
    chown -R nextjs:nodejs /data
fi

# Hand over control to the non-privileged nextjs user and start the app
exec su-exec nextjs:nodejs node init-db.js && su-exec nextjs:nodejs node server.js
