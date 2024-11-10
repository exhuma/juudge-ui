#!/usr/bin/bash
if [ -z "${JUUDGE_API_URL}" ]; then
  echo "JUUDGE_API_URL is not set. Exiting."
  exit 1
fi

# Write the API URL to the configuration JSON file
echo "{\"apiUrl\": \"${JUUDGE_API_URL}\"}" > /opt/juudge/config.json

exec nginx -g 'daemon off;'
