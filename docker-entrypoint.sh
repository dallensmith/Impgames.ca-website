#!/bin/sh
set -e

# Securely unlock the /data volume for the application user
if [ -d "/data" ]; then
    chown -R nextjs:nodejs /data
fi

# Run the initialization but don't exit the container yet
su-exec nextjs:nodejs node init-db.js

# Now hand over total control to the server and keep the container alive
exec su-exec nextjs:nodejs node server.js
