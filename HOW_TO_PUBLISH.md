# 🚀 Hướng Dẫn Publish c4-gen

## ✅ Checklist Trước Khi Publish

- [x] Code hoạt động tốt
- [x] Đã test với real API key
- [x] Đã dọn dẹp test files
- [ ] **Cập nhật thông tin cá nhân trong package.json**
- [ ] Tạo GitHub repository
- [ ] Publish lên NPM

---

## 📝 Bước 1: Cập Nhật package.json

**Sửa file `package.json` các thông tin sau:**

```json
{
  "author": "Tên Của Bạn <email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/USERNAME/c4-gen.git"
  },
  "bugs": {
    "url": "https://github.com/USERNAME/c4-gen/issues"
  },
  "homepage": "https://github.com/USERNAME/c4-gen#readme"
}
```

**Thay thế:**
- `Tên Của Bạn` → Tên thật của bạn
- `email@example.com` → Email của bạn  
- `USERNAME` → GitHub username của bạn

---

## 🐙 Bước 2: Tạo GitHub Repository

### 2.1. Tạo Repo Trên GitHub

1. Vào: https://github.com/new
2. **Repository name**: `c4-gen`
3. **Description**: "AI-powered tool to auto-generate C4 Model architecture documentation from source code"
4. **Public**
5. **KHÔNG** check "Initialize with README" (đã có sẵn)
6. Click **"Create repository"**

### 2.2. Push Code Lên GitHub

```bash
cd /home/haodq5/haodq5/repository-personal/c4-gen

# Initialize git (nếu chưa có)
git init

# Add remote
git remote add origin https://github.com/USERNAME/c4-gen.git

# Add all files
git add .

# Commit
git commit -m "feat: initial release v1.1.0 - AI-powered C4 Model documentation generator"

# Push
git branch -M main
git push -u origin main
```

---

## 📦 Bước 3: Publish Lên NPM

### 3.1. Tạo NPM Account (nếu chưa có)

1. Vào: https://www.npmjs.com/signup
2. Tạo account (miễn phí)
3. Verify email

### 3.2. Login NPM CLI

```bash
npm login
```

Nhập:
- Username
- Password
- Email
- OTP (nếu có 2FA)

### 3.3. Kiểm Tra Trước Khi Publish

```bash
# Dry run - xem sẽ publish những gì
npm publish --dry-run

# Kiểm tra tên package có bị trùng không
npm search c4-gen
```

**Nếu tên `c4-gen` đã bị trùng:**

Option 1: Đổi tên trong package.json
```json
{
  "name": "@USERNAME/c4-gen"
}
```

Option 2: Dùng tên khác
```json
{
  "name": "c4-documentation-generator"
}
```

### 3.4. Publish!

```bash
# Publish public package
npm publish --access public

# Nếu dùng scoped package (@username/c4-gen)
npm publish --access public
```

---

## ✅ Bước 4: Verify Installation

### Test Install Global

```bash
# Unlink local version
npm unlink c4-gen

# Install from NPM
npm install -g c4-gen

# Verify
c4-gen --version
c4-gen --help

# Test
c4-gen init -k YOUR_API_KEY
c4-gen generate -l 1
```

### Test Install Local

```bash
# Tạo folder test
mkdir /tmp/test-c4-gen
cd /tmp/test-c4-gen

# Install
npm install c4-gen

# Test
npx c4-gen --help
```

---

## 🎯 Bước 5: Post-Publish Tasks

### 5.1. Create GitHub Release

1. Vào: https://github.com/USERNAME/c4-gen/releases
2. Click **"Create a new release"**
3. **Tag**: `v1.1.0`
4. **Title**: `v1.1.0 - Initial Release`
5. **Description**:

```markdown
## 🎉 Initial Release

### Features
- ✅ AI-powered C4 Model generation using Google Gemini
- ✅ Support for 4 C4 levels: Context, Container, Component, Code
- ✅ Multi-language source code support (13+ languages)
- ✅ Markdown output with Mermaid diagrams
- ✅ Smart data chunking to avoid API limits
- ✅ Automatic retry with error handling
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

See [README.md](https://github.com/USERNAME/c4-gen#readme) for full documentation.
```

6. Click **"Publish release"**

### 5.2. Update README Badges

Update README.md với NPM package name thật:

```markdown
[![NPM Version](https://img.shields.io/npm/v/c4-gen.svg)](https://www.npmjs.com/package/c4-gen)
[![Downloads](https://img.shields.io/npm/dm/c4-gen.svg)](https://www.npmjs.com/package/c4-gen)
[![License](https://img.shields.io/npm/l/c4-gen.svg)](https://github.com/USERNAME/c4-gen/blob/main/LICENSE)
```

### 5.3. Add GitHub Topics

1. Vào repository homepage
2. Click ⚙️ bên cạnh "About"
3. Add topics:
   - `c4-model`
   - `documentation`
   - `architecture`
   - `ai`
   - `gemini`
   - `cli`
   - `nodejs`
   - `markdown`
   - `mermaid`

---

## 🎊 Hoàn Thành!

Package của bạn giờ có thể được install bởi bất kỳ ai:

```bash
npm install -g c4-gen
```

Hoặc với scoped package:

```bash
npm install -g @USERNAME/c4-gen
```

---

## 📈 Next Steps

1. **Share**: Tweet, post on LinkedIn, Reddit
2. **Submit**: Add to awesome-nodejs, awesome-documentation lists
3. **Monitor**: Check NPM stats, GitHub stars
4. **Maintain**: Respond to issues, accept PRs
5. **Update**: Release new versions when needed

---

## 🔄 Để Update Version Sau Này

```bash
# Update version
npm version patch  # 1.1.0 -> 1.1.1
# hoặc
npm version minor  # 1.1.0 -> 1.2.0
# hoặc
npm version major  # 1.1.0 -> 2.0.0

# Commit
git add .
git commit -m "chore: bump version to $(node -p "require('./package.json').version")"

# Push with tags
git push --follow-tags

# Publish
npm publish
```

---

**Good luck! 🚀**
