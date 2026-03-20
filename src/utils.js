// ============ HELPER FUNCTIONS FOR GENERATOR ============

// Truncate text để tránh vượt quá token limit
export function truncateText(text, maxChars) {
  if (!text || text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '\n... (đã rút gọn để tránh vượt quá context limit)';
}

// Summarize structure thay vì JSON.stringify toàn bộ
export function summarizeStructure(structure) {
  const summary = [];
  const dirs = Object.keys(structure).filter(k => structure[k].type === 'directory');
  const files = Object.keys(structure).filter(k => structure[k].type === 'file');
  
  summary.push(`Folders (${dirs.length}):`);
  dirs.slice(0, 20).forEach(dir => {
    summary.push(`  - ${dir}/`);
  });
  if (dirs.length > 20) {
    summary.push(`  ... and ${dirs.length - 20} more folders`);
  }
  
  summary.push(`\nFiles (${files.length} total, showing first 30):`);
  files.slice(0, 30).forEach(file => {
    const info = structure[file];
    summary.push(`  - ${file} (${info.lines || 0} lines)`);
  });
  if (files.length > 30) {
    summary.push(`  ... and ${files.length - 30} more files`);
  }
  
  return summary.join('\n');
}

// Group files theo type để dễ hiểu
export function groupFilesByType(files) {
  const groups = {};
  files.forEach(f => {
    const type = f.type || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(f.path);
  });
  
  const result = [];
  Object.keys(groups).sort().forEach(type => {
    result.push(`\n${type.toUpperCase()}: ${groups[type].length} files`);
    groups[type].slice(0, 10).forEach(path => {
      result.push(`  - ${path}`);
    });
    if (groups[type].length > 10) {
      result.push(`  ... and ${groups[type].length - 10} more ${type} files`);
    }
  });
  
  return result.join('\n');
}

// Group files theo folder
export function groupFilesByFolder(files) {
  const folders = {};
  files.forEach(f => {
    const folder = f.path.includes('/') 
      ? f.path.substring(0, f.path.lastIndexOf('/'))
      : 'root';
    if (!folders[folder]) folders[folder] = [];
    folders[folder].push(f.path);
  });
  
  const result = [];
  const sortedFolders = Object.keys(folders).sort();
  
  sortedFolders.slice(0, 15).forEach(folder => {
    result.push(`\n${folder}/ (${folders[folder].length} files)`);
    folders[folder].slice(0, 5).forEach(file => {
      const fileName = file.split('/').pop();
      result.push(`  - ${fileName}`);
    });
    if (folders[folder].length > 5) {
      result.push(`  ... ${folders[folder].length - 5} more files`);
    }
  });
  
  if (sortedFolders.length > 15) {
    result.push(`\n... and ${sortedFolders.length - 15} more folders`);
  }
  
  return result.join('\n');
}

// Kiểm tra file có quan trọng không (cho level 4)
export function isImportantFile(filePath) {
  const importantPatterns = [
    /index\./,
    /main\./,
    /app\./,
    /server\./,
    /config\./,
    /controller/i,
    /service/i,
    /model/i,
    /route/i,
    /router/i,
    /api/i,
    /handler/i,
    /middleware/i
  ];
  
  return importantPatterns.some(pattern => pattern.test(filePath));
}

// Sleep function để delay giữa các API calls
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Format dependencies cho prompt
export function formatDependencies(deps) {
  if (!deps || Object.keys(deps).length === 0) {
    return 'No dependencies detected';
  }
  
  const result = [];
  
  if (deps.npm) {
    const mainDeps = Object.keys(deps.npm.dependencies || {}).slice(0, 15);
    if (mainDeps.length > 0) {
      result.push('NPM Dependencies (main):');
      mainDeps.forEach(dep => result.push(`  - ${dep}`));
    }
  }
  
  if (deps.python) {
    const pyDeps = deps.python.slice(0, 15);
    if (pyDeps.length > 0) {
      result.push('\nPython Dependencies:');
      pyDeps.forEach(dep => result.push(`  - ${dep}`));
    }
  }
  
  if (deps.maven) {
    result.push('\nMaven: Found pom.xml');
  }
  
  if (deps.gradle) {
    result.push('\nGradle: Found build.gradle');
  }
  
  return result.join('\n') || 'No dependencies';
}

// ============ BATCH PROCESSING HELPERS ============

// Merge multiple analysis results into one comprehensive result
export function mergeAnalysisResults(batchResults) {
  const merged = {
    sequenceDiagrams: [],
    databaseSchema: {
      tables: [],
      relationships: [],
      erdDiagram: ""
    },
    classes: [],
    apiEndpoints: [],
    useCases: [],
    dataFlow: "",
    keyBusinessFlows: []
  };
  
  for (const result of batchResults) {
    // Merge sequence diagrams
    if (result.sequenceDiagrams && Array.isArray(result.sequenceDiagrams)) {
      merged.sequenceDiagrams.push(...result.sequenceDiagrams);
    }
    
    // Merge database schema
    if (result.databaseSchema) {
      if (result.databaseSchema.tables) {
        merged.databaseSchema.tables.push(...result.databaseSchema.tables);
      }
      if (result.databaseSchema.relationships) {
        merged.databaseSchema.relationships.push(...result.databaseSchema.relationships);
      }
      // Append ERD diagrams
      if (result.databaseSchema.erdDiagram) {
        merged.databaseSchema.erdDiagram += '\n' + result.databaseSchema.erdDiagram;
      }
    }
    
    // Merge classes
    if (result.classes && Array.isArray(result.classes)) {
      merged.classes.push(...result.classes);
    }
    
    // Merge API endpoints
    if (result.apiEndpoints && Array.isArray(result.apiEndpoints)) {
      merged.apiEndpoints.push(...result.apiEndpoints);
    }
    
    // Merge use cases
    if (result.useCases && Array.isArray(result.useCases)) {
      merged.useCases.push(...result.useCases);
    }
    
    // Merge data flow
    if (result.dataFlow && typeof result.dataFlow === 'string') {
      merged.dataFlow += '\n' + result.dataFlow;
    }
    
    // Merge key business flows
    if (result.keyBusinessFlows && Array.isArray(result.keyBusinessFlows)) {
      merged.keyBusinessFlows.push(...result.keyBusinessFlows);
    }
  }
  
  // Remove duplicates
  merged.sequenceDiagrams = deduplicateByName(merged.sequenceDiagrams);
  merged.databaseSchema.tables = deduplicateByName(merged.databaseSchema.tables);
  merged.classes = deduplicateByName(merged.classes);
  merged.apiEndpoints = deduplicateByPath(merged.apiEndpoints);
  merged.useCases = deduplicateByName(merged.useCases);
  merged.keyBusinessFlows = deduplicateByName(merged.keyBusinessFlows);
  
  // Clean up empty strings
  merged.dataFlow = merged.dataFlow.trim();
  merged.databaseSchema.erdDiagram = merged.databaseSchema.erdDiagram.trim();
  
  return merged;
}

// Deduplicate array of objects by 'name' field
function deduplicateByName(items) {
  const seen = new Set();
  return items.filter(item => {
    const name = item.name || item.title || '';
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

// Deduplicate array of objects by 'path' or 'endpoint' field
function deduplicateByPath(items) {
  const seen = new Set();
  return items.filter(item => {
    const path = item.path || item.endpoint || '';
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}
