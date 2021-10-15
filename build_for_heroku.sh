#!/bin/bash

cd client && npm install
cd client && npm run build
cp -R server/* ./asd
