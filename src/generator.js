import { GoogleGenerativeAI } from '@google/generative-ai';
import { scanSourceCode, getDetailedCodeBatches } from './scanner.js';
import { generateMarkdown } from './markdown.js';
import { 
  truncateText, 
  summarizeStructure, 
  groupFilesByType, 
  groupFilesByFolder, 
  isImportantFile,
  formatDependencies,
  sleep,
  mergeAnalysisResults
} from './utils.js';
import { 
  retryWithBackoff, 
  validateAIResponse, 
  checkPromptSize,
  AIGenerationError 
} from './errorHandler.js';
import fs from 'fs-extra';
import path from 'path';

export async function generateC4Documentation({ sourcePath, outputPath, apiKey, level }) {
  // 1. Quét source code
  console.log('📊 Đang quét cấu trúc source code...');
  const codeStructure = await scanSourceCode(sourcePath);
  
  if (!codeStructure.files.length) {
    throw new Error('Không tìm thấy file code nào để phân tích');
  }
  
  console.log(`✅ Đã quét ${codeStructure.files.length} files`);
  
  // 2. Khởi tạo Gemini AI
  console.log('🤖 Đang kết nối đến Gemini AI...');
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-flash-latest (always available)
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  
  // 3. Phân tích và sinh tài liệu theo từng level (TUẦN TỰ để tránh rate limit)
  const documentation = {
    projectName: path.basename(sourcePath),
    sourcePath: sourcePath,
    generatedAt: new Date().toISOString(),
    levels: {}
  };
  
  // Level 1: Context Diagram
  if (level >= 1) {
    console.log('📋 Đang sinh Level 1: Context Diagram...');
    try {
      documentation.levels.context = await retryWithBackoff(
        () => generateContextDiagram(model, codeStructure)
      );
      await sleep(2000); // Delay 2s giữa các request
    } catch (error) {
      console.error(`❌ Lỗi khi sinh Level 1: ${error.message}`);
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError('Không thể sinh Context Diagram', 1, error);
    }
  }
  
  // Level 2: Container Diagram
  if (level >= 2) {
    console.log('📦 Đang sinh Level 2: Container Diagram...');
    try {
      documentation.levels.container = await retryWithBackoff(
        () => generateContainerDiagram(model, codeStructure)
      );
      await sleep(2000);
    } catch (error) {
      console.error(`❌ Lỗi khi sinh Level 2: ${error.message}`);
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError('Không thể sinh Container Diagram', 2, error);
    }
  }
  
  // Level 3: Component Diagram
  if (level >= 3) {
    console.log('🧩 Đang sinh Level 3: Component Diagram...');
    try {
      documentation.levels.component = await retryWithBackoff(
        () => generateComponentDiagram(model, codeStructure)
      );
      await sleep(2000);
    } catch (error) {
      console.error(`❌ Lỗi khi sinh Level 3: ${error.message}`);
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError('Không thể sinh Component Diagram', 3, error);
    }
  }
  
  // Level 4: Code Diagram - SỬ DỤNG MULTI-STEP BATCH PROCESSING
  if (level >= 4) {
    console.log('💻 Đang sinh Level 4: Code Diagram với MULTI-STEP ANALYSIS...');
    try {
      documentation.levels.code = await retryWithBackoff(
        () => generateCodeDiagramWithBatches(model, codeStructure)
      );
    } catch (error) {
      console.error(`❌ Lỗi khi sinh Level 4: ${error.message}`);
      if (error instanceof AIGenerationError) {
        throw error;
      }
      throw new AIGenerationError('Không thể sinh Code Diagram', 4, error);
    }
  }
  
  // 4. Tạo markdown documentation
  console.log('📝 Đang tạo file markdown...');
  await fs.ensureDir(outputPath);
  await generateMarkdown(documentation, outputPath);
  
  return documentation;
}

async function generateContextDiagram(model, codeStructure) {
  // Tăng context để phân tích chi tiết hơn
  const filesList = codeStructure.files.slice(0, 50).map(f => f.path).join('\n'); // Tăng từ 30 lên 50
  const structureSummary = summarizeStructure(codeStructure.structure);
  const sampleCode = truncateText(codeStructure.sampleCode, 5000); // Tăng từ 3000 lên 5000
  const filesByFolder = groupFilesByFolder(codeStructure.files);
  
  const prompt = `
Phân tích source code sau và tạo C4 LEVEL 1: CONTEXT DIAGRAM (System Overview):

📊 PROJECT INFO:
- Total Files: ${codeStructure.files.length}
- Project Structure: ${structureSummary}

📁 FILES BY FOLDER:
${filesByFolder}

📁 KEY FILES (50 first files):
${filesList}

💻 SAMPLE CODE:
${sampleCode}

📦 DEPENDENCIES (from package.json/pom.xml/requirements.txt):
${formatDependencies(codeStructure.dependencies)}

---
🎯 HƯỚNG DẪN PHÂN TÍCH CHI TIẾT:

QUAN TRỌNG: Phải phân tích TOÀN DIỆN và CHI TIẾT, KHÔNG tự nghĩ ra hoặc dùng ví dụ.

1. BUSINESS CONTEXT - PHÂN TÍCH SÂU:
   - Đọc package.json name/description để hiểu domain
   - Phân tích folder structure: pos/ → Point of Sale, ecommerce/ → E-commerce, etc.
   - Scan routes/controllers để hiểu business features
   - Identify domain entities từ models/schemas
   - Phát hiện business flows từ service layer

2. STAKEHOLDERS - TÌM TẤT CẢ:
   - Scan ALL files chứa "role", "permission", "user", "admin"
   - Đọc authentication/authorization code
   - Tìm trong migrations/seeds cho user roles
   - Check middleware cho role-based access
   - List ĐẦY ĐỦ mọi loại người dùng hệ thống
   
3. EXTERNAL SYSTEMS - LIỆT KÊ TẤT CẢ:
   - Scan TOÀN BỘ dependencies cho third-party services:
     * Payment: stripe, paypal, vnpay, momo
     * Email: nodemailer, sendgrid, mailgun
     * SMS: twilio, nexmo
     * Storage: aws-s3, cloudinary, firebase-storage
     * Auth: passport, jwt, oauth
     * Analytics: google-analytics, mixpanel
     * Monitoring: sentry, newrelic
     * Search: elasticsearch, algolia
     * Cache: redis, memcached
   - Tìm API integrations trong code (axios calls, fetch to external URLs)
   - Check config files cho external service endpoints
   - PHẢI liệt kê TẤT CẢ integrations tìm được

4. USERS - PHÂN LOẠI CHI TIẾT:
   - Scan routes để identify user journeys:
     * /api/admin/* → Admin users
     * /api/customer/* → Customers
     * /api/vendor/* → Vendors
     * /api/staff/* → Staff members
   - Phân tích permissions/roles cho từng loại user
   - List ĐẦY ĐỦ interactions của từng user type
   - Identify access channels (Web App, Mobile App, API)

5. COMMUNICATION PROTOCOLS:
   - HTTP/REST: express, fastify, koa
   - WebSocket: socket.io, ws
   - GraphQL: apollo, graphql
   - gRPC: @grpc/grpc-js
   - Message Queue: amqplib (RabbitMQ), kafkajs (Kafka)
   - Database protocols: postgres, mysql, mongodb

6. TECHNOLOGIES - LIỆT KÊ ĐẦY ĐỦ:
   - Frontend: React, Vue, Angular, Next.js, Nuxt, Svelte...
   - Backend: Node.js, Python, Java, Go, .NET...
   - Database: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch...
   - Infrastructure: Docker, Kubernetes, AWS, GCP, Azure...

Hãy trả về JSON với format CHI TIẾT:
{
  "systemName": "Tên CHÍNH XÁC từ package.json",
  "description": "Mô tả ĐẦY ĐỦ dựa trên phân tích code (3-5 câu)",
  "businessContext": "Domain nghiệp vụ CHI TIẾT (VD: Library management system with inventory tracking, book lending, and user management)",
  "purpose": "Mục đích CỤTH (liệt kê 3-5 mục đích chính)",
  "stakeholders": [
    {
      "role": "Vai trò CHÍNH XÁC từ code",
      "description": "Mô tả CHI TIẾT responsibilities",
      "concerns": "Concerns CỤ THỂ (security, performance, usability...)"
    }
  ],
  "users": [
    {
      "name": "User type TỪ CODE (Admin, Customer, Vendor, Staff...)",
      "type": "Internal/External",
      "description": "Mô tả ĐẦY ĐỦ role và responsibilities",
      "interactions": [
        "LIST TẤT CẢ interactions từ routes (Manage products, Process orders, View reports...)"
      ],
      "access": "Access method CHI TIẾT (Web Dashboard, Mobile App, REST API...)"
    }
  ],
  "externalSystems": [
    {
      "name": "Service name CHÍNH XÁC từ dependencies",
      "category": "Category CỤ THỂ (Payment Gateway, Email Service, Cloud Storage...)",
      "description": "Mô tả CHI TIẾT service và version",
      "purpose": "Purpose CỤ THỂ (Process payments, Send notifications...)",
      "protocol": "Protocol (HTTPS/REST, SMTP, S3...)",
      "direction": "Inbound/Outbound/Bidirectional",
      "dataFlow": "Data type CỤ THỂ (Payment data, Email content, File uploads...)"
    }
  ],
  "architectureStyle": "Architecture CHI TIẾT (Monolithic with modular structure, Microservices...)",
  "deploymentModel": "Deployment CỤ THỂ (Docker containers, Kubernetes, Serverless...)",
  "technologies": {
    "frontend": ["TẤT CẢ frontend tech + versions"],
    "backend": ["TẤT CẢ backend tech + versions"],
    "database": ["TẤT CẢ databases + versions"],
    "infrastructure": ["TẤT CẢ infrastructure tools"],
    "devOps": ["CI/CD tools, monitoring..."],
    "security": ["Auth methods, encryption..."]
  },
  "keyPrinciples": [
    "LIST principles từ code (RESTful API, Microservices, DDD, CQRS...)"
  ],
  "businessFlows": [
    "KEY business flows từ code (Order Processing, Inventory Management...)"
  ]
}

YÊU CẦU ĐẦY ĐỦ:
✅ Stakeholders: PHẢI có ít nhất 3-5 stakeholder types
✅ Users: PHẢI liệt kê TẤT CẢ user types tìm được
✅ External Systems: PHẢI liệt kê TẤT CẢ dependencies/integrations
✅ Technologies: PHẢI đầy đủ tất cả tech stack
✅ Business Flows: PHẢI liệt kê các flows chính

LƯU Ý: 
- Nếu KHÔNG TÌM THẤY → để mảng rỗng [], KHÔNG bịa
- PHẢI CHI TIẾT và ĐẦY ĐỦ
- Ưu tiên QUALITY over QUANTITY nhưng KHÔNG bỏ sót
`;

  checkPromptSize(prompt);
  
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  return validateAIResponse(response, 1);
}

async function generateContainerDiagram(model, codeStructure) {
  // Tăng context để AI hiểu rõ hơn
  const filesByType = groupFilesByType(codeStructure.files);
  const filesByFolder = groupFilesByFolder(codeStructure.files);
  const structureSummary = summarizeStructure(codeStructure.structure);
  const sampleCode = truncateText(codeStructure.sampleCode, 8000); // Tăng từ 5000 lên 8000
  
  const prompt = `
Phân tích source code và tạo C4 LEVEL 2: CONTAINER DIAGRAM (System Components):

📊 PROJECT STRUCTURE:
${structureSummary}

📁 FILES BY TYPE:
${filesByType}

� FILES BY FOLDER:
${filesByFolder}

�📦 DEPENDENCIES:
${formatDependencies(codeStructure.dependencies)}

💻 SAMPLE CODE:
${sampleCode}

---
🎯 HƯỚNG DẪN PHÂN TÍCH CHI TIẾT:

QUAN TRỌNG: Chỉ dựa trên CODE và DEPENDENCIES thực tế, PHẢI CHI TIẾT và ĐẦY ĐỦ.

1. IDENTIFY ALL CONTAINERS - LIỆT KÊ TẤT CẢ:
   - Frontend Containers:
     * React/Vue/Angular → Web Application
     * React Native → Mobile App
     * Next.js → SSR Application
   - Backend Containers:
     * Express/Fastify/NestJS → API Server
     * GraphQL Server → GraphQL API
     * WebSocket Server → Realtime Service
   - Data Containers:
     * PostgreSQL/MySQL → Primary Database
     * MongoDB → Document Store
     * Redis → Cache Layer
     * Elasticsearch → Search Engine
   - Infrastructure Containers:
     * Nginx → Reverse Proxy
     * RabbitMQ/Kafka → Message Broker
     * Worker processes → Background Jobs
   
2. TECHNOLOGY STACK - CHÍNH XÁC:
   - Đọc package.json cho EXACT versions
   - VD: "express": "^4.18.2" → "Express.js 4.18.2"
   - List ALL major dependencies với versions
   
3. CONTAINER SPECIFICATIONS:
   - Ports: Scan code cho app.listen(), PORT, env variables
   - Environment: Development, Staging, Production configs
   - Scaling: Replicas từ docker-compose hoặc k8s
   - Resources: Memory/CPU limits từ deployment configs
   - Health checks: Tìm /health, /ping endpoints
   
4. COMMUNICATION PATTERNS:
   - Synchronous:
     * HTTP/REST → express routes
     * GraphQL → apollo-server
     * gRPC → @grpc/grpc-js
   - Asynchronous:
     * Message Queue → amqplib, kafkajs
     * WebSocket → socket.io, ws
     * Event Bus → eventemitter2
   - Caching:
     * Redis → ioredis
     * In-memory → node-cache
   
5. CONTAINER INTERACTIONS - CHI TIẾT:
   - API Server ↔ Database: Query patterns, connection pooling
   - API Server ↔ Cache: Cache strategies (read-through, write-through)
   - API Server ↔ Message Queue: Pub/Sub patterns
   - Frontend ↔ API Server: REST endpoints, WebSocket connections
   - Workers ↔ Queue: Job processing patterns

6. DATA STORES - LIỆT KÊ TẤT CẢ:
   - Primary DB: Main data storage với schema
   - Cache: Redis cho session, caching
   - Search: Elasticsearch cho full-text search
   - File Storage: S3, Cloudinary cho uploads
   - Analytics: Time-series DB nếu có

Hãy trả về JSON CHI TIẾT:
{
  "architectureStyle": "Architecture CỤ THỂ (Monolithic, Microservices, Modular Monolith...)",
  "containers": [
    {
      "name": "Tên CHÍNH XÁC (API Server, Web Dashboard, Mobile App, PostgreSQL DB...)",
      "type": "Type CỤ THỂ (Web Application/API Server/Database/Cache/Message Queue...)",
      "technology": "Tech + version CHÍNH XÁC (Express.js 4.18.2, React 18.2.0, PostgreSQL 14.5...)",
      "description": "Mô tả ĐẦY ĐỦ responsibilities và purpose",
        "responsibilities": [
          "LIỆT KÊ TẤT CẢ responsibilities từ code (Xử lý yêu cầu API, Quản lý kho, Quản lý logistics, Quản lý thư viện...)"
      ],
      "port": "Port CHÍNH XÁC hoặc 'Not specified'",
      "replicas": "Số instances (1, 3, auto-scale...)",
      "resources": {
        "memory": "Memory limit (512MB, 1GB, 2GB...)",
        "cpu": "CPU limit (0.5, 1.0, 2.0...)"
      },
      "storage": "Storage type và size",
      "protocols": ["TẤT CẢ protocols (HTTP/1.1, HTTP/2, WebSocket, gRPC...)"],
      "dependencies": ["TẤT CẢ runtime dependencies"],
      "interactions": [
        {
          "to": "Target container CHÍNH XÁC",
          "description": "Mô tả CHI TIẾT interaction",
          "protocol": "Protocol CỤ THỂ",
          "direction": "Inbound/Outbound/Bidirectional",
          "dataExchanged": "Data type CHI TIẾT",
          "isAsync": "true/false",
          "frequency": "Request frequency (high/medium/low)"
        }
      ],
      "endpoints": [
        "TẤT CẢ endpoints/routes phục vụ"
      ],
      "healthCheck": "Health check endpoint",
      "logging": "Logging strategy",
      "monitoring": "Monitoring tools"
    }
  ],
  "dataStores": [
    {
      "name": "Store name CHÍNH XÁC",
      "type": "Type CỤ THỂ (Relational/NoSQL/Cache/Search/File Storage...)",
      "technology": "Tech + version CHÍNH XÁC",
      "purpose": "Purpose CHI TIẾT",
      "dataModel": "Data model description",
      "port": "Port hoặc connection string",
      "replication": "Replication strategy",
      "backup": "Backup strategy"
    }
  ],
  "messagingLayer": {
    "technology": "Technology CHÍNH XÁC (RabbitMQ 3.11, Kafka 3.3...)",
    "queues": ["TẤT CẢ queue names"],
    "exchanges": ["Exchange names nếu có"],
    "purpose": "Purpose CHI TIẾT",
    "patterns": ["Pub/Sub, Work Queue, RPC..."]
  },
  "infrastructureComponents": [
    {
      "name": "Component name (Nginx, API Gateway, Load Balancer...)",
      "technology": "Technology + version",
      "purpose": "Purpose CHI TIẾT",
      "configuration": "Key configurations"
    }
  ],
  "networkingAndSecurity": {
    "loadBalancing": "Load balancing strategy",
    "ssl": "SSL/TLS configuration",
    "authentication": "Auth methods",
    "rateLimit": "Rate limiting strategy"
  }
}

YÊU CẦU ĐẦY ĐỦ:
✅ Containers: PHẢI liệt kê TẤT CẢ containers (API, DB, Cache, Queue...)
✅ Technology: PHẢI có version CHÍNH XÁC từ package.json
✅ Interactions: PHẢI mô tả CHI TIẾT mọi connection
✅ Endpoints: PHẢI list routes/APIs của container
✅ Data Stores: PHẢI liệt kê TẤT CẢ storage systems

LƯU Ý:
- Nếu KHÔNG có Frontend → không tạo Frontend container
- Nếu KHÔNG có Queue → messagingLayer null
- CHỈ những gì CÓ TRONG CODE
- PHẢI CHI TIẾT và ĐẦY ĐỦ
`;

  checkPromptSize(prompt);

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  return validateAIResponse(response, 2);
}

async function generateComponentDiagram(model, codeStructure) {
  // Tăng context để đọc nhiều files hơn
  const filesByFolder = groupFilesByFolder(codeStructure.files);
  const filesByType = groupFilesByType(codeStructure.files);
  const structureSummary = summarizeStructure(codeStructure.structure);
  const sampleCode = truncateText(codeStructure.sampleCode, 10000); // Tăng từ 8000 lên 10000
  
  const prompt = `
Phân tích source code và tạo C4 LEVEL 3: COMPONENT DIAGRAM (Internal Structure):

📊 PROJECT STRUCTURE:
${structureSummary}

📁 FILES BY FOLDER (${codeStructure.files.length} total):
${filesByFolder}

� FILES BY TYPE:
${filesByType}

�📦 DEPENDENCIES:
${formatDependencies(codeStructure.dependencies)}

💻 SAMPLE CODE:
${sampleCode}

---
🎯 HƯỚNG DẪN PHÂN TÍCH CHI TIẾT:

QUAN TRỌNG: Chỉ liệt kê components TÌM ĐƯỢC trong code, PHẢI ĐẦY ĐỦ và CHI TIẾT.

1. SCAN ALL FILES ĐỂ TÌM TẤT CẢ COMPONENTS:
   - Controllers: 
     * Scan ALL files matching: *Controller.js, *controller.ts, routes/*.js
     * Extract class names và route handlers
   - Services:
     * Scan ALL files matching: *Service.js, *service.ts, services/*.js
     * Identify business logic components
   - Repositories/DAOs:
     * Scan ALL files matching: *Repository.js, *Repo.js, *DAO.js, models/*.js
     * Map database access layers
   - Middleware:
     * List ALL files in middleware/, middlewares/
     * Identify auth, validation, logging middleware
   - Utilities:
     * List ALL files in utils/, helpers/, lib/
     * Categorize by function
   
2. IDENTIFY ARCHITECTURE LAYERS - CHI TIẾT:
   - Presentation Layer:
     * Routes, Controllers, API handlers
     * Input validation, request mapping
   - Business Logic Layer:
     * Services, Use cases, Domain logic
     * Business rules, calculations
   - Data Access Layer:
     * Repositories, ORMs, Query builders
     * Database operations, caching
   - Infrastructure Layer:
     * Config, External integrations
     * Logging, monitoring, error handling
   - Cross-Cutting Concerns:
     * Authentication, Authorization
     * Logging, Caching, Error handling

3. API ENDPOINTS - SCAN TẤT CẢ ROUTES:
   - Đọc TOÀN BỘ route files
   - Extract:
     * Method: GET, POST, PUT, DELETE, PATCH
     * Path: /api/users, /api/products/:id
     * Handler: Controller method name
     * Middleware: Auth, validation middleware
   - PHẢI liệt kê ĐẦY ĐỦ TẤT CẢ endpoints
   
4. COMPONENT DEPENDENCIES - MAP TOÀN BỘ:
   - Scan imports/require trong MỌI file
   - Build dependency graph:
     * Controller → Service
     * Service → Repository
     * Repository → Database
   - Identify circular dependencies
   
5. DESIGN PATTERNS - PHÁT HIỆN:
   - MVC: Controller + Model + View/Routes
   - Repository: Data access abstraction
   - Service Layer: Business logic separation
   - Dependency Injection: IoC containers
   - Factory: Object creation patterns
   - Singleton: Shared instances
   - Observer: Event emitters
   - Strategy: Pluggable algorithms

6. MIDDLEWARE CHAIN - LIỆT KÊ:
   - Global middleware
   - Route-specific middleware
   - Error handling middleware
   - Execution order

Hãy trả về JSON CHI TIẾT:
{
  "architectureLayers": [
    {
      "name": "Layer name CỤ THỂ (Presentation, Business Logic, Data Access, Infrastructure)",
      "purpose": "Purpose CHI TIẾT",
      "components": ["TẤT CẢ component names trong layer"],
      "responsibilities": ["Chi tiết responsibilities"],
      "patterns": ["Design patterns used"]
    }
  ],
  "components": [
    {
      "name": "Component name CHÍNH XÁC từ filename",
      "type": "Type CỤ THỂ (Controller/Service/Repository/Middleware/Utility...)",
      "layer": "Layer CỤ THỂ",
      "technology": "Technology stack (Express, Sequelize, TypeORM...)",
      "description": "Mô tả ĐẦY ĐỦ purpose và functionality",
        "responsibilities": [
          "LIỆT KÊ TẤT CẢ responsibilities từ methods (Quản lý kho, Quản lý logistics, Quản lý thư viện, Xử lý yêu cầu API...)"
      ],
      "files": [
        "TẤT CẢ file paths liên quan"
      ],
      "apiEndpoints": [
        {
          "method": "HTTP method CHÍNH XÁC",
          "path": "Path CHÍNH XÁC từ route",
          "description": "Description CHI TIẾT",
          "handler": "Handler function name",
          "authentication": "Auth requirement (Required/Optional/None)",
          "authorization": "Role/Permission requirements",
          "validation": "Input validation rules",
          "requestBody": "Request body schema",
          "responseType": "Response type"
        }
      ],
      "dependencies": [
        {
          "component": "Component name TỪ IMPORTS",
          "purpose": "Purpose CHI TIẾT",
          "type": "Dependency type (Import/Injection/Composition)"
        }
      ],
      "methods": [
        {
          "name": "Method name TỪ CODE",
          "purpose": "Purpose CHI TIẾT",
          "parameters": ["TẤT CẢ params với types"],
          "returnType": "Return type CHÍNH XÁC",
          "async": "true/false",
          "visibility": "public/private/protected"
        }
      ],
      "designPatterns": ["Patterns PHÁT HIỆN được"]
    }
  ],
  "middlewareChain": [
    {
      "name": "Middleware name TỪ FILES",
      "order": "Execution order number",
      "purpose": "Purpose CHI TIẾT",
      "appliesTo": "Routes áp dụng (Global/Specific routes)",
      "type": "Middleware type (Auth/Validation/Logging/ErrorHandling...)"
    }
  ],
  "dataFlow": {
    "requestFlow": "Flow CHI TIẾT (Client → Route → Middleware → Controller → Service → Repository → Database)",
    "responseFlow": "Response flow (Database → Repository → Service → Controller → Response)",
    "errorFlow": "Error handling flow"
  },
  "crossCuttingConcerns": [
    {
      "name": "Concern name (Logging/Caching/ErrorHandling/Security/Monitoring...)",
      "implementation": "Implementation CHI TIẾT",
      "components": ["TẤT CẢ components liên quan"],
      "strategy": "Strategy used"
    }
  ],
  "securityMeasures": {
    "authentication": "Auth methods CHI TIẾT",
    "authorization": "Authorization strategy",
    "inputValidation": "Validation approach",
    "encryption": "Encryption methods"
  }
}

YÊU CẦU ĐẦY ĐỦ:
✅ Components: PHẢI liệt kê TẤT CẢ components từ files scan
✅ API Endpoints: PHẢI có TẤT CẢ routes (50+, 100+, 200+...)
✅ Dependencies: PHẢI map TẤT CẢ imports/dependencies
✅ Middleware: PHẢI liệt kê TẤT CẢ middleware và order
✅ Layers: PHẢI phân loại components vào layers

LƯU Ý:
- Nếu KHÔNG TÌM THẤY controllers → components array rỗng cho layer đó
- Nếu KHÔNG có routes → apiEndpoints rỗng []
- CHỈ liệt kê những gì CÓ TRONG CODE
- PHẢI CHI TIẾT và ĐẦY ĐỦ
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  return validateAIResponse(response, 3);
}

async function generateCodeDiagram(model, codeStructure) {
  // Level 4 - ĐỌC TẤT CẢ để AI có đủ thông tin
  const importantFiles = codeStructure.files
    .filter(f => isImportantFile(f.path));
  
  // BỎ TRUNCATE - Gửi toàn bộ code cho AI
  const detailedCode = codeStructure.detailedCode;
  
  console.log(`🤖 Đang gửi ${detailedCode.length} chars code cho AI phân tích...`);
  
  const prompt = `
Phân tích source code chi tiết và tạo C4 LEVEL 4: CODE DIAGRAM (Sequence Diagrams & Implementation Details):

📁 IMPORTANT FILES (${importantFiles.length}/${codeStructure.files.length}):
${importantFiles.map(f => `${f.path} (${f.lines} lines)`).join('\n')}

💻 DETAILED CODE SAMPLE:
${detailedCode}

📦 DEPENDENCIES:
${formatDependencies(codeStructure.dependencies)}

---
🎯 HƯỚNG DẪN PHÂN TÍCH:

QUAN TRỌNG: Phải ĐỌC TOÀN BỘ CODE và liệt kê ĐẦY ĐỦ, KHÔNG bỏ sót.

1. QUÉT TẤT CẢ ROUTES/ENDPOINTS:
   - Đọc TOÀN BỘ files trong routes/, controllers/
   - Liệt kê TỪNG endpoint: GET /api/users, POST /api/books, PUT /api/warehouse/:id...
   - Mỗi nhóm endpoints liên quan → 1 sequence diagram
   - VÍ DỤ: 
     * Nhóm /api/auth/* → Authentication Flow
     * Nhóm /api/books/* → Library Management Flow
     * Nhóm /api/warehouse/* → Warehouse Logistics Flow
   - PHẢI TẠO sequence diagram cho MỌI nhóm endpoints tìm được
   
2. TẠO SEQUENCE DIAGRAM CHO MỖI NHÓM:
   - List ĐẦY ĐỦ các bước trong flow
   - Bước 1: Client gọi endpoint (method + path cụ thể)
   - Bước 2-N: Trace CHÍNH XÁC qua middleware → controller → service → repository → database
   - Đọc CODE để lấy tên functions/methods THẬT
   - Bao gồm cả error handling flows
   
3. QUÉT TẤT CẢ CLASSES/MODELS:
   - Tìm TOÀN BỘ class definitions trong code
   - Đọc HẾT properties và methods từ code
   - Liệt kê ĐẦY ĐỦ parameters, return types
   - Phát hiện TẤT CẢ relationships (extends, implements, uses)

4. QUÉT TẤT CẢ DATABASE TABLES:
   - Tìm TOÀN BỘ model definitions (Sequelize.define, Schema, @Entity...)
   - Liệt kê ĐẦY ĐỦ tất cả columns/fields với types CHÍNH XÁC
   - Phát hiện TẤT CẢ indexes, foreign keys, constraints
   - Liệt kê ĐẦY ĐỦ relationships (hasMany, belongsTo, belongsToMany...)
   - Tạo ERD diagram HOÀN CHỈNH với TẤT CẢ tables

5. BUSINESS FLOWS:
   - Tạo flow cho MỌI nhóm chức năng tìm được trong code
   - KHÔNG bỏ sót bất kỳ feature nào

YÊU CẦU ĐẦU RA:
- Sequence diagrams: PHẢI có ít nhất 1 diagram cho MỖI nhóm endpoints
- Classes: PHẢI liệt kê TẤT CẢ classes tìm được, không giới hạn
- Database: PHẢI liệt kê TẤT CẢ tables, TẤT CẢ columns
- Nếu có 50 endpoints → cần ít nhất 5-10 sequence diagrams
- Nếu có 30 tables → phải liệt kê đủ 30 tables

Hãy trả về JSON:
{
  "sequenceDiagrams": [
    {
      "name": "Use case name TỪ ENDPOINT (VD: 'User Authentication' từ POST /auth/login)",
      "description": "Description DỰA VÀO route handler code",
      "actors": ["Actors PHÁT HIỆN từ code (Client, API, Database, External Service...)"],
      "steps": [
        {
          "from": "Actor TỪ FLOW",
          "to": "Actor TỪ FLOW",
          "action": "Action CHÍNH XÁC từ code (POST /api/auth/login, validateUser(), etc)",
          "description": "Description TỪ code hoặc comments",
          "dataExchanged": "Data TỪ request/response body trong code",
          "responseType": "Response type TỪ code",
          "conditions": "Conditions TỪ if/else trong code"
        }
      ],
      "alternativeFlows": [
        {
          "condition": "Condition TỪ error handling code",
          "steps": ["Steps TỪ catch blocks hoặc error handling"]
        }
      ],
      "mermaidCode": "Generate mermaid sequence diagram dựa trên steps"
    }
  ],
  "classes": [
    {
      "name": "Class name TỪ CODE (User, Product, OrderService...)",
      "type": "Type TỪ code (class/interface/enum/type)",
      "file": "File path CHÍNH XÁC",
      "description": "Description TỪ JSDoc comments hoặc suy từ code",
      "properties": [
        {
          "name": "Property name TỪ CODE",
          "type": "Type TỪ TypeScript types hoặc suy từ code",
          "visibility": "Visibility TỪ code (public/private/protected)",
          "isRequired": "Dựa vào code (có ? → false, không có → true)",
          "defaultValue": "Default TỪ code nếu có",
          "description": "Description TỪ comments"
        }
      ],
      "methods": [
        {
          "name": "Method name TỪ CODE",
          "visibility": "Visibility TỪ code",
          "isStatic": "true nếu thấy static keyword",
          "isAsync": "true nếu thấy async keyword hoặc return Promise",
          "description": "Description TỪ JSDoc",
          "parameters": [
            {
              "name": "Param name TỪ function signature",
              "type": "Param type TỪ TypeScript hoặc JSDoc",
              "isOptional": "true nếu có ? hoặc default value",
              "description": "Description TỪ JSDoc @param"
            }
          ],
          "returnType": "Return type TỪ TypeScript hoặc JSDoc @returns",
          "exceptions": ["Exceptions TỪ throw statements"]
        }
      ],
      "relationships": [
        {
          "to": "Class TỪ IMPORTS hoặc extends/implements",
          "type": "Type TỪ code (extends/implements/uses...)",
          "description": "Description SUY từ usage",
          "cardinality": "Cardinality TỪ hasMany/belongsTo..."
        }
      ],
      "designPatterns": ["Patterns PHÁT HIỆN từ code structure"],
      "implements": ["Interfaces TỪ implements keyword"],
      "extends": "Parent class TỪ extends keyword"
    }
  ],
  "databaseSchema": {
    "tables": [
      {
        "name": "Table name TỪ MODEL CODE",
        "description": "Description TỪ comments",
        "columns": [
          {
            "name": "Column name TỪ MODEL",
            "type": "Data type TỪ MODEL (Sequelize.STRING, INTEGER...)",
            "isPrimaryKey": "true nếu thấy primaryKey: true",
            "isForeignKey": "true nếu thấy references",
            "isNullable": "Dựa vào allowNull trong code",
            "isUnique": "true nếu thấy unique: true",
            "defaultValue": "Default TỪ defaultValue in code",
            "references": {
              "table": "Referenced table TỪ references",
              "column": "Referenced column TỪ references",
              "onDelete": "onDelete TỪ code",
              "onUpdate": "onUpdate TỪ code"
            }
          }
        ],
        "indexes": [
          {
            "name": "Index name TỪ CODE",
            "columns": ["Columns TỪ index definition"],
            "isUnique": "Dựa vào unique flag",
            "type": "Type TỪ code"
          }
        ],
        "relationships": [
          {
            "type": "Type TỪ hasMany/belongsTo/belongsToMany",
            "with": "Related table TỪ model associations",
            "foreignKey": "FK TỪ association definition",
            "description": "Description SUY từ association"
          }
        ]
      }
    ],
    "erdDiagram": "Generate ERD mermaid code dựa trên relationships"
  },
  "dataFlow": "Data flow TỔNG QUAN suy từ toàn bộ code",
  "keyBusinessFlows": [
    {
      "name": "Flow name DỰA VÀO feature có trong code",
      "description": "Description TỪ code analysis",
      "steps": [
        "Steps DỰA VÀO code flow"
      ],
      "involvedComponents": ["Components THỰC SỰ involved trong flow"]
    }
  ]
}

LƯU Ý QUAN TRỌNG - YÊU CẦU ĐẦY ĐỦ:
✅ PHẢI tạo sequence diagram cho MỌI nhóm endpoints tìm được
✅ PHẢI liệt kê TẤT CẢ classes/models không bỏ sót
✅ PHẢI liệt kê TẤT CẢ database tables và columns
✅ PHẢI liệt kê TẤT CẢ API endpoints và methods
✅ Nếu có 10 nhóm endpoints → cần 10 sequence diagrams
✅ Nếu có 50 tables → phải có đủ 50 tables trong databaseSchema
✅ Nếu có 100 classes → phải liệt kê đủ 100 classes

❌ KHÔNG được:
❌ Bỏ sót endpoints, tables, classes
❌ Tạo ví dụ "Payment", "Order" nếu code không có
❌ Để mảng rỗng nếu thực tế có data trong code
❌ Chỉ liệt kê 1-2 sequence diagrams khi có nhiều nhóm endpoints

MỤC TIÊU: Tài liệu HOÀN CHỈNH và ĐẦY ĐỦ nhất có thể từ code
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  return validateAIResponse(response, 4);
}

// ============ MULTI-STEP BATCH PROCESSING cho Level 4 ============

async function generateCodeDiagramWithBatches(model, codeStructure) {
  console.log('\n🔄 Bắt đầu MULTI-STEP ANALYSIS để đọc HẾT code...\n');
  
  // Chia code thành nhiều batches theo category
  const sourcePath = codeStructure.files[0]?.fullPath 
    ? path.dirname(path.dirname(codeStructure.files[0].fullPath)) 
    : process.cwd();
  const batches = await getDetailedCodeBatches(codeStructure.files, sourcePath);
  
  console.log(`📦 Đã chia thành ${batches.length} batches:`);
  batches.forEach(batch => {
    console.log(`   - ${batch.name}: ${batch.fileCount} files (${batch.content.length} chars)`);
  });
  
  const batchResults = [];
  let step = 1;
  const totalSteps = batches.length;
  
  // Xử lý từng batch
  for (const batch of batches) {
    console.log(`\n⏳ Step ${step}/${totalSteps}: Analyzing ${batch.name} (${batch.fileCount} files)...`);
    
    const prompt = `
Phân tích nhóm files "${batch.name}" và trả về thông tin CHI TIẾT:

💻 CODE (${batch.fileCount} files):
${batch.content}

📦 PROJECT DEPENDENCIES:
${formatDependencies(codeStructure.dependencies)}

---
🎯 NHIỆM VỤ QUAN TRỌNG:

⚠️ ĐÂY LÀ BATCH ${step}/${totalSteps} - PHẢI PHÂN TÍCH KỸ LƯỠNG!

Phân tích TOÀN BỘ code trong nhóm "${batch.name}" và extract ĐẦY ĐỦ:

1. SEQUENCE DIAGRAMS - BẮT BUỘC:
   - Nếu là routes/controllers: TẠO sequence diagram cho MỖI endpoint/route group
   - Trace CHÍNH XÁC flow: request → middleware → controller → service → repository → database
   - Đọc CODE để lấy tên functions/methods THẬT
   - VÍ DỤ: Nếu có 20 routes → cần ít nhất 5-10 sequence diagrams
   
2. CLASSES/MODELS - BẮT BUỘC:
   - Liệt kê TẤT CẢ class definitions (KHÔNG được bỏ sót)
   - Đọc ĐẦY ĐỦ properties, methods, parameters, return types
   - Phát hiện relationships (extends, implements, uses)
   - VÍ DỤ: Nếu có 30 files → expect 20-30 classes

3. DATABASE TABLES - BẮT BUỘC (nếu là models):
   - Liệt kê TẤT CẢ tables với ĐẦY ĐỦ columns
   - Lấy CHÍNH XÁC data types, constraints, foreign keys
   - Phát hiện TẤT CẢ relationships
   - VÍ DỤ: Nếu có 50 model files → expect 40-50 tables

4. API ENDPOINTS - BẮT BUỘC (nếu là routes):
   - Liệt kê TẤT CẢ endpoints (method + path)
   - Lấy handler functions, middlewares
   - Identify request/response schemas
   - VÍ DỤ: Nếu có 15 route files → expect 50-100 endpoints

⚠️ MINIMUM REQUIREMENTS - PHẢI ĐẠT:
${batch.name.includes('route') ? `
✅ Sequence Diagrams: Tối thiểu ${Math.ceil(batch.fileCount / 3)} diagrams
✅ API Endpoints: Tối thiểu ${batch.fileCount * 3} endpoints
` : ''}${batch.name.includes('controller') ? `
✅ Sequence Diagrams: Tối thiểu ${Math.ceil(batch.fileCount / 2)} diagrams
✅ Classes: Tối thiểu ${Math.ceil(batch.fileCount * 0.8)} classes
✅ API Endpoints: Tối thiểu ${batch.fileCount * 2} endpoints
` : ''}${batch.name.includes('model') ? `
✅ Classes: Tối thiểu ${Math.ceil(batch.fileCount * 0.9)} classes
✅ Database Tables: Tối thiểu ${Math.ceil(batch.fileCount * 0.8)} tables
` : ''}${batch.name.includes('service') ? `
✅ Classes: Tối thiểu ${Math.ceil(batch.fileCount * 0.8)} classes
✅ Sequence Diagrams: Tối thiểu ${Math.ceil(batch.fileCount / 3)} diagrams
` : ''}
✅ KHÔNG được để mảng rỗng [] nếu có code
✅ KHÔNG được chỉ liệt kê vài cái rồi bỏ qua phần còn lại

⚠️ QUAN TRỌNG - BẮT BUỘC:
- PHẢI trả về JSON hợp lệ, KHÔNG được thêm text giải thích
- KHÔNG được viết markdown, chỉ trả JSON thuần
- Bắt đầu response bằng { và kết thúc bằng }
- KHÔNG được thêm code fence hoặc bất kỳ wrapper nào

Trả về JSON CHÍNH XÁC theo format này (KHÔNG thêm gì khác):
{
  "sequenceDiagrams": [
    {
      "name": "Use case name TỪ ENDPOINT",
      "description": "Description",
      "actors": ["Actors từ flow"],
      "steps": [
        {
          "from": "Actor",
          "to": "Actor",
          "action": "Action CHÍNH XÁC từ code",
          "description": "Description",
          "dataExchanged": "Data",
          "responseType": "Response type"
        }
      ],
      "alternativeFlows": [],
      "mermaidCode": "sequenceDiagram\\n    participant A\\n    A->>B: Action"
    }
  ],
  "classes": [
    {
      "name": "Class name TỪ CODE",
      "type": "Type",
      "file": "File path",
      "description": "Description",
      "properties": [],
      "methods": [],
      "relationships": []
    }
  ],
  "databaseSchema": {
    "tables": [
      {
        "name": "Table name",
        "columns": [],
        "relationships": []
      }
    ],
    "erdDiagram": ""
  },
  "apiEndpoints": [
    {
      "method": "GET/POST/PUT/DELETE",
      "path": "Endpoint path",
      "handler": "Handler function name",
      "description": "Description"
    }
  ],
  "dataFlow": "",
  "keyBusinessFlows": []
}

❌ LƯU Ý - CẤM TUYỆT ĐỐI:
❌ KHÔNG được liệt kê sơ sài rồi ghi "... and more"
❌ KHÔNG được bỏ qua files vì "quá nhiều"
❌ KHÔNG được summarize - PHẢI liệt kê chi tiết
❌ KHÔNG được để [] nếu thực tế có data

✅ YÊU CẦU - PHẢI LÀM:
✅ ĐỌC TẤT CẢ ${batch.fileCount} files trong batch
✅ LIỆT KÊ TẤT CẢ findings - không bỏ sót
✅ PHẢI là JSON hợp lệ 100%
✅ ĐẦY ĐỦ và CHÍNH XÁC
`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const batchResult = validateAIResponse(response, 4);
      
      batchResults.push(batchResult);
      console.log(`   ✅ Completed ${batch.name}: Found ${batchResult.sequenceDiagrams?.length || 0} diagrams, ${batchResult.classes?.length || 0} classes, ${batchResult.databaseSchema?.tables?.length || 0} tables`);
      
      // Delay giữa các batches để tránh rate limit
      if (step < totalSteps) {
        await sleep(2000); // 2 seconds delay
      }
    } catch (error) {
      console.log(`   ⚠️  Error analyzing ${batch.name}: ${error.message}`);
      // Continue với batches khác
    }
    
    step++;
  }
  
  // Merge tất cả results lại
  console.log('\n🔗 Merging results from all batches...');
  const mergedResult = mergeAnalysisResults(batchResults);
  
  console.log(`\n✅ FINAL RESULTS:`);
  console.log(`   - Sequence Diagrams: ${mergedResult.sequenceDiagrams?.length || 0}`);
  console.log(`   - Classes: ${mergedResult.classes?.length || 0}`);
  console.log(`   - Database Tables: ${mergedResult.databaseSchema?.tables?.length || 0}`);
  console.log(`   - API Endpoints: ${mergedResult.apiEndpoints?.length || 0}\n`);
  
  return mergedResult;
}
