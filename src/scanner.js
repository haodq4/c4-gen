import fs from 'fs-extra';
import path from 'path';
import ignore from 'ignore';

const CODE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.go', '.rs',
  '.cpp', '.c', '.h', '.hpp',
  '.cs', '.php', '.rb', '.swift',
  '.kt', '.scala', '.dart'
];

const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'coverage',
  '__pycache__',
  '.next',
  '.nuxt',
  'target',
  'bin',
  'obj',
  'vendor',
  '.vscode',
  '.idea'
];

export async function scanSourceCode(sourcePath) {
  const ig = ignore().add(IGNORE_PATTERNS);
  
  // Đọc .gitignore nếu có
  const gitignorePath = path.join(sourcePath, '.gitignore');
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    ig.add(gitignoreContent);
  }
  
  const files = [];
  const structure = {};
  
  async function scan(dir, relativePath = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      // Bỏ qua file/folder theo pattern
      if (ig.ignores(relPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        structure[relPath] = { type: 'directory', children: {} };
        await scan(fullPath, relPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (CODE_EXTENSIONS.includes(ext)) {
          const stats = await fs.stat(fullPath);
          const content = await fs.readFile(fullPath, 'utf-8');
          const lines = content.split('\n').length;
          
          files.push({
            path: relPath,
            fullPath: fullPath,
            type: ext.substring(1),
            lines: lines,
            size: stats.size
          });
          
          structure[relPath] = {
            type: 'file',
            extension: ext,
            lines: lines
          };
        }
      }
    }
  }
  
  await scan(sourcePath);
  
  // Lấy sample code từ một số file quan trọng
  const sampleCode = await getSampleCode(files, sourcePath);
  const detailedCode = await getDetailedCode(files, sourcePath);
  
  // Đọc dependencies từ package.json, requirements.txt, etc
  const dependencies = await getDependencies(sourcePath);
  
  return {
    files,
    structure,
    sampleCode,
    detailedCode,
    dependencies,
    stats: {
      totalFiles: files.length,
      totalLines: files.reduce((sum, f) => sum + f.lines, 0),
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    }
  };
}

async function getSampleCode(files, sourcePath) {
  const samples = [];
  
  // Ưu tiên các file quan trọng - TĂNG LÊN
  const priorityFiles = files.filter(f => 
    f.path.includes('index') ||
    f.path.includes('main') ||
    f.path.includes('app') ||
    f.path.includes('server') ||
    f.path.includes('config') ||
    f.path.includes('route') ||
    f.path.includes('controller') ||
    f.path.includes('model')
  ).slice(0, 30); // Tăng từ 5 lên 30
  
  const filesToSample = priorityFiles.length > 0 ? priorityFiles : files.slice(0, 30);
  
  for (const file of filesToSample) {
    try {
      const content = await fs.readFile(file.fullPath, 'utf-8');
      const preview = content.split('\n').slice(0, 100).join('\n'); // Tăng từ 50 lên 100 lines
      samples.push(`\n--- ${file.path} ---\n${preview}\n`);
    } catch (error) {
      // Bỏ qua file lỗi
    }
  }
  
  return samples.join('\n');
}

async function getDetailedCode(files, sourcePath) {
  const samples = [];
  
  // Ưu tiên routes, controllers, services, models
  const importantFiles = files.filter(f => 
    f.path.includes('/routes/') ||
    f.path.includes('/controllers/') ||
    f.path.includes('/controller/') ||
    f.path.includes('/services/') ||
    f.path.includes('/service/') ||
    f.path.includes('/models/') ||
    f.path.includes('/model/') ||
    f.path.includes('/repositories/') ||
    f.path.includes('/repository/')
  );
  
  // ĐỌC TẤT CẢ files quan trọng - BỎ GIỚI HẠN
  const filesToRead = importantFiles.length > 0 
    ? importantFiles  // Đọc HẾT, không slice
    : files.slice(0, 100); // Nếu không có files quan trọng thì lấy 100 files đầu
  
  console.log(`📖 Đang đọc chi tiết ${filesToRead.length} files...`);
  
  for (const file of filesToRead) {
    try {
      const content = await fs.readFile(file.fullPath, 'utf-8');
      // Đọc TOÀN BỘ file, không truncate
      samples.push(`\n=== ${file.path} ===\n${content}\n`);
    } catch (error) {
      // Bỏ qua file lỗi
    }
  }
  
  return samples.join('\n');
}

// BATCH PROCESSING: Chia files thành nhiều batches để xử lý từng phần
export async function getDetailedCodeBatches(files, sourcePath) {
  // Phân loại files theo category
  const categories = {
    routes: [],
    controllers: [],
    services: [],
    models: [],
    repositories: [],
    middlewares: [],
    utils: [],
    config: [],
    others: []
  };
  
  for (const file of files) {
    const p = file.path.toLowerCase();
    if (p.includes('/route')) categories.routes.push(file);
    else if (p.includes('/controller')) categories.controllers.push(file);
    else if (p.includes('/service')) categories.services.push(file);
    else if (p.includes('/model')) categories.models.push(file);
    else if (p.includes('/repositor')) categories.repositories.push(file);
    else if (p.includes('/middleware')) categories.middlewares.push(file);
    else if (p.includes('/util') || p.includes('/helper')) categories.utils.push(file);
    else if (p.includes('/config') || p.includes('/constant')) categories.config.push(file);
    else categories.others.push(file);
  }
  
  // Tạo batches, với SUB-BATCHING nếu quá lớn
  const batches = [];
  const MAX_BATCH_SIZE = 200000; // Giảm từ 500K xuống 200K để AI phân tích kỹ hơn
  
  for (const [categoryName, categoryFiles] of Object.entries(categories)) {
    if (categoryFiles.length === 0) continue;
    
    // Đọc content của category
    const categoryContent = [];
    for (const file of categoryFiles) {
      try {
        const content = await fs.readFile(file.fullPath, 'utf-8');
        categoryContent.push({ file, content });
      } catch (error) {
        // Skip error files
      }
    }
    
    if (categoryContent.length === 0) continue;
    
    // Chia nhỏ nếu category quá lớn
    let currentBatch = [];
    let currentSize = 0;
    let batchIndex = 1;
    
    for (const item of categoryContent) {
      const itemSize = item.content.length;
      
      if (currentSize + itemSize > MAX_BATCH_SIZE && currentBatch.length > 0) {
        // Flush current batch
        const batchContent = currentBatch.map(b => `\n=== ${b.file.path} ===\n${b.content}\n`).join('\n');
        batches.push({
          name: categoryFiles.length > 10 ? `${categoryName}-${batchIndex}` : categoryName,
          fileCount: currentBatch.length,
          content: batchContent
        });
        
        currentBatch = [];
        currentSize = 0;
        batchIndex++;
      }
      
      currentBatch.push(item);
      currentSize += itemSize;
    }
    
    // Flush remaining
    if (currentBatch.length > 0) {
      const batchContent = currentBatch.map(b => `\n=== ${b.file.path} ===\n${b.content}\n`).join('\n');
      batches.push({
        name: batchIndex > 1 ? `${categoryName}-${batchIndex}` : categoryName,
        fileCount: currentBatch.length,
        content: batchContent
      });
    }
  }
  
  return batches;
}

async function getDependencies(sourcePath) {
  const deps = {};
  
  // package.json (Node.js)
  const packageJsonPath = path.join(sourcePath, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const pkg = await fs.readJson(packageJsonPath);
      deps.npm = {
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {}
      };
    } catch (error) {
      // Ignore
    }
  }
  
  // requirements.txt (Python)
  const reqPath = path.join(sourcePath, 'requirements.txt');
  if (await fs.pathExists(reqPath)) {
    try {
      const content = await fs.readFile(reqPath, 'utf-8');
      deps.python = content.split('\n').filter(line => line.trim());
    } catch (error) {
      // Ignore
    }
  }
  
  // pom.xml (Java/Maven)
  const pomPath = path.join(sourcePath, 'pom.xml');
  if (await fs.pathExists(pomPath)) {
    deps.maven = 'Found pom.xml';
  }
  
  // build.gradle (Java/Gradle)
  const gradlePath = path.join(sourcePath, 'build.gradle');
  if (await fs.pathExists(gradlePath)) {
    deps.gradle = 'Found build.gradle';
  }
  
  return deps;
}
