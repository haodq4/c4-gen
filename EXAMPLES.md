# Ví Dụ Sử Dụng c4-gen

## 1. Setup

```bash
# Cài đặt global
npm install -g c4-gen

# Hoặc cài đặt local
npm install c4-gen

# Cấu hình API key
c4-gen init -k YOUR_GEMINI_API_KEY
```

## 2. Ví Dụ Cơ Bản

### Generate cho thư mục hiện tại

```bash
c4-gen generate
```

Kết quả:
```
🚀 Bắt đầu phân tích source code...
📂 Source: /home/user/my-project
📝 Output: /home/user/my-project/docs
🎯 Level: 3
📊 Đang quét cấu trúc source code...
✅ Đã quét 45 files
🤖 Đang kết nối đến Gemini AI...
📋 Đang sinh Level 1: Context Diagram...
📦 Đang sinh Level 2: Container Diagram...
🧩 Đang sinh Level 3: Component Diagram...
📝 Đang tạo file markdown...
✅ Hoàn thành! Tài liệu đã được tạo tại: /home/user/my-project/docs
```

## 3. Ví Dụ với Node.js/Express API

```bash
# Cấu trúc project
my-api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
├── package.json
└── README.md

# Generate tài liệu
cd my-api
c4-gen generate -l 3 -o ./architecture-docs
```

## 4. Ví Dụ với Python/Django

```bash
# Cấu trúc project
my-django-app/
├── myapp/
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── requirements.txt
└── manage.py

# Generate tài liệu
c4-gen generate -p ./my-django-app -o ./docs -l 4
```

## 5. Ví Dụ với Microservices

```bash
# Generate cho từng service
cd user-service
c4-gen generate -o ./docs/user-service

cd ../order-service
c4-gen generate -o ./docs/order-service

cd ../payment-service
c4-gen generate -o ./docs/payment-service
```

## 6. Ví Dụ Output

### README.md

```markdown
# My Project - Tài Liệu Kiến Trúc C4 Model

> 📅 Tạo lúc: 19/03/2026 10:30:00

## 📋 Tổng Quan

Tài liệu này được tạo tự động bởi **c4-gen**...

## 📚 Cấu Trúc Tài Liệu

- [✅ Level 1: Context Diagram](./01-context-diagram.md)
- [✅ Level 2: Container Diagram](./02-container-diagram.md)
- [✅ Level 3: Component Diagram](./03-component-diagram.md)
```

### 01-context-diagram.md

```markdown
# Level 1: Context Diagram

## E-Commerce System

### 📝 Mô Tả
Hệ thống thương mại điện tử cho phép người dùng mua sắm online

### 👥 Người Dùng / Actors

#### Customer
Người mua hàng trên hệ thống

**Tương tác:**
- Browse products
- Add to cart
- Checkout
- Track orders
```

## 7. Tips & Tricks

### Tối ưu cho project lớn

```bash
# Chỉ generate level 1-2 cho overview nhanh
c4-gen generate -l 2

# Generate full sau khi cần chi tiết
c4-gen generate -l 4
```

### Sử dụng với CI/CD

```bash
# .github/workflows/docs.yml
name: Generate Architecture Docs

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install -g c4-gen
      - run: c4-gen generate -k ${{ secrets.GEMINI_API_KEY }} -o ./docs
      - run: git add docs && git commit -m "Update docs" && git push
```

### Multiple API Keys

```bash
# Development
c4-gen generate -k $DEV_API_KEY

# Production
c4-gen generate -k $PROD_API_KEY
```

## 8. Troubleshooting

### API Key không hoạt động

```bash
# Kiểm tra config
c4-gen config

# Reset config
rm -rf ~/.c4-gen/config.json
c4-gen init -k NEW_API_KEY
```

### Không quét được files

```bash
# Kiểm tra .gitignore
cat .gitignore

# Generate với verbose (sẽ thêm trong version tới)
DEBUG=* c4-gen generate
```

### Kết quả không chính xác

- Đảm bảo code có comments tốt
- Đảm bảo naming convention rõ ràng
- Có thể chỉnh sửa markdown output sau
- Thử chạy lại với level khác

## 9. Best Practices

1. **Chạy định kỳ**: Update docs mỗi khi có thay đổi lớn
2. **Version control**: Commit docs vào git
3. **Review**: Kiểm tra và chỉnh sửa docs do AI sinh
4. **Combine**: Kết hợp với docs viết tay cho context domain
5. **Share**: Push lên GitHub để team cùng xem

## 10. Advanced Usage

### Custom ignore patterns

Tạo `.c4genignore` trong project root:

```
# .c4genignore
test/**
*.test.js
*.spec.js
mock/**
fixtures/**
```

(Feature này sẽ được thêm trong version tới)
