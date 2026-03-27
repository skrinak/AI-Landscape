#!/usr/bin/env bash
set -euo pipefail

BUCKET="test.tube"
PREFIX="AI-Landscape"

cd "$(dirname "$0")/../web"

echo "Building..."
npm run build

echo "Syncing assets to s3://$BUCKET/$PREFIX/ ..."
aws s3 sync dist/ "s3://$BUCKET/$PREFIX/" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html" \

echo "Uploading index.html..."
aws s3 cp dist/index.html "s3://$BUCKET/$PREFIX/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html" \

echo "Done: http://$BUCKET.s3-website-us-east-1.amazonaws.com/$PREFIX/"
