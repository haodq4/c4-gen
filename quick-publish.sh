#!/bin/bash

echo "🔑 NPM Token Setup"
echo "=================="
echo ""

echo "Paste token của bạn vào đây (bắt đầu bằng npm_):"
read -s token

echo ""
echo "⚙️  Setting up token..."

# Logout first
npm logout 2>/dev/null

# Set token
npm config set //registry.npmjs.org/:_authToken=$token

if [ $? -eq 0 ]; then
    echo "✅ Token configured!"
    echo ""
    echo "🚀 Publishing..."
    npm publish --access public
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅✅✅ SUCCESS! Package published!"
        echo ""
        echo "📦 https://www.npmjs.com/package/c4-gen"
        echo ""
        echo "Anyone can install:"
        echo "  npm install -g c4-gen"
    else
        echo ""
        echo "❌ Publish failed. Check errors above."
    fi
else
    echo "❌ Failed to set token"
fi
