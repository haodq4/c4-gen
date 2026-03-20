import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.c4-gen');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function loadConfig() {
  try {
    await fs.ensureDir(CONFIG_DIR);
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJson(CONFIG_FILE);
    }
    return {};
  } catch (error) {
    console.error('Lỗi khi đọc config:', error.message);
    return {};
  }
}

export async function saveConfig(config) {
  try {
    await fs.ensureDir(CONFIG_DIR);
    const existingConfig = await loadConfig();
    const newConfig = { ...existingConfig, ...config };
    await fs.writeJson(CONFIG_FILE, newConfig, { spaces: 2 });
  } catch (error) {
    console.error('Lỗi khi lưu config:', error.message);
    throw error;
  }
}
