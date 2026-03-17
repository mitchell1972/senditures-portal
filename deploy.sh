#!/bin/bash
# Senditures Vendor Portal — One-command Vercel deploy
# Run this from the senditures-portal folder

echo "🚀 Deploying Senditures Vendor Portal to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Deploy the pre-built dist folder
vercel deploy --prebuilt dist --prod --yes

echo ""
echo "✅ Done! Your Senditures portal is live."
