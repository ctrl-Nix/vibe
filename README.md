# VIBE - AI-Powered Creative Writing Platform

<div align="center">

![VIBE Logo](./assets/logo.png)

**Elevate your storytelling with AI. Generate plots, optimize prompts, evaluate narratives, and discover inspiration—all in one platform.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Live Demo](#demo) • [Installation](#installation) • [Features](#features) • [Contributing](CONTRIBUTING.md) • [Roadmap](ROADMAP.md)

</div>

---

## 🎯 What is VIBE?

VIBE is an open-source web platform that helps **novelists and students** unlock their creative potential through AI-powered tools. Whether you're stuck on plot development, need feedback on your writing, or want to refine your creative prompts, VIBE provides intelligent assistance to enhance your storytelling.

**In one platform, get:**
- 📖 **Plotline** - Generate and structure story plots
- 🔮 **Oracle** - Get AI-powered creative insights and brainstorming
- ⭐ **Judge** - Receive constructive evaluation of your writing
- ✨ **Prompt Optimizer** - Refine prompts for better AI-assisted writing

---

## ✨ Key Features

### For Novelists
- 📝 **AI-Generated Plot Suggestions** - Get story structure ideas powered by advanced LLMs
- 🎭 **Character Development** - Create compelling character arcs with AI guidance
- 💡 **Creative Brainstorming** - Break writer's block with intelligent idea generation
- 📊 **Writing Feedback** - Get constructive evaluation before publishing

### For Students
- 📚 **Assignment Helper** - Optimize prompts for better essay results
- ✏️ **Writing Quality Assessment** - Understand strengths and areas for improvement
- 🧠 **Learning Support** - Use AI as a creative writing tutor
- 📖 **Story Structure Guide** - Learn narrative techniques through examples

### For Everyone
- 🌐 **No Installation Required** - Works directly in your browser
- ⚡ **Fast & Responsive** - Optimized for modern devices
- 🔒 **Privacy First** - Your writing stays private
- 🎨 **Clean, Intuitive UI** - Designed for writers, not tech experts

---

## 🚀 Demo

[**🔗 Try VIBE Live**](https://vibe-demo.vercel.app) (Coming Soon)

### Quick Demo Video
![VIBE Demo](./assets/demo.gif)

**Sample Workflow:**
1. Enter a story concept → 2. Get AI-generated plot outline → 3. Refine with Prompt Optimizer → 4. Get writing feedback from Judge

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/vibe.git
cd vibe

# 2. Install dependencies
npm install
# or
yarn install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev
# or
yarn dev

# 5. Open in your browser
# Navigate to http://localhost:3000
```

**That's it!** You're ready to use VIBE. 🎉

### Troubleshooting

**Q: "Port 3000 already in use"**
```bash
npm run dev -- -p 3001
```

**Q: "Module not found"**
```bash
npm install
npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development setup.

---

## 📖 How to Use

### Getting Started (Your First Story)

1. **Open VIBE** → Click "Create New Project"
2. **Enter Your Concept** → "A time-traveling detective solving crimes"
3. **Choose a Tool:**
   - 🔮 **Oracle** - Get brainstorming ideas
   - 📖 **Plotline** - Generate a full plot structure
   - ✨ **Prompt Optimizer** - Refine your idea for better results
4. **Export & Share** - Download as .txt, .docx, or share with classmates

### Example: From Concept to Story

```
Step 1: Input Concept
"Orphan discovers hidden magical world in small town"

Step 2: Use Plotline Feature
→ Generates 3-act structure with major plot points

Step 3: Use Judge
→ Receive feedback on plot coherence and character development

Step 4: Refine with Prompt Optimizer
→ Improve prompts for even better AI results
```

### Key Tools Explained

| Tool | Use When | Example |
|------|----------|---------|
| **Plotline** | You need story structure | "Help me outline my fantasy novel" |
| **Oracle** | You need creative ideas | "What are interesting character conflicts?" |
| **Judge** | You want feedback | "Rate this chapter draft for pacing" |
| **Prompt Optimizer** | You're using another AI tool | "Make my ChatGPT prompts better" |

---

## 🏗️ Project Structure

```
vibe/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── judge/          # Writing evaluation endpoints
│   │   │   ├── oracle/         # Creative brainstorming endpoints
│   │   │   ├── plotline/       # Plot generation endpoints
│   │   │   └── prompt-optimizer/  # Prompt refinement endpoints
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # App layout
│   │   └── globals.css         # Global styles
│   ├── components/             # Reusable React components
│   ├── lib/                    # Utility functions and helpers
│   └── types/                  # TypeScript type definitions
├── docs/                       # Extended documentation
├── tests/                      # Test suite
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.js             # Next.js configuration
└── README.md                  # This file
```

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **AI/ML** | OpenAI API, Anthropic Claude (configurable) |
| **Database** | PostgreSQL (optional, for user data) |
| **Hosting** | Vercel (recommended), any Node.js host |

---

## 🌟 Features Breakdown

### 📖 Plotline Generator
- Generate 3-act story structures
- Create character relationship maps
- Outline chapter-by-chapter breakdowns
- Export as markdown or outline format

**Example Output:**
```
Act I: Setup
- Meet Emma, struggling artist
- Discovers old letter from grandmother
- Decides to investigate family mystery

Act II: Conflict
- Uncovers secrets about past
- Must choose between truth and family
- Faces unexpected obstacles

Act III: Resolution
- Confronts the mystery
- Personal transformation
- New beginning
```

### 🔮 Oracle (Brainstorming)
- Generate character backstories
- Suggest plot twists and surprises
- Create dialogue examples
- Brainstorm world-building elements

### ⭐ Judge (Feedback)
- Evaluate writing quality
- Assess plot coherence
- Analyze character development
- Provide constructive suggestions

### ✨ Prompt Optimizer
- Improve prompts for ChatGPT, Claude, etc.
- Make prompts more specific and clear
- Add context for better results
- Learn prompt engineering techniques

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# LLM Configuration (choose one)
OPENAI_API_KEY=sk_your_key_here
# OR
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Optional: Database (for future features)
DATABASE_URL=postgresql://user:password@localhost:5432/vibe

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

See `.env.example` for all available options.

---

## 📚 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup for different OS
- **[API Documentation](docs/API.md)** - REST API endpoints
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and decisions
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Roadmap](ROADMAP.md)** - Future features and vision

---

## ✅ Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes VIBE better.

**Quick Start for Contributors:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Look for [good first issue](https://github.com/yourusername/vibe/labels/good%20first%20issue)
3. Fork → Branch → Commit → PR

**Example contribution ideas:**
- Add new writing evaluation metrics
- Improve UI/UX for specific tools
- Write tutorials for students
- Add translations
- Suggest story prompts

---

## 🗺️ Roadmap

### v1.0 (Current - Hackathon)
- ✅ Core tools: Plotline, Oracle, Judge, Prompt Optimizer
- ✅ Basic UI and navigation
- ✅ API integration with LLMs

### v1.1 (Next Sprint)
- 🔄 User accounts and project saving
- 🔄 Export to Word (.docx) and PDF
- 🔄 Community prompt templates

### v2.0 (Future)
- 📋 Collaborative writing (real-time)
- 📋 Writing analytics and statistics
- 📋 Community publishing platform
- 📋 AI model fine-tuning on user preferences

See [ROADMAP.md](ROADMAP.md) for detailed roadmap and milestones.

---

## 📦 Deployment

### Deploy to Vercel (Recommended - 1 Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibe)

### Deploy Anywhere

```bash
# Build production version
npm run build

# Start production server
npm start
```

Works on:
- Vercel
- Netlify
- Railway
- Heroku
- Any Node.js host

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

MIT License means:
- ✅ Free to use for personal and commercial projects
- ✅ Free to modify and distribute
- ✅ Just include a license notice

---

## 🙏 Acknowledgments

Built with inspiration from:
- The open source community
- Students and novelists who shared feedback
- Contributors and mentors

Special thanks to:
- [OpenAI](https://openai.com) for GPT models
- [Anthropic](https://anthropic.com) for Claude
- [Vercel](https://vercel.com) for Next.js
- [Tailwind CSS](https://tailwindcss.com) for styling

---

## 💬 Get Help

- 📖 **[Discussions](https://github.com/yourusername/vibe/discussions)** - Ask questions
- 🐛 **[Issues](https://github.com/yourusername/vibe/issues)** - Report bugs
- 💬 **[Discord/Community](link)** - Chat with users (coming soon)
- 📧 **Email** - [your-email@example.com]

---

## 🌟 Show Your Support

If VIBE helped you with your novel or assignment, please:
- ⭐ Star this repository
- 📢 Share with fellow writers and students
- 🔗 Link to VIBE in your project
- 💬 Give feedback in Discussions

---

<div align="center">

**Made with ❤️ by the VIBE community**

[⬆ Back to Top](#vibe---ai-powered-creative-writing-platform)

</div>