#!/bin/bash

npm install --prefix client/
npm run build --prefix client/
cp -R server/* ./
