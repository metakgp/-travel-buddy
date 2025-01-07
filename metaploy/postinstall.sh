#!/bin/sh

cleanup() {
	echo "Container stopped. Removing nginx configuration."
	rm /etc/nginx/sites-enabled/travel.metaploy.conf
}

trap 'cleanup' SIGQUIT SIGTERM SIGHUP

"${@}" &

cp ./iqps.metaploy.conf /etc/nginx/sites-enabled

wait $!
