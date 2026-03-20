# c4-gen 🚀

**Công cụ tự động tạo tài liệu kiến trúc C4 Model từ source code bằng AI**

[English](./README.md) | **Tiếng Việt**

## 🎯 c4-gen là gì?

`c4-gen` là một công cụ dòng lệnh (CLI) giúp bạn tự động tạo tài liệu kiến trúc hệ thống theo mô hình **C4 Model** chỉ bằng một câu lệnh. Tool sử dụng **Google Gemini AI** để đọc và phân tích source code của bạn, sau đó tạo ra các tài liệu markdown chi tiết với sơ đồ Mermaid.

### Tại sao nên dùng c4-gen?

- ⏰ **Tiết kiệm thời gian**: Không cần viết tài liệu kiến trúc thủ công nữa
- 🤖 **Thông minh**: AI hiểu code và tạo tài liệu chính xác
- 📊 **Chuyên nghiệp**: Tạo sơ đồ C4 Model chuẩn
- 📝 **Dễ đọc**: Output là Markdown với Mermaid diagrams
- 🌐 **Đa ngôn ngữ**: Hỗ trợ 13+ ngôn ngữ lập trình
- 🆓 **Miễn phí**: Hoàn toàn mã nguồn mở

## 📦 Cài Đặt

### Cài đặt global (Khuyến nghị)

```bash
npm install -g c4-gen
```

### Hoặc clone về để phát triển

```bash
git clone https://github.com/your-username/c4-gen.git
cd c4-gen
./setup.sh
```

## 🔑 Lấy API Key Gemini (Miễn Phí)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google
3. Click **"Create API Key"**
4. Copy API key

## 🚀 Sử Dụng Nhanh

### Bước 1: Cấu hình API key (chỉ làm 1 lần)

```bash
c4-gen init -k YOUR_GEMINI_API_KEY
```

### Bước 2: Tạo tài liệu

```bash
# Di chuyển đến thư mục source code
cd /path/to/your/project

# Chạy lệnh generate
c4-gen generate
```

### Bước 3: Xem kết quả

```bash
cd docs
ls
# Sẽ thấy các file:
# - README.md
# - 01-context-diagram.md
# - 02-container-diagram.md
# - 03-component-diagram.md
```

## 📚 Ví Dụ Chi Tiết

### Ví dụ 1: Tạo tài liệu cho Node.js API

```bash
cd my-nodejs-api
c4-gen generate -o ./architecture-docs
```

Kết quả:
```
✅ Đã tạo tài liệu tại ./architecture-docs/
   ├── README.md
   ├── 01-context-diagram.md
   ├── 02-container-diagram.md
   └── 03-component-diagram.md
```

### Ví dụ 2: Tạo tài liệu đầy đủ 4 levels

```bash
c4-gen generate -l 4 -o ./full-docs
```

### Ví dụ 3: Tạo cho project Python

```bash
cd my-python-app
c4-gen generate -o ./docs
```

## 🎨 C4 Model Là Gì?

C4 Model là phương pháp mô hình hóa kiến trúc phần mềm với 4 cấp độ:

### Level 1: Context (Bối cảnh)
Mô tả hệ thống trong môi trường của nó - người dùng là ai, hệ thống kết nối với gì.

### Level 2: Container (Thành phần)
Mô tả các thành phần chính: web app, mobile app, database, API...

### Level 3: Component (Chi tiết)
Mô tả các module/component bên trong mỗi container.

### Level 4: Code (Mã nguồn)
Mô tả chi tiết implementation: classes, methods, relationships.

## 🛠️ Các Options

### Command: `init`

Khởi tạo và lưu API key

```bash
c4-gen init -k YOUR_API_KEY
```

### Command: `generate`

Tạo tài liệu C4 Model

```bash
c4-gen generate [options]
```

**Options:**

| Option | Mô tả | Mặc định |
|--------|-------|----------|
| `-p, --path <path>` | Đường dẫn đến source code | Thư mục hiện tại |
| `-o, --output <path>` | Thư mục lưu tài liệu | `./docs` |
| `-l, --level <1-4>` | Mức độ chi tiết (1-4) | `3` |
| `-k, --key <key>` | API key (ghi đè config) | Từ config |

**Ví dụ:**

```bash
# Generate level 2 cho thư mục khác
c4-gen generate -p ~/my-project -l 2

# Generate full level 4 với output tùy chỉnh
c4-gen generate -o ./my-docs -l 4

# Dùng API key khác
c4-gen generate -k ANOTHER_API_KEY
```

### Command: `config`

Xem cấu hình hiện tại

```bash
c4-gen config
```

## 🌍 Ngôn Ngữ Được Hỗ Trợ

✅ JavaScript / TypeScript  
✅ Python  
✅ Java  
✅ Go  
✅ Rust  
✅ C / C++  
✅ C#  
✅ PHP  
✅ Ruby  
✅ Swift  
✅ Kotlin  
✅ Scala  
✅ Dart  

## 📖 Kết Quả Output

### Cấu trúc thư mục

```
docs/
├── README.md                    # Tổng quan về tài liệu
├── 01-context-diagram.md        # Level 1: Context
├── 02-container-diagram.md      # Level 2: Container
├── 03-component-diagram.md      # Level 3: Component
├── 04-code-diagram.md           # Level 4: Code (nếu -l 4)
└── diagrams/
    └── README.md                # Hướng dẫn về diagrams
```

### Ví dụ nội dung

**README.md:**
```markdown
# My Project - Tài Liệu Kiến Trúc C4 Model

## Tổng Quan
Hệ thống quản lý bán hàng online...

## Cấu Trúc Tài Liệu
- Level 1: Context Diagram
- Level 2: Container Diagram
- Level 3: Component Diagram
```

**01-context-diagram.md:**
```markdown
# Level 1: Context Diagram

## E-Commerce System

### Người Dùng
- Khách hàng: Mua sắm online
- Admin: Quản lý hệ thống
- Kho: Quản lý tồn kho

### Hệ Thống Bên Ngoài
- Payment Gateway
- Email Service
- SMS Service

### Sơ Đồ
```mermaid
graph TB
    ...
```
```

## 💡 Tips & Best Practices

### 1. Chạy định kỳ
Cập nhật tài liệu mỗi khi có thay đổi lớn:
```bash
c4-gen generate -o ./docs
git add docs/
git commit -m "docs: update architecture"
git push
```

### 2. Review và chỉnh sửa
AI có thể hiểu sai. Hãy review và edit output markdown nếu cần.

### 3. Kết hợp với docs viết tay
Dùng c4-gen cho phần technical, viết thêm business context.

### 4. Tối ưu cho large projects
```bash
# Dùng level thấp cho overview nhanh
c4-gen generate -l 2

# Sau đó mới generate chi tiết
c4-gen generate -l 4
```

### 5. CI/CD Integration
Tự động generate docs khi push code:

```yaml
# .github/workflows/docs.yml
name: Generate Docs
on:
  push:
    branches: [main]
jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g c4-gen
      - run: c4-gen generate -k ${{ secrets.GEMINI_API_KEY }}
      - run: |
          git config user.name "GitHub Actions"
          git add docs/
          git commit -m "docs: auto-update architecture" || exit 0
          git push
```

## 🐛 Xử Lý Lỗi

### Lỗi: "API key not found"

```bash
# Giải pháp: Cấu hình lại API key
c4-gen init -k YOUR_API_KEY
```

### Lỗi: "No code files found"

```bash
# Kiểm tra đường dẫn
ls -la /path/to/source

# Hoặc chỉ định path cụ thể
c4-gen generate -p /correct/path
```

### Generation quá lâu

```bash
# Dùng level thấp hơn
c4-gen generate -l 2
```

### Kết quả không chính xác

- Thêm comments tốt hơn vào code
- Dùng naming conventions rõ ràng
- Review và edit markdown output
- Thử chạy lại với level khác

## 🤝 Đóng Góp

Rất hoan nghênh mọi đóng góp! Xem [CONTRIBUTING.md](./CONTRIBUTING.md)

### Cách đóng góp:

1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

MIT License - xem file [LICENSE](./LICENSE)

## 🙏 Credits

- [C4 Model](https://c4model.com/) by Simon Brown
- [Google Gemini AI](https://ai.google.dev/)
- [Mermaid](https://mermaid.js.org/)

## 📞 Liên Hệ

- **GitHub Issues**: [Report bugs](https://github.com/your-username/c4-gen/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/your-username/c4-gen/discussions)
- **Email**: your-email@example.com

## ⭐ Ủng Hộ Project

Nếu tool hữu ích, hãy:
- ⭐ Star trên GitHub
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code
- 📢 Share với bạn bè

---

Made with ❤️ by Vietnamese Developers
