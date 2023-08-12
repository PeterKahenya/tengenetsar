#!/usr/bin/env bash
cd frontend/

npm run build

npm run install

cd ../

git add .

git commit -m "Updated"

git push production master