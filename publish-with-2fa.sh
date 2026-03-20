#!/bin/bash

# Script publish với OTP support

echo "🚀 c4-gen - Publish với 2FA"
echo "============================"
echo ""

# Check whoami
NPM_USER=$(npm whoami 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Not logged in. Run: npm login"
    exit 1
fi

echo "✅ Logged in as: $NPM_USER"
echo ""

# Option 1: With OTP
echo "📱 Nếu bạn đã enable 2FA:"
echo "   1. Mở app 2FA (Google Authenticator/Authy)"
echo "   2. Lấy 6-digit OTP code"
echo "   3. Chạy: npm publish --otp=XXXXXX --access public"
echo ""

# Option 2: Automation Token
echo "🔑 Hoặc dùng Automation Token (cho CI/CD):"
echo "   1. Vào: https://www.npmjs.com/settings/$NPM_USER/tokens"
echo "   2. Click 'Generate New Token'"
echo "   3. Chọn 'Automation' (bypass 2FA)"
echo "   4. Copy token"
echo "   5. Logout: npm logout"
echo "   6. Login với token: npm set //registry.npmjs.org/:_authToken=YOUR_TOKEN"
echo "   7. Publish: npm publish --access public"
echo ""

# Prompt for OTP
read -p "Bạn có OTP code không? (yes/no): " has_otp

if [ "$has_otp" = "yes" ]; then
    read -p "Nhập OTP code (6 digits): " otp_code
    
    if [ -z "$otp_code" ]; then
        echo "❌ OTP code không được để trống"
        exit 1
    fi
    
    echo ""
    echo "🚀 Publishing với OTP..."
    npm publish --otp=$otp_code --access public
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅✅✅ Published successfully!"
        echo ""
        echo "📦 Package: https://www.npmjs.com/package/c4-gen"
        echo ""
        echo "Install: npm install -g c4-gen"
    else
        echo ""
        echo "❌ Publish failed"
        echo ""
        echo "Troubleshooting:"
        echo "  - OTP expired → Lấy code mới từ app"
        echo "  - OTP sai → Kiểm tra lại code"
        echo "  - 2FA chưa enable → Vào https://www.npmjs.com/settings/$NPM_USER/tfa"
    fi
else
    echo ""
    echo "📋 Các bước tiếp theo:"
    echo ""
    echo "Option A - Enable 2FA rồi publish:"
    echo "  1. https://www.npmjs.com/settings/$NPM_USER/tfa"
    echo "  2. Enable 2FA"
    echo "  3. npm publish --otp=XXXXXX --access public"
    echo ""
    echo "Option B - Dùng Automation Token:"
    echo "  1. https://www.npmjs.com/settings/$NPM_USER/tokens"
    echo "  2. Generate → Automation token"
    echo "  3. npm logout"
    echo "  4. npm set //registry.npmjs.org/:_authToken=TOKEN"
    echo "  5. npm publish --access public"
fi
