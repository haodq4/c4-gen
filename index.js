#!/usr/bin/env node

import { Command } from 'commander';
import { generateC4Documentation } from './src/generator.js';
import { loadConfig, saveConfig } from './src/config.js';
import fs from 'fs-extra';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const packageJson = require('./package.json');

const program = new Command();

program
  .name('c4-gen')
  .description('Công cụ tự động sinh tài liệu kiến trúc C4 Model từ source code')
  .version(packageJson.version);

program
  .command('init')
  .description('Khởi tạo cấu hình API key')
  .option('-k, --key <key>', 'Gemini API key')
  .action(async (options) => {
    if (!options.key) {
      console.error('❌ Vui lòng cung cấp API key: c4-gen init -k YOUR_API_KEY');
      process.exit(1);
    }
    
    await saveConfig({ apiKey: options.key });
    console.log('✅ Đã lưu cấu hình API key thành công!');
  });

program
  .command('generate')
  .description('Sinh tài liệu C4 Model từ source code')
  .option('-p, --path <path>', 'Đường dẫn đến source code', process.cwd())
  .option('-o, --output <output>', 'Thư mục output cho tài liệu', './docs')
  .option('-k, --key <key>', 'Gemini API key (override config)')
  .option('-l, --level <level>', 'Mức độ chi tiết (1-4): 1=Context, 2=Container, 3=Component, 4=Code', '3')
  .action(async (options) => {
    try {
      const config = await loadConfig();
      const apiKey = options.key || config.apiKey;
      
      if (!apiKey) {
        console.error('❌ Chưa cấu hình API key. Chạy: c4-gen init -k YOUR_API_KEY');
        process.exit(1);
      }

      const sourcePath = path.resolve(options.path);
      const outputPath = path.resolve(options.output);
      
      if (!fs.existsSync(sourcePath)) {
        console.error(`❌ Không tìm thấy đường dẫn: ${sourcePath}`);
        process.exit(1);
      }

      console.log('🚀 Bắt đầu phân tích source code...');
      console.log(`📂 Source: ${sourcePath}`);
      console.log(`📝 Output: ${outputPath}`);
      console.log(`🎯 Level: ${options.level}`);
      
      await generateC4Documentation({
        sourcePath,
        outputPath,
        apiKey,
        level: parseInt(options.level)
      });
      
      console.log('✅ Hoàn thành! Tài liệu đã được tạo tại:', outputPath);
    } catch (error) {
      console.error('❌ Lỗi:', error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Xem cấu hình hiện tại')
  .action(async () => {
    const config = await loadConfig();
    if (config.apiKey) {
      console.log('✅ API Key:', `${config.apiKey.substring(0, 10)}...`);
    } else {
      console.log('⚠️  Chưa cấu hình API key');
    }
  });

program.parse();
