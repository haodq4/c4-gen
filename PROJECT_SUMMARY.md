# c4-gen - Project Summary

## 📋 Tổng Quan

**c4-gen** là một CLI tool open-source giúp tự động sinh tài liệu kiến trúc hệ thống theo mô hình C4 Model từ source code, sử dụng AI (Google Gemini) để phân tích code và tạo tài liệu markdown chi tiết.

## 🎯 Mục Tiêu

- ✅ Giúp developer hiểu nhanh cấu trúc project mà không cần đọc code
- ✅ Tự động hóa việc tạo tài liệu kiến trúc
- ✅ Hỗ trợ onboarding cho team member mới
- ✅ Duy trì tài liệu luôn sync với code

## 📦 Cấu Trúc Project

```
c4-gen/
├── index.js                 # CLI entry point
├── package.json             # Package configuration
├── src/
│   ├── config.js           # Config management (lưu API key)
│   ├── scanner.js          # Quét source code
│   ├── generator.js        # Core logic - gọi AI và tạo docs
│   └── markdown.js         # Generate markdown files
├── README.md               # Documentation chính
├── QUICKSTART.md           # Hướng dẫn nhanh
├── EXAMPLES.md             # Ví dụ chi tiết
├── CONTRIBUTING.md         # Hướng dẫn contribute
├── PUBLISH_GUIDE.md        # Hướng dẫn publish lên NPM/GitHub
├── CHANGELOG.md            # Lịch sử thay đổi
├── LICENSE                 # MIT License
├── .gitignore              # Git ignore rules
└── setup.sh                # Setup script cho development
```

## 🔧 Các Component Chính

### 1. CLI (index.js)
- Xử lý command line arguments
- Commands: `init`, `generate`, `config`
- Sử dụng Commander.js

### 2. Config Manager (src/config.js)
- Lưu/đọc API key vào `~/.c4-gen/config.json`
- Secure storage cho credentials

### 3. Scanner (src/scanner.js)
- Quét recursively toàn bộ source code
- Filter theo extension (.js, .py, .java, etc.)
- Respect .gitignore patterns
- Thu thập metadata: files, structure, dependencies

### 4. Generator (src/generator.js)
- Core logic chính
- Gọi Gemini AI với prompts được optimize
- Generate 4 levels của C4 Model:
  - Level 1: Context Diagram
  - Level 2: Container Diagram
  - Level 3: Component Diagram
  - Level 4: Code Diagram

### 5. Markdown Generator (src/markdown.js)
- Convert AI responses thành markdown
- Tạo Mermaid diagrams
- Organize files theo structure rõ ràng

## 🚀 Workflow

```
User runs command
       ↓
CLI parses arguments
       ↓
Scanner quét source code
       ↓
Generator gọi AI để phân tích
       ↓
AI trả về structured data
       ↓
Markdown Generator tạo docs
       ↓
Output: Markdown files với diagrams
```

## 🎨 Features

### ✅ Đã Implement

1. **Multi-language support**: 13+ ngôn ngữ
2. **4 C4 Levels**: Full C4 Model
3. **AI-powered**: Gemini AI integration
4. **CLI interface**: Easy to use
5. **Markdown output**: Clean documentation
6. **Mermaid diagrams**: Visual representations
7. **Config management**: Persistent API key
8. **Dependency detection**: package.json, requirements.txt, etc.
9. **Smart filtering**: .gitignore support

### 🔜 Roadmap (Future)

- [ ] Custom ignore patterns (.c4genignore)
- [ ] Multiple AI providers (OpenAI, Claude)
- [ ] Progress bar
- [ ] Verbose/debug mode
- [ ] Cache AI responses
- [ ] Incremental updates
- [ ] HTML/PDF export
- [ ] Interactive mode
- [ ] VS Code extension
- [ ] Web UI
- [ ] Unit tests
- [ ] Integration tests

## 📊 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **CLI Framework**: Commander.js
- **AI**: Google Gemini AI (@google/generative-ai)
- **File System**: fs-extra
- **Patterns**: ignore (gitignore parser)
- **Documentation**: Markdown + Mermaid

## 🎯 Target Users

1. **Solo Developers**: Document personal projects
2. **Teams**: Onboarding, knowledge sharing
3. **Open Source Maintainers**: Auto-generate architecture docs
4. **Consultants**: Quick understanding of client codebases
5. **Students**: Learn from existing codebases

## 📈 Metrics (After Launch)

Track these metrics:
- NPM downloads
- GitHub stars
- GitHub forks
- Issues opened/closed
- Pull requests
- Contributors

## 🔑 Success Criteria

- [ ] 100+ NPM downloads/month
- [ ] 50+ GitHub stars
- [ ] 5+ contributors
- [ ] Used in 10+ real projects
- [ ] Positive feedback from users

## 🚀 Next Steps

### For Development:
1. Run `./setup.sh` để setup
2. Test với real projects
3. Fix bugs nếu có
4. Add tests

### For Publishing:
1. Update package.json với thông tin thật
2. Test thoroughly
3. Follow PUBLISH_GUIDE.md
4. Publish to NPM
5. Create GitHub release
6. Promote on social media

### For Maintenance:
1. Monitor issues
2. Respond to questions
3. Review PRs
4. Release updates
5. Keep dependencies updated

## 📞 Contact & Links

- **GitHub**: https://github.com/your-username/c4-gen
- **NPM**: https://www.npmjs.com/package/c4-gen (sau khi publish)
- **Issues**: https://github.com/your-username/c4-gen/issues
- **Discussions**: https://github.com/your-username/c4-gen/discussions

## 🙏 Acknowledgments

- [C4 Model](https://c4model.com/) by Simon Brown
- [Google Gemini AI](https://ai.google.dev/)
- [Mermaid](https://mermaid.js.org/)
- Open source community

## 📝 License

MIT License - See LICENSE file

---

**Status**: ✅ Ready for testing and publishing
**Version**: 1.0.0
**Last Updated**: March 19, 2026
