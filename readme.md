# KnightCode

A terminal-based AI coding assistant that plans, chats, and builds inside your local codebase.

## Description

KnightCode runs an interactive AI coding agent right in your command line. It lets you inspect files, plan architectural changes, and execute file edits or terminal commands through a terminal interface built with OpenTUI and React. 

You can run KnightCode in two ways:
1. **Standalone Mode (Recommended):** Completely self-contained with zero backend setup. Bring your own OpenAI or Anthropic API key, or point it to a local Ollama instance for 100% free offline use. Session history is saved locally in SQLite (`~/.nightcode/nightcode.db`).
2. **Full Server Mode:** For multi-user hosting, KnightCode includes a Hono API server with PostgreSQL session storage, Clerk browser OAuth authentication, and Polar credit metering.

### Screenshots

<img width="1241" height="498" alt="NightCode Screenshot" src="https://github.com/user-attachments/assets/839db9cf-c7f7-460d-af75-16579cad2737" />

## Getting Started

### Dependencies

* **Bun** (v1.0.0 or higher) - [https://bun.sh](https://bun.sh)
* **Operating System**: Windows 10/11, macOS, or Linux
* **AI Provider**: At least one of the following:
  * OpenAI API key (`OPENAI_API_KEY`)
  * Anthropic API key (`ANTHROPIC_API_KEY`)
  * Local [Ollama](https://ollama.com) instance running a model like `qwen2.5-coder:32b` or `llama3.2`
* *(Optional for full server mode only)*: PostgreSQL, Clerk account, Polar account

### Installing

1. Clone the repository:
```bash
git clone https://github.com/QAYSH/knightcode.git
cd knightcode
```

2. Install dependencies:
```bash
bun install
```

3. Configure your environment:
```bash
cp .env.example .env
```
Open `.env` and add your API key:
```ini
STANDALONE=true
OPENAI_API_KEY=your_api_key_here
```

### Executing program

#### 1. Running in Standalone Mode (Recommended)

* **With an OpenAI key:**
```bash
bun run dev:cli
```

* **With local Ollama (Free & Offline):**
Start Ollama with a coding model, then run:
```bash
# Windows (PowerShell)
$env:OPENAI_BASE_URL = "http://localhost:11434/v1"
$env:DEFAULT_MODEL = "qwen2.5-coder:32b"
bun run dev:cli

# macOS / Linux
OPENAI_BASE_URL="http://localhost:11434/v1" DEFAULT_MODEL="qwen2.5-coder:32b" bun run dev:cli
```

* **With an Anthropic key:**
```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "sk-ant-..."
bun run dev:cli

# macOS / Linux
ANTHROPIC_API_KEY="sk-ant-..." bun run dev:cli
```

#### 2. Running with a Hosted Server (e.g. Railway Demo)

To connect to a cloud deployment with Clerk OAuth login:
```bash
# Windows (PowerShell)
$env:STANDALONE = "false"
$env:API_URL = "https://your-project.up.railway.app"
bun run dev:cli

# macOS / Linux
STANDALONE=false API_URL="https://your-project.up.railway.app" bun run dev:cli
```
Inside the CLI, type `/login` to sign in through the browser.

#### 3. Running the Full Local Stack (Backend + DB + CLI)

* Push the schema to your local PostgreSQL:
```bash
bun run --cwd packages/database db:push
```
* Start the server in one terminal:
```bash
bun install --ignore-scripts
```
* Start the CLI in a second terminal:
```bash
STANDALONE=false API_URL="http://localhost:3000" bun run dev:cli
```

#### Key Controls Inside the CLI

* `Enter` — Send your message
* `Tab` — Switch between **PLAN** (read-only research) and **BUILD** (file writing and shell commands)
* `/models` — Change the AI model
* `/sessions` — Browse and resume past sessions
* `Esc` — Stop an ongoing response or tool execution
* `Ctrl + C` — Exit the program

## Help

* **"No API key configured" on startup:**
  Make sure you created a `.env` file from `.env.example` and set `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENAI_BASE_URL`.
* **Connecting to Ollama:**
  Ensure Ollama is running (`ollama serve`) and that `OPENAI_BASE_URL` points to `http://localhost:11434/v1`.
* **Windows shell commands:**
  KnightCode automatically detects if `bash` is missing and falls back to `cmd.exe /c` for terminal execution, and uses native JavaScript regex search if `grep` is not available.
* **Resetting local data:**
  To start fresh with local sessions or auth tokens, remove the `~/.nightcode` folder:
  ```bash
  # Windows (PowerShell)
  Remove-Item -Recurse -Force ~/.nightcode

  # macOS / Linux
  rm -rf ~/.nightcode
  ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
