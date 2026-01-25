#!/bin/bash

# Buurtplatform - Environment Setup Helper
# This script helps you create the .env.local file

echo "═══════════════════════════════════════════════════════"
echo "  BUURTPLATFORM - Environment Setup"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Have you created your Sanity project at https://www.sanity.io/manage?"
echo ""
read -p "Enter your Sanity Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo ""
    echo "❌ No Project ID entered. Exiting."
    exit 1
fi

# Create .env.local file
cat > .env.local << EOF
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production

# Optional: API token for preview functionality
# SANITY_API_TOKEN=
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "Your configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Dataset: production"
echo ""
echo "═══════════════════════════════════════════════════════"
echo "Next step: Run 'npm run dev' to start the server"
echo "═══════════════════════════════════════════════════════"
