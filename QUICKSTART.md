# 🚀 Quick Start Guide

## Installation trong 3 Phút

### Option 1: NPM (Khuyến nghị - sau khi publish)

```bash
# Install global
npm install -g c4-gen

# Verify installation
c4-gen --help
```

### Option 2: Clone và Build (Cho development)

```bash
# Clone repository
git clone https://github.com/your-username/c4-gen.git
cd c4-gen

# Run setup script
./setup.sh

# Hoặc manual setup
npm install
chmod +x index.js
npm link
```

## Sử Dụng Cơ Bản

### Bước 1: Lấy Gemini API Key (Miễn phí)

1. Truy cập: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy key

### Bước 2: Cấu Hình

```bash
c4-gen init -k YOUR_GEMINI_API_KEY
```

### Bước 3: Generate Tài Liệu

```bash
# Tại thư mục project của bạn
cd /path/to/your/project

# Generate
c4-gen generate

# Hoặc với options
c4-gen generate -o ./my-docs -l 3
```

### Bước 4: Xem Kết Quả

```bash
# Mở file docs
cd docs
cat README.md

# Hoặc xem trên GitHub (auto render Mermaid)
git add docs/
git commit -m "Add architecture documentation"
git push
```

## Các Lệnh Chính

### `init` - Khởi tạo config

```bash
c4-gen init -k YOUR_API_KEY
```

### `generate` - Tạo tài liệu

```bash
# Basic
c4-gen generate

# With options
c4-gen generate \
  -p /path/to/source \
  -o /path/to/output \
  -l 3 \
  -k OVERRIDE_API_KEY
```

Options:
- `-p, --path`: Đường dẫn source code (default: current dir)
- `-o, --output`: Thư mục output (default: ./docs)
- `-l, --level`: Level 1-4 (default: 3)
- `-k, --key`: API key (override config)

### `config` - Xem config

```bash
c4-gen config
```

## Output Structure

```
docs/
├── README.md                    # Tổng quan
├── 01-context-diagram.md        # Level 1
├── 02-container-diagram.md      # Level 2
├── 03-component-diagram.md      # Level 3
├── 04-code-diagram.md           # Level 4 (nếu -l 4)
└── diagrams/
    └── README.md
```

## Common Use Cases

### Use Case 1: New Team Member Onboarding

```bash
# Generate full docs
c4-gen generate -l 4 -o ./docs/architecture

# Share với team
git add docs/
git commit -m "docs: add architecture documentation"
git push
```

### Use Case 2: Technical Documentation

```bash
# Generate high-level overview
c4-gen generate -l 2 -o ./docs/overview
```

### Use Case 3: Code Review

```bash
# Generate component and code level
c4-gen generate -l 4 -o ./docs/detailed
```

### Use Case 4: Multiple Services

```bash
# Service 1
cd service1
c4-gen generate -o ../docs/service1

# Service 2
cd ../service2
c4-gen generate -o ../docs/service2

# Service 3
cd ../service3
c4-gen generate -o ../docs/service3
```

## Tips

### ✅ Best Practices

1. **Run regularly**: Update docs when có major changes
2. **Review output**: AI có thể sai, review và edit
3. **Combine with manual docs**: Dùng kết hợp với docs viết tay
4. **Version control**: Commit docs vào git
5. **Share with team**: Push lên GitHub để team view

### ⚡ Performance

- Large codebase? Dùng level thấp (1-2)
- Need details? Dùng level cao (3-4)
- Specific folder? Dùng `-p` để point đến folder cụ thể

### 🐛 Troubleshooting

**Problem: "API key not found"**
```bash
# Solution
c4-gen init -k YOUR_API_KEY
c4-gen config  # Verify
```

**Problem: "No code files found"**
```bash
# Solution: Check path
ls -la /path/to/source
c4-gen generate -p /correct/path
```

**Problem: Generation takes too long**
```bash
# Solution: Use lower level
c4-gen generate -l 2
```

**Problem: Inaccurate results**
```bash
# Solutions:
# 1. Add better comments to code
# 2. Use meaningful naming
# 3. Review and edit output markdown
```

## Next Steps

1. 📖 Read [EXAMPLES.md](./EXAMPLES.md) for more examples
2. 🎨 Customize output markdown as needed
3. 📤 Share with team
4. ⭐ Star the repo if helpful!

## Need Help?

- 📚 Full docs: [README.md](./README.md)
- 💡 Examples: [EXAMPLES.md](./EXAMPLES.md)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/c4-gen/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/c4-gen/discussions)

---

**Happy documenting! 📝**
