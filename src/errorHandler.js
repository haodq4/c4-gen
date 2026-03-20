// Error handling và retry logic cho Gemini AI

export class AIGenerationError extends Error {
  constructor(message, level, originalError) {
    super(message);
    this.name = 'AIGenerationError';
    this.level = level;
    this.originalError = originalError;
  }
}

// Retry với exponential backoff
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if it's a rate limit error
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`⏳ Rate limited. Đợi ${delay/1000}s trước khi thử lại... (lần ${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      
      // Check if it's a quota error
      if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new AIGenerationError(
          'API quota đã hết. Vui lòng chờ hoặc nâng cấp quota.',
          'quota',
          error
        );
      }
      
      // Other errors - retry with shorter delay
      if (attempt < maxRetries - 1) {
        console.log(`⚠️ Lỗi: ${error.message}. Thử lại... (lần ${attempt + 1}/${maxRetries})`);
        await sleep(1000);
      }
    }
  }
  
  throw new AIGenerationError(
    `Không thể generate sau ${maxRetries} lần thử: ${lastError.message}`,
    'max_retries',
    lastError
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Validate AI response
export function validateAIResponse(response, level) {
  if (!response) {
    throw new AIGenerationError(`AI không trả về kết quả cho level ${level}`, level);
  }
  
  // Extract JSON from response (AI might return text + JSON)
  let jsonStr = response;
  
  // Try to find JSON block wrapped in code fence
  const codeFenceMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (codeFenceMatch) {
    jsonStr = codeFenceMatch[1];
  } else {
    // Try to find JSON object
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
  }
  
  if (!jsonStr || !jsonStr.trim().startsWith('{')) {
    throw new AIGenerationError(
      `AI không trả về JSON hợp lệ cho level ${level}. Response: ${response.substring(0, 200)}...`,
      level
    );
  }
  
  try {
    const parsed = JSON.parse(jsonStr);
    
    // Validate structure based on level
    switch(level) {
      case 1: // Context
        if (!parsed.systemName) {
          throw new Error('Missing systemName');
        }
        break;
      case 2: // Container
        if (!parsed.containers || !Array.isArray(parsed.containers)) {
          throw new Error('Missing or invalid containers array');
        }
        break;
      case 3: // Component
        if (!parsed.components || !Array.isArray(parsed.components)) {
          throw new Error('Missing or invalid components array');
        }
        break;
      case 4: // Code
        // Level 4 có thể có nhiều variations, chỉ cần có ít nhất 1 field
        if (!parsed.sequenceDiagrams && !parsed.classes && !parsed.databaseSchema) {
          throw new Error('Missing all required fields (sequenceDiagrams, classes, databaseSchema)');
        }
        // Ensure arrays exist even if empty
        parsed.sequenceDiagrams = parsed.sequenceDiagrams || [];
        parsed.classes = parsed.classes || [];
        parsed.apiEndpoints = parsed.apiEndpoints || [];
        parsed.databaseSchema = parsed.databaseSchema || { tables: [], relationships: [], erdDiagram: "" };
        parsed.dataFlow = parsed.dataFlow || "";
        parsed.keyBusinessFlows = parsed.keyBusinessFlows || [];
        break;
    }
    
    return parsed;
  } catch (error) {
    throw new AIGenerationError(
      `JSON không hợp lệ cho level ${level}: ${error.message}`,
      level,
      error
    );
  }
}

// Estimate token count (rough approximation)
export function estimateTokenCount(text) {
  // Rough estimate: 1 token ≈ 4 characters for English, ~2-3 for code
  return Math.ceil(text.length / 3);
}

// Check if prompt is too large
export function checkPromptSize(prompt, maxTokens = 30000) {
  const estimatedTokens = estimateTokenCount(prompt);
  
  if (estimatedTokens > maxTokens) {
    console.warn(`⚠️ Warning: Prompt quá lớn (ước tính ${estimatedTokens} tokens). Có thể bị cắt.`);
    return false;
  }
  
  return true;
}
