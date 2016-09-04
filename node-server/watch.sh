(killall node ; node server.js &)
while inotifywait -e close_write server.js; do (killall node ; node server.js &); done
