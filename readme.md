# KnightCode

A terminal-based AI coding agent that brings planning and building assistance directly to your command line. It helps you plan and build software without ever leaving your command line.

## Description

KnightCode is a terminal-based AI agent built to make writing code faster and feel a lot more seamless. Instead of constantly context-switching between a browser window and your code editor, you can brainstorm ideas, plan out architecture, and actually build features right from your CLI.

It has two main modes: a safe "Plan" mode for exploring your codebase (reading files and grepping), and a "Build" mode that gives the AI permission to write files, edit code, and execute shell commands to implement the plan.

Under the hood, it's a Bun monorepo split into two parts: a snappy local CLI you run on your machine, and a remote API server that handles all the heavy lifting like persistent sessions, Clerk authentication, and Polar billing.

## Screenshots

![KnightCode Screenshot](https://github.com/user-attachments/assets/839db9cf-c7f7-460d-af75-16579cad2737)

## Getting Started

### Dependencies

To just run the app and connect to the public backend, you really only need a couple of things:

- **Bun** (v1.0.0 or higher)
- **Node.js** (v18+)

If you plan on hosting the full backend yourself, you'll also need:

- **PostgreSQL** (local or cloud-hosted)
- **Clerk** account (for OAuth)
- **Polar** account (for credits and billing)
- API keys from **Anthropic** or **OpenAI**

### Installing

Grabbing the code is super straightforward. Just clone the repo and let Bun handle the dependencies:
1. **Clone the repository:**
```bash
git clone https://github.com/QAYSH/knightcode.git
cd knightcode
```

2. **Install dependencies:**
```bash
bun install --ignore-scripts
```

3. **Run the CLI:**
```bash
bun run dev:cli
```

That's it! The CLI connects to my hosted Railway backend, so you don't need to configure PostgreSQL, Clerk, Polar, or AI providers. This will automatically open your browser to log in via Clerk, and then drop you right into the AI chat interface.


If you want to run the full stack locally for development:
1. Copy .env.example to .env and fill in your database and API credentials.
2. Push the database schema using:
   ```bash
   bun run --cwd packages/database db:push
   ```
4. Spin up the server with:
   ```bash
   bun run dev:server
   ```
6. Run the CLI against your local server using:
   API_URL=http://localhost:3000
   ```bash
    bun run dev:cli
   ```

   
Help
Got stuck? Here are a few common hiccups and how to fix them:
- Database connection issues: Double-check that your DATABASE_URL is correct and that your Postgres instance is actually running and accepting connections.
- Auth (401) or Credits (402) errors: Make sure your Clerk and Polar environment variables match your dashboard settings exactly. If you're testing locally, make sure you're using sandbox keys.
- AI refuses to reply: Verify that your OpenAI or Anthropic API keys are valid and that you haven't hit any rate limits or billing caps on their end.
- CLI won't connect: Ensure the server is running on port 3000, and your API_URL environment variable is pointing to the right place.

> **Note:** The standalone binary is currently unavailable due to OpenTUI compatibility issues with Bun's `--compile` on Windows. The dev version runs flawlessly and takes just a minute to set up.

>### Why I built this ?
>
>I honestly built this cos I just needed a coding assistant right in my terminal. I wanted a way to fix bugs and build out projects at a way faster pace, without having to constantly switch windows.
>Yeah, I know I could've just used Claude Code or OpenCode instead. But they didn't quite hit the sweet spot of having total control over all the modes, and let's be real, building your own dev tools from scratch is just way more fun.

Made with ❤️ by [Qais](https://github.com/QAYSH)
