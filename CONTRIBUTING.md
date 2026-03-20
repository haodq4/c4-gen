# Contributing to c4-gen

Cảm ơn bạn đã quan tâm đến việc đóng góp cho c4-gen! 🎉

## 🚀 Bắt Đầu

### Prerequisites

- Node.js >= 16.0.0
- npm hoặc yarn
- Git

### Setup Development Environment

```bash
# 1. Fork repository trên GitHub

# 2. Clone fork của bạn
git clone https://github.com/YOUR_USERNAME/c4-gen.git
cd c4-gen

# 3. Cài đặt dependencies
npm install

# 4. Tạo branch mới
git checkout -b feature/my-new-feature

# 5. Test tool locally
npm link
c4-gen --help
```

## 📝 Guidelines

### Code Style

- Sử dụng ES6+ syntax
- Sử dụng async/await thay vì callbacks
- Comments bằng tiếng Việt hoặc tiếng Anh
- Naming: camelCase cho variables/functions, PascalCase cho classes

### Commit Messages

Sử dụng format:

```
<type>: <subject>

<body>
```

Types:
- `feat`: Tính năng mới
- `fix`: Bug fix
- `docs`: Cập nhật documentation
- `style`: Format code, không thay đổi logic
- `refactor`: Refactor code
- `test`: Thêm tests
- `chore`: Cập nhật build, dependencies

Ví dụ:
```
feat: add support for Ruby language

- Add .rb extension to scanner
- Update documentation
```

### Pull Request Process

1. **Update Documentation**: Cập nhật README.md nếu thêm feature mới
2. **Test**: Đảm bảo tool hoạt động với ít nhất 2-3 loại project
3. **Description**: Mô tả rõ ràng thay đổi trong PR
4. **Screenshots**: Thêm screenshots nếu có UI changes

## 🎯 Areas to Contribute

### High Priority

- [ ] Thêm support cho nhiều ngôn ngữ hơn
- [ ] Thêm tests (unit tests, integration tests)
- [ ] Cải thiện AI prompts để kết quả chính xác hơn
- [ ] Thêm support cho nhiều AI providers (OpenAI, Claude, etc.)
- [ ] Tối ưu performance cho large codebases

### Medium Priority

- [ ] Custom ignore patterns (.c4genignore)
- [ ] Verbose/debug mode
- [ ] Progress bar
- [ ] Export to other formats (PDF, HTML)
- [ ] Interactive mode

### Nice to Have

- [ ] Web UI
- [ ] VS Code extension
- [ ] Cache AI responses
- [ ] Incremental updates
- [ ] Custom templates

## 🧪 Testing

### Manual Testing

```bash
# Test với Node.js project
cd /path/to/nodejs-project
c4-gen generate -l 2

# Test với Python project
cd /path/to/python-project
c4-gen generate -l 3

# Test error cases
c4-gen generate -p /nonexistent/path
c4-gen generate  # without API key
```

### Future: Automated Testing

Chúng ta sẽ thêm automated tests trong tương lai:

```bash
npm test
```

## 🐛 Bug Reports

Khi report bug, hãy bao gồm:

1. **Version**: `c4-gen --version`
2. **Command**: Command đã chạy
3. **Expected**: Kết quả mong đợi
4. **Actual**: Kết quả thực tế
5. **Environment**: OS, Node version
6. **Logs**: Error logs nếu có

Template:
```markdown
**Version**: 1.0.0
**Command**: `c4-gen generate -l 3`
**Expected**: Generate 3 levels
**Actual**: Error "API key not found"
**Environment**: Ubuntu 22.04, Node 18.0.0
**Logs**: 
\`\`\`
Error: API key not found
  at ...
\`\`\`
```

## 💡 Feature Requests

Khi đề xuất feature mới:

1. **Use Case**: Mô tả use case cụ thể
2. **Proposal**: Đề xuất implementation
3. **Examples**: Ví dụ usage
4. **Alternatives**: Các phương án khác đã cân nhắc

## 📚 Documentation

Các loại documentation cần update:

- `README.md`: Overview, installation, basic usage
- `EXAMPLES.md`: Detailed examples
- `CONTRIBUTING.md`: Contribution guidelines (file này)
- Code comments: Giải thích logic phức tạp

## 🏗️ Project Structure

```
c4-gen/
├── index.js              # CLI entry point
├── src/
│   ├── config.js        # Config management
│   ├── generator.js     # Core generation logic
│   ├── scanner.js       # Source code scanner
│   └── markdown.js      # Markdown generator
├── package.json
├── README.md
├── EXAMPLES.md
├── CONTRIBUTING.md
└── LICENSE
```

## 🎨 Adding Language Support

Để thêm support cho ngôn ngữ mới:

1. Update `CODE_EXTENSIONS` in `src/scanner.js`:
```javascript
const CODE_EXTENSIONS = [
  // ... existing
  '.your-ext'  // Add your extension
];
```

2. Update README.md với ngôn ngữ mới

3. Test với project thực tế

## 🔧 Development Tips

### Debug AI Responses

```javascript
// In src/generator.js
const result = await model.generateContent(prompt);
const response = result.response.text();
console.log('AI Response:', response);  // Debug
```

### Test Different Projects

Chuẩn bị các sample projects:
```
test-projects/
├── nodejs-express/
├── python-django/
├── java-spring/
└── go-api/
```

### Performance Profiling

```javascript
console.time('Scanning');
await scanSourceCode(sourcePath);
console.timeEnd('Scanning');
```

## 📞 Questions?

- Open an issue với label `question`
- Email: your-email@example.com
- Discussions: GitHub Discussions

## 🙏 Recognition

Contributors sẽ được thêm vào:
- README.md Contributors section
- GitHub contributors page

Cảm ơn đã đóng góp! ❤️
