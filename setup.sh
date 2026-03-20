#!/bin/bash

# Script thiết lập và test c4-gen

echo "🚀 Setting up c4-gen..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# 2. Make index.js executable
echo -e "${YELLOW}🔧 Making index.js executable...${NC}"
chmod +x index.js

echo -e "${GREEN}✅ Permissions set${NC}"

# 3. Link package locally
echo -e "${YELLOW}🔗 Linking package globally...${NC}"
npm link

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to link package${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package linked${NC}"

# 4. Test command
echo -e "${YELLOW}🧪 Testing c4-gen command...${NC}"
c4-gen --help

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Command test failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Command works!${NC}"

# 5. Create test project
echo -e "${YELLOW}📁 Creating test project...${NC}"
mkdir -p test-project/src

cat > test-project/package.json << 'EOF'
{
  "name": "test-app",
  "version": "1.0.0",
  "description": "Test application for c4-gen"
}
EOF

cat > test-project/src/app.js << 'EOF'
// Main application entry point
import express from 'express';
import { UserController } from './controllers/UserController.js';
import { Database } from './db/Database.js';

const app = express();
const db = new Database();
const userController = new UserController(db);

app.get('/users', userController.getAll);
app.post('/users', userController.create);

export default app;
EOF

cat > test-project/src/controllers/UserController.js << 'EOF'
/**
 * User Controller
 * Handles HTTP requests for user operations
 */
export class UserController {
  constructor(database) {
    this.db = database;
  }

  async getAll(req, res) {
    const users = await this.db.findAll('users');
    res.json(users);
  }

  async create(req, res) {
    const user = await this.db.insert('users', req.body);
    res.status(201).json(user);
  }
}
EOF

cat > test-project/src/db/Database.js << 'EOF'
/**
 * Database abstraction layer
 * Handles all database operations
 */
export class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    // Connect to database
  }

  async findAll(table) {
    // Find all records
    return [];
  }

  async insert(table, data) {
    // Insert record
    return data;
  }
}
EOF

echo -e "${GREEN}✅ Test project created${NC}"

# Done
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "Next steps:"
echo -e "  1. Get Gemini API key from: ${YELLOW}https://makersuite.google.com/app/apikey${NC}"
echo -e "  2. Initialize config: ${YELLOW}c4-gen init -k YOUR_API_KEY${NC}"
echo -e "  3. Test generation: ${YELLOW}cd test-project && c4-gen generate${NC}"
echo ""
echo -e "Documentation:"
echo -e "  - README.md for overview"
echo -e "  - EXAMPLES.md for usage examples"
echo -e "  - PUBLISH_GUIDE.md for publishing steps"
echo ""
