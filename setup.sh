#!/bin/bash

echo "=========================================="
echo "Password Security Lab - Web App Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 is not installed${NC}"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Python 3 found: $(python3 --version)${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "Please install Node.js 14 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo ""

# Backend setup
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo -e "${GREEN}✓ Virtual environment created${NC}"
else
    echo -e "${YELLOW}⚠ Virtual environment already exists${NC}"
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
./venv/bin/pip install -q --upgrade pip
./venv/bin/pip install -q -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Python dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install Python dependencies${NC}"
    exit 1
fi

cd ..
echo ""

# Frontend setup
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="
cd frontend

# Install Node dependencies
echo "Installing Node.js dependencies..."
echo "(This may take a few minutes...)"
npm install --silent

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Node.js dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install Node.js dependencies${NC}"
    exit 1
fi

cd ..
echo ""

# Make executable
chmod +x backend/api.py
chmod +x run.sh

echo "=========================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "  Option 1 - Use the run script (recommended):"
echo "    ${GREEN}./run.sh${NC}"
echo ""
echo "  Option 2 - Start manually:"
echo "    Terminal 1 (Backend):"
echo "      cd backend"
echo "      ./venv/bin/python api.py"
echo ""
echo "    Terminal 2 (Frontend):"
echo "      cd frontend"
echo "      npm start"
echo ""
echo "Then open: ${GREEN}http://localhost:3000${NC}"
echo ""
