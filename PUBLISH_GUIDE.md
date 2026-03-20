# Hướng Dẫn Publish lên NPM và GitHub

## 📋 Checklist Trước Khi Publish

- [ ] Code hoạt động tốt
- [ ] README.md đầy đủ
- [ ] LICENSE file có sẵn
- [ ] .gitignore đã setup
- [ ] package.json đã update đầy đủ
- [ ] Test trên ít nhất 2-3 loại project khác nhau

## 🔧 Bước 1: Cập Nhật package.json

Đảm bảo các thông tin sau đã chính xác:

```json
{
  "name": "c4-gen",
  "version": "1.0.0",
  "author": "Your Name <your-email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/c4-gen.git"
  }
}
```

Thay thế:
- `Your Name` → Tên thật của bạn
- `your-email@example.com` → Email của bạn
- `your-username` → GitHub username của bạn

## 📦 Bước 2: Publish lên NPM

### 2.1. Tạo NPM Account

1. Truy cập https://www.npmjs.com/signup
2. Tạo account (miễn phí)
3. Verify email

### 2.2. Login NPM CLI

```bash
npm login
```

Nhập:
- Username
- Password
- Email
- OTP (nếu có 2FA)

### 2.3. Test Local

```bash
# Link package locally
npm link

# Test
c4-gen --help
c4-gen init -k test-key
```

### 2.4. Publish

```bash
# Dry run (kiểm tra trước)
npm publish --dry-run

# Publish thật
npm publish
```

Nếu tên `c4-gen` đã bị trùng, bạn có thể:

1. **Đổi tên trong package.json**:
```json
{
  "name": "@your-username/c4-gen"
}
```

2. **Publish scoped package**:
```bash
npm publish --access public
```

## 🐙 Bước 3: Publish lên GitHub

### 3.1. Tạo Repository

1. Truy cập https://github.com/new
2. Repository name: `c4-gen`
3. Description: "Công cụ tự động sinh tài liệu kiến trúc C4 Model từ source code sử dụng AI"
4. Public
5. **KHÔNG** check "Initialize with README" (vì đã có sẵn)
6. Click "Create repository"

### 3.2. Push Code

```bash
# Initialize git (nếu chưa)
git init

# Add remote
git remote add origin https://github.com/your-username/c4-gen.git

# Add files
git add .

# Commit
git commit -m "Initial commit: c4-gen v1.0.0"

# Push
git branch -M main
git push -u origin main
```

### 3.3. Create Release

1. Truy cập https://github.com/your-username/c4-gen/releases
2. Click "Create a new release"
3. Tag: `v1.0.0`
4. Title: `v1.0.0 - Initial Release`
5. Description:
```markdown
## 🎉 Initial Release

### Features
- ✅ AI-powered C4 Model generation
- ✅ Support for 4 levels: Context, Container, Component, Code
- ✅ Multiple programming languages support
- ✅ Markdown output with Mermaid diagrams
- ✅ Easy CLI interface

### Installation
\`\`\`bash
npm install -g c4-gen
\`\`\`

### Quick Start
\`\`\`bash
c4-gen init -k YOUR_GEMINI_API_KEY
c4-gen generate
\`\`\`
```
6. Click "Publish release"

## 🏷️ Bước 4: Setup GitHub Topics

1. Truy cập repository homepage
2. Click ⚙️ bên cạnh "About"
3. Thêm topics:
   - `c4-model`
   - `documentation`
   - `architecture`
   - `ai`
   - `gemini`
   - `cli`
   - `nodejs`
   - `markdown`

## 📝 Bước 5: Update README Badges

Update README.md với URL thật:

```markdown
[![NPM Version](https://img.shields.io/npm/v/c4-gen.svg)](https://www.npmjs.com/package/c4-gen)
[![Downloads](https://img.shields.io/npm/dm/c4-gen.svg)](https://www.npmjs.com/package/c4-gen)
[![License](https://img.shields.io/npm/l/c4-gen.svg)](https://github.com/your-username/c4-gen/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/your-username/c4-gen.svg)](https://github.com/your-username/c4-gen/stargazers)
```

Commit và push:
```bash
git add README.md
git commit -m "docs: update badges with real URLs"
git push
```

## 🔄 Bước 6: Publish Updates Sau Này

Khi có updates:

```bash
# 1. Update version trong package.json
# Sử dụng semantic versioning:
# - Major (1.0.0 → 2.0.0): Breaking changes
# - Minor (1.0.0 → 1.1.0): New features, backward compatible
# - Patch (1.0.0 → 1.0.1): Bug fixes

npm version patch  # hoặc minor, major

# 2. Commit
git add .
git commit -m "chore: bump version to 1.0.1"

# 3. Push with tags
git push --follow-tags

# 4. Publish to NPM
npm publish

# 5. Create GitHub release
# Làm thủ công trên GitHub UI hoặc dùng GitHub CLI:
gh release create v1.0.1 --title "v1.0.1" --notes "Bug fixes"
```

## 🎯 Marketing & Promotion

### 1. Social Media

Share trên:
- Twitter/X với hashtags: #opensource #nodejs #c4model #documentation
- LinkedIn
- Dev.to / Medium (viết blog post)
- Reddit: r/node, r/programming

### 2. GitHub

- Add to awesome lists: awesome-nodejs, awesome-documentation
- Share trong GitHub discussions
- Comment trong related issues của other projects

### 3. NPM

- Package tự động xuất hiện trên npmjs.com
- Optimize keywords trong package.json

## 📊 Track Success

### NPM Stats
```bash
npm info c4-gen
```

Hoặc xem tại: https://www.npmjs.com/package/c4-gen

### GitHub Stats

- Stars
- Forks
- Issues
- Pull Requests
- Contributors

## 🐛 Maintain Package

### Handle Issues

1. Label issues: `bug`, `enhancement`, `question`, `help wanted`
2. Respond trong 24-48h
3. Close resolved issues

### Update Dependencies

```bash
# Check outdated
npm outdated

# Update
npm update

# Test
npm test
```

### Security

```bash
# Audit
npm audit

# Fix
npm audit fix
```

## 🎓 Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Package published on NPM
- [ ] Release created on GitHub
- [ ] README has correct badges and links
- [ ] Topics added to GitHub repo
- [ ] Shared on social media
- [ ] Monitoring stats

🎉 Congratulations! Your package is now live!
