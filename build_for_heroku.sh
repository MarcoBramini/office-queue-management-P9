#!/bin/bash

npm install
cd client && npm run build
cp -R server/* ./asd
