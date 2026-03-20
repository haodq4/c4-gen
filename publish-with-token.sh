#!/bin/bash

echo "🔑 Hướng dẫn tạo và sử dụng NPM Access Token"
echo "=============================================="
echo ""

NPM_USER=$(npm whoami 2>/dev/null)
if [ -z "$NPM_USER" ]; then
    NPM_USER="haodq4"
fi

echo "📋 Các bước thực hiện:"
echo ""
echo "1️⃣  Tạo Access Token:"
echo "    Mở link: https://www.npmjs.com/settings/$NPM_USER/tokens/create"
echo ""
echo "2️⃣  Chọn loại token:"
echo "    ✓ Chọn 'Automation' (bypass 2FA/passkey)"
echo "    ✓ Hoặc 'Publish' (cần OTP mỗi lần)"
echo ""
echo "3️⃣  Copy token (bắt đầu bằng npm_...)"
echo ""
echo "4️⃣  Logout khỏi session hiện tại:"
echo "    npm logout"
echo ""
echo "5️⃣  Set token vào config:"
echo "    npm set //registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxx"
echo ""
echo "    (Thay npm_xxxxxxxxxxxx bằng token vừa copy)"
echo ""
echo "6️⃣  Publish:"
echo "    npm publish --access public"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Hoặc chạy commands sau đây:"
echo ""
read -p "Bạn đã có Access Token chưa? (yes/no): " has_token

if [ "$has_token" = "yes" ]; then
    read -p "Paste token vào đây (npm_...): " token
    
    if [ -z "$token" ]; then
        echo "❌ Token không được để trống"
        exit 1
    fi
    
    echo ""
    echo "⚙️  Configuring..."
    
    # Logout first
    npm logout 2>/dev/null
    
    # Set token
    npm set //registry.npmjs.org/:_authToken=$token
    
    if [ $? -eq 0 ]; then
        echo "✅ Token đã được cấu hình!"
        echo ""
        echo "🚀 Publishing..."
        npm publish --access public
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅✅✅ Published successfully!"
            echo ""
            echo "📦 https://www.npmjs.com/package/c4-gen"
            echo ""
            echo "Install: npm install -g c4-gen"
        fi
    else
        echo "❌ Failed to set token"
    fi
else
    echo ""
    echo "👉 Làm theo các bước trên để tạo token"
    echo ""
    echo "Quick link: https://www.npmjs.com/settings/$NPM_USER/tokens/create"
fi
