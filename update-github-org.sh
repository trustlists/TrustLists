#!/bin/bash

# Script to update GitHub organization references
# Usage: ./update-github-org.sh YourNewOrgName

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the new organization name"
    echo "Usage: ./update-github-org.sh YourNewOrgName"
    exit 1
fi

NEW_ORG="$1"
OLD_OWNER="FelixMichaels"
REPO_NAME="TrustLists"

echo "🔄 Updating GitHub references..."
echo "   From: github.com/$OLD_OWNER/$REPO_NAME"
echo "   To:   github.com/$NEW_ORG/$REPO_NAME"
echo ""

# Function to update file
update_file() {
    local file=$1
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "$file.backup"
        
        # Replace references
        sed -i '' "s|github.com/$OLD_OWNER/$REPO_NAME|github.com/$NEW_ORG/$REPO_NAME|g" "$file"
        
        echo "   ✓ Updated: $file"
    else
        echo "   ⚠️  Not found: $file"
    fi
}

# Update all files
update_file "package.json"
update_file "pages/submit.js"
update_file "pages/index.js"
update_file "docs/docs.json"
update_file "docs/contributing/guidelines.mdx"

echo ""
echo "✅ Update complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Test locally: npm run dev"
echo "   3. Commit: git add . && git commit -m 'Update GitHub org references'"
echo "   4. Push: git push"
echo ""
echo "💾 Backups created with .backup extension"
echo ""

