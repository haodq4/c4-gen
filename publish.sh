#!/bin/bash

# Script để publish c4-gen lên NPM một cách nhanh chóng

echo "🚀 c4-gen - Quick Publish Script"
echo "================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check package.json
echo "📋 Checking package.json..."
if grep -q "your-username" package.json || grep -q "your-email" package.json || grep -q "Your Name" package.json; then
    echo -e "${RED}❌ Please update package.json with your real information:${NC}"
    echo "  - author name and email"
    echo "  - repository URL (GitHub username)"
    echo "  - bugs URL"
    echo "  - homepage URL"
    echo ""
    echo "Edit: package.json"
    exit 1
fi

echo -e "${GREEN}✅ package.json looks good${NC}"
echo ""

# Check if logged in to NPM
echo "🔐 Checking NPM login..."
if ! npm whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to NPM${NC}"
    echo ""
    echo "Please login:"
    npm login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Login failed${NC}"
        exit 1
    fi
fi

NPM_USER=$(npm whoami)
echo -e "${GREEN}✅ Logged in as: ${NPM_USER}${NC}"
echo ""

# Dry run
echo "🧪 Running dry-run..."
npm publish --dry-run
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dry run failed. Please fix errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dry run successful${NC}"
echo ""

# Confirm
echo -e "${YELLOW}📦 Ready to publish c4-gen@$(node -p "require('./package.json').version")${NC}"
echo ""
read -p "Do you want to publish? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Publish cancelled"
    exit 0
fi

# Publish
echo ""
echo "🚀 Publishing..."
npm publish --access public

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅✅✅ Successfully published!${NC}"
    echo ""
    echo "Package URL: https://www.npmjs.com/package/c4-gen"
    echo ""
    echo "Install command:"
    echo "  npm install -g c4-gen"
    echo ""
    echo "Next steps:"
    echo "  1. Create GitHub release"
    echo "  2. Update README badges"
    echo "  3. Share on social media"
    echo ""
else
    echo -e "${RED}❌ Publish failed${NC}"
    echo ""
    echo "Common issues:"
    echo "  - Package name already taken → Change name in package.json"
    echo "  - Not logged in → Run: npm login"
    echo "  - Version already exists → Update version: npm version patch"
    exit 1
fi
