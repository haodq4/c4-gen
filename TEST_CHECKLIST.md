# Test Checklist cho c4-gen

## ✅ Pre-Publish Tests

### 1. Installation Test

- [ ] Clone repo mới
- [ ] Run `npm install`
- [ ] Run `npm link`
- [ ] Verify `c4-gen --help` works

### 2. Command Tests

#### Init Command
- [ ] `c4-gen init -k test-api-key`
- [ ] Verify config saved to `~/.c4-gen/config.json`
- [ ] `c4-gen config` shows masked API key

#### Generate Command
- [ ] `c4-gen generate --help` shows options
- [ ] Test without API key → should show error
- [ ] Test with API key but invalid path → should show error

### 3. Real Project Tests

#### Test với Node.js Project
```bash
cd /path/to/nodejs-project
c4-gen generate -o ./test-docs -l 2
```
- [ ] Docs generated successfully
- [ ] README.md created
- [ ] Level 1 and 2 files created
- [ ] Mermaid diagrams present
- [ ] Content makes sense

#### Test với Python Project
```bash
cd /path/to/python-project
c4-gen generate -o ./test-docs -l 2
```
- [ ] Works with Python files
- [ ] requirements.txt detected
- [ ] Appropriate analysis

#### Test với Other Languages
- [ ] Java project
- [ ] Go project
- [ ] TypeScript project

### 4. Options Tests

#### Path Option
```bash
c4-gen generate -p /specific/path -o ./docs
```
- [ ] Uses specified path
- [ ] Creates docs in specified output

#### Level Option
```bash
# Level 1
c4-gen generate -l 1 -o ./docs-l1

# Level 2
c4-gen generate -l 2 -o ./docs-l2

# Level 3
c4-gen generate -l 3 -o ./docs-l3

# Level 4
c4-gen generate -l 4 -o ./docs-l4
```
- [ ] Level 1: Only context diagram
- [ ] Level 2: Context + container
- [ ] Level 3: Context + container + component
- [ ] Level 4: All 4 levels

#### API Key Override
```bash
c4-gen generate -k DIFFERENT_KEY -o ./docs
```
- [ ] Uses provided key instead of config

### 5. Edge Cases

- [ ] Empty directory → should show error
- [ ] Directory with only non-code files → should show error
- [ ] Very large codebase (1000+ files) → should handle gracefully
- [ ] Special characters in filenames → should handle
- [ ] Nested directories (deep structure) → should scan properly

### 6. Output Quality

- [ ] Markdown is valid
- [ ] Mermaid diagrams are syntactically correct
- [ ] Content is relevant to the code
- [ ] No AI hallucinations (major ones)
- [ ] Links work
- [ ] Formatting is consistent

### 7. Error Handling

- [ ] Invalid API key → clear error message
- [ ] Network error → graceful handling
- [ ] AI rate limit → informative error
- [ ] Permission denied → clear error
- [ ] Disk full → graceful error

### 8. Performance

- [ ] Small project (< 50 files): < 30 seconds
- [ ] Medium project (50-200 files): < 2 minutes
- [ ] Large project (200-500 files): < 5 minutes

### 9. Documentation

- [ ] README.md is clear and complete
- [ ] QUICKSTART.md is easy to follow
- [ ] EXAMPLES.md has working examples
- [ ] All links work
- [ ] No typos

### 10. Package

- [ ] package.json is complete
- [ ] All dependencies are necessary
- [ ] No dev dependencies in dependencies
- [ ] License file present
- [ ] .gitignore is appropriate

## 🚀 Post-Publish Tests

### NPM Package

- [ ] `npm install -g c4-gen` works
- [ ] Command available globally
- [ ] Version matches package.json
- [ ] Package size is reasonable

### GitHub

- [ ] Repository is public
- [ ] README displays correctly
- [ ] Topics are set
- [ ] License displays
- [ ] Issues enabled
- [ ] Discussions enabled (optional)

### Integration

- [ ] Works on Linux
- [ ] Works on macOS
- [ ] Works on Windows (if applicable)
- [ ] Works with different Node versions

## 🐛 Known Issues to Document

- [ ] List any limitations
- [ ] List known bugs
- [ ] List unsupported features
- [ ] List workarounds

## 📝 Testing Log

Date: ___________

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Installation | ☐ | |
| Init command | ☐ | |
| Generate command | ☐ | |
| Node.js project | ☐ | |
| Python project | ☐ | |
| Output quality | ☐ | |
| Error handling | ☐ | |

### Issues Found

1. 
2. 
3. 

### Fixes Applied

1. 
2. 
3. 

### Ready for Publish?

- [ ] All critical tests pass
- [ ] Documentation is complete
- [ ] No major bugs
- [ ] Performance is acceptable

**Tester**: ___________
**Date**: ___________
**Signature**: ___________
