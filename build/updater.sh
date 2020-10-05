#!/bin/bash
cd /data/project/query-builder-test/query-builder
git reset --hard origin/master
git pull
./node_modules/.bin/npm install npm@6.14.8
./node_modules/.bin/npm update
./node_modules/.bin/npm run build
rm -rf public_html/*
cp -R dist/* ../public_html/
