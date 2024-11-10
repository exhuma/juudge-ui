#!/usr/bin/bash
if [ -z "${JUUDGE_API_URL}" ]; then
  echo "JUUDGE_API_URL is not set. Exiting."
  exit 1
fi
if [ -z "${JUUDGE_API_USERNAME}" ]; then
  echo "JUUDGE_API_USERNAME is not set. Exiting."
  exit 1
fi
if [ -z "${JUUDGE_API_PASSWORD}" ]; then
  echo "JUUDGE_API_PASSWORD is not set. Exiting."
  exit 1
fi

# Write the API URL to the configuration JSON file
echo "{\"apiUrl\": \"${JUUDGE_API_URL}\", \"username\": \"${JUUDGE_API_USERNAME}\", \"password\": \"${JUUDGE_API_PASSWORD}\" }" > /opt/juudge/config.json

exec nginx -g 'daemon off;'
