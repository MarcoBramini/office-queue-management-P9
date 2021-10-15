#!/bin/bash

npm ci --prefix client/
npm run build --prefix client/
cp -R server/* ./
