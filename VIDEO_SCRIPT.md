# 🎬 c4-gen - Video Demo Script

## Video 1: Introduction (2-3 phút)

### Opening (10 giây)
```
[Screen: Logo c4-gen]
Narrator: "Bạn có bao giờ mất hàng giờ để đọc code của người khác?"
[Screen: Code scrolling nhanh]
"Hoặc phải viết tài liệu kiến trúc hệ thống?"
[Screen: Person looking frustrated]
```

### Problem (20 giây)
```
"c4-gen giải quyết vấn đề này bằng cách tự động tạo tài liệu 
kiến trúc C4 Model từ source code chỉ với 1 câu lệnh!"
[Screen: Terminal with c4-gen command]
```

### Demo (90 giây)
```
[Screen: Terminal]

# Bước 1: Install
$ npm install -g c4-gen
[Show installation]

# Bước 2: Get API key
[Screen: Browser - Google AI Studio]
"Lấy API key miễn phí từ Google AI Studio"
[Show copying API key]

# Bước 3: Init
[Screen: Terminal]
$ c4-gen init -k YOUR_API_KEY
✅ Đã lưu cấu hình API key thành công!

# Bước 4: Generate
$ cd my-nodejs-api
$ c4-gen generate

[Show progress:
🚀 Bắt đầu phân tích source code...
📂 Source: /home/user/my-api
📝 Output: /home/user/my-api/docs
🎯 Level: 3
📊 Đang quét cấu trúc source code...
✅ Đã quét 45 files
🤖 Đang kết nối đến Gemini AI...
📋 Đang sinh Level 1: Context Diagram...
📦 Đang sinh Level 2: Container Diagram...
🧩 Đang sinh Level 3: Component Diagram...
📝 Đang tạo file markdown...
✅ Hoàn thành!
]

# Bước 5: View results
$ cd docs
$ ls
[Show files: README.md, 01-context-diagram.md, etc.]

[Screen: VS Code - Open README.md]
[Scroll through beautiful markdown with diagrams]

[Screen: GitHub - Show rendered Mermaid diagrams]
```

### Features (30 giây)
```
[Screen: Feature highlights]
✅ AI-Powered Analysis
✅ 4 Levels C4 Model
✅ 13+ Programming Languages
✅ Beautiful Markdown Output
✅ Mermaid Diagrams
✅ Free & Open Source
```

### Call to Action (10 giây)
```
[Screen: GitHub repo]
"Star trên GitHub và bắt đầu sử dụng ngay hôm nay!"
"Link trong description!"

github.com/your-username/c4-gen
```

---

## Video 2: Deep Dive Tutorial (5-7 phút)

### Part 1: Setup (1 phút)
```
[Screen: Terminal split view]

Terminal 1: Installation
$ npm install -g c4-gen
$ c4-gen --version
1.0.0

Terminal 2: Get API Key
[Browser: makersuite.google.com]
- Click "Create API Key"
- Copy key
- Back to terminal

$ c4-gen init -k YOUR_KEY
✅ Success

$ c4-gen config
✅ API Key: AIzaSyB1x...
```

### Part 2: Basic Usage (2 phút)
```
[Screen: Real project]

Narrator: "Tôi có một Node.js Express API cần tài liệu"

[Show project structure]
my-api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js
└── package.json

[Terminal]
$ cd my-api
$ c4-gen generate

[Show generation process - real time]
[Wait 30 seconds]
✅ Done!

[Open docs folder]
$ cd docs
$ code .

[Show each file:
- README.md - overview
- 01-context-diagram.md - users, external systems
- 02-container-diagram.md - API, Database, etc.
- 03-component-diagram.md - Controllers, Services, etc.
]
```

### Part 3: Advanced Options (2 phút)
```
[Terminal]

# Custom output path
$ c4-gen generate -o ./architecture-docs

# Different levels
$ c4-gen generate -l 1  # Quick overview
$ c4-gen generate -l 4  # Full details

# Different project
$ c4-gen generate -p ../other-project -o ./docs/other

# Multiple services
$ for service in user-service order-service payment-service; do
    cd $service
    c4-gen generate -o ../docs/$service
    cd ..
  done
```

### Part 4: Real World Example (2 phút)
```
[Screen: Complex real project]

Narrator: "Đây là một microservices project thực tế"

[Show architecture:
- 5 services
- Shared libraries
- Multiple databases
]

[Terminal]
$ ./generate-all-docs.sh

[Script content shown]
#!/bin/bash
for service in services/*; do
  cd $service
  c4-gen generate -l 3 -o ../../docs/$(basename $service)
  cd ../..
done

[Show results]
docs/
├── user-service/
├── order-service/
├── payment-service/
├── notification-service/
└── analytics-service/

[Open one and review]
"Chất lượng tốt, chỉ cần review và adjust một chút"
```

### Closing (30 giây)
```
[Screen: Key takeaways]

Tips:
1. Run regularly when code changes
2. Review AI output
3. Combine with manual docs
4. Use in CI/CD
5. Share with team

[Screen: Links]
- GitHub: github.com/your-username/c4-gen
- Docs: Full documentation
- Examples: More examples
- Support: Issues & Discussions

"Don't forget to star! ⭐"
```

---

## Video 3: Behind The Scenes (3-5 phút)

### How It Works (2 phút)
```
[Screen: Architecture diagram of c4-gen itself]

1. Scanner
   - Reads all code files
   - Respects .gitignore
   - Collects structure

2. AI Analysis
   - Sends to Gemini AI
   - Smart prompts
   - Gets structured data

3. Generator
   - Processes AI response
   - Creates 4 C4 levels
   - Generates diagrams

4. Output
   - Beautiful markdown
   - Mermaid diagrams
   - Organized structure
```

### Code Walkthrough (2 phút)
```
[Screen: VS Code - c4-gen source]

[Show key files]
1. index.js - CLI entry
2. src/scanner.js - Code scanner
3. src/generator.js - AI integration
4. src/markdown.js - Output generator

[Explain prompts]
"Đây là prompt cho Context Diagram..."
[Show actual prompt in code]

"AI response format..."
[Show expected JSON structure]
```

### Contributing (1 phút)
```
[Screen: GitHub]

"Want to contribute?"

Easy tasks:
- Add language support
- Improve prompts
- Add tests
- Fix bugs
- Improve docs

[Show CONTRIBUTING.md]
"Full guide here"
```

---

## Social Media Clips (15-30 giây mỗi clip)

### Clip 1: Quick Demo
```
[Text overlay: "Generate architecture docs in 1 command"]
$ c4-gen generate
[Show progress bar]
✅ Done!
[Show beautiful output]
[Text: "Try it now - link in bio"]
```

### Clip 2: Before/After
```
Before:
[Show person reading code, confused]
"Hệ thống này hoạt động thế nào?"

After:
[Show person reading docs, happy]
"Á, clear rồi!"
[Text: "c4-gen - Auto docs with AI"]
```

### Clip 3: Features
```
[Quick cuts]
✅ 13+ languages
✅ AI-powered
✅ Free & Open Source
✅ Beautiful output
✅ 1 minute setup

[Text: "github.com/your-username/c4-gen"]
```

---

## Recording Tips

### Tools
- Screen recorder: OBS Studio / QuickTime
- Video editor: DaVinci Resolve / iMovie
- Terminal theme: Oh My Zsh with nice theme
- Code editor: VS Code with nice theme

### Settings
- Resolution: 1920x1080 (Full HD)
- Font size: Large enough to read (16-18pt)
- Terminal: Clear background, good contrast
- Speed: Not too fast, add pauses

### Voice Over
- Clear pronunciation
- Enthusiastic tone
- Pause at key moments
- Emphasize important points

### Music
- Background music: Upbeat but not distracting
- Lower volume during narration
- Fade in/out smoothly

### Captions
- Add Vietnamese captions
- Add English captions (separate version)
- Use large, readable font
- High contrast

### Publishing
- YouTube: Full tutorials
- TikTok/Shorts: 15-30 second clips
- LinkedIn: Professional version
- Twitter: Quick demos

---

## Thumbnail Ideas

### Thumbnail 1
```
[Background: Gradient blue/purple]
[Left: Code icon/image]
[Center: Arrow pointing right]
[Right: Document with checkmark]
[Text: "AUTO DOCS IN 1 COMMAND"]
[Bottom: "c4-gen | AI-Powered"]
```

### Thumbnail 2
```
[Background: Split screen]
[Left side - dark: Messy code]
[Right side - bright: Beautiful documentation]
[Text: "Before vs After"]
[Bottom: "c4-gen"]
```

### Thumbnail 3
```
[Background: Terminal screenshot]
[Large text overlay: "c4-gen generate"]
[Subtext: "That's it!"]
[Bottom corner: GitHub stars count]
```

---

**Good luck with your videos! 🎬**
