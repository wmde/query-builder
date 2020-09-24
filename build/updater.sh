#!/bin/bash
cd query-builder
git pull
rm -rf node_modules
npm install
npm run build
rm -rf public_html/*
cp -R dist/* ../public_html/
