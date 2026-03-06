#!/bin/bash

# VIBE Project Setup Script
echo "🚀 Setting up VIBE..."

# Delete existing src
if [ -d "src" ]; then
    echo "🗑️  Deleting existing src folder..."
    rm -rf src
fi

# Create all folders
echo "📁 Creating folder structure..."
mkdir -p src/app/api/judge
mkdir -p src/app/api/oracle
mkdir -p src/app/api/plotline
mkdir -p src/app/api/prompt-optimizer
mkdir -p src/app/tools/judge
mkdir -p src/app/tools/oracle
mkdir -p src/app/tools/plotline
mkdir -p src/app/tools/prompt-optimizer
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/types
mkdir -p public

echo "✅ All folders created!"
echo "📂 Structure ready for VIBE project"