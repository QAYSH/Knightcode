# KnightCode

A terminal-based AI coding agent that brings planning and building assistance directly to your command line.

<img width="1241" height="498" alt="KnightCode Screenshot" src="https://github.com/user-attachments/assets/839db9cf-c7f7-460d-af75-16579cad2737" />

**KnightCode consists of two parts:**
- **CLI** (runs on the user's machine): Terminal UI + tool execution (read/write files, grep, and optionally shell commands)
- **Server API** (runs on your infrastructure): Authentication, session management, AI streaming, persistence (Postgres), and usage billing/credits (Polar)

> This repository is a Bun monorepo with workspaces under `packages/*`.

---

## Table of Contents

- [Try KnightCode (Quickstart)](#try-knightcode-quickstart)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Clerk OAuth Setup](#clerk-oauth-setup)
- [Polar Credits Setup](#polar-credits-setup)
- [Database Setup](#database-setup)
- [Running the App](#running-the-app)
- [Production Deployment](#production-deployment)
- [Development Commands](#development-commands)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Try KnightCode (Quickstart)

Want to try KnightCode without setting up the entire backend?

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

That's it! The CLI connects to my hosted Railway backend, so you don't need to configure PostgreSQL, Clerk, Polar, or AI providers. Just log in with Clerk (browser opens automatically) and start using KnightCode.

> **Note:** The standalone binary is currently unavailable due to OpenTUI compatibility issues with Bun's `--compile` on Windows. The dev version runs flawlessly and takes just a minute to set up.

---

## Features

- **Terminal AI Chat** - Run an AI coding assistant directly in your terminal with an OpenTUI and React interface
- **Plan and Build Modes** - Use read-only planning tools or enable write, edit, and shell execution tools for implementation
- **Streaming Responses** - Stream model output through the AI SDK with persisted session history
- **Local Project Tools** - Read files, list directories, glob, grep, write files, edit files, and run shell commands inside the current project
- **Multi-Model Support** - Use supported Anthropic and OpenAI chat models from a shared model registry
- **Persistent Sessions** - Store authenticated user sessions and messages in Postgres via Prisma
- **Clerk OAuth** - Authenticate the CLI through a browser-based Clerk OAuth flow
- **Usage Billing** - Meter AI usage as credits through Polar before allowing session and chat actions

---

## Architecture Overview

KnightCode is built as a distributed system with four main components:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User CLI  │────▶│   Railway   │────▶│  PostgreSQL │
│  (terminal) │     │   Server    │     │  (Database) │
│             │◀────│   (Hono)    │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                    │
      │                    ▼                    │
      │             ┌─────────────┐            │
      └────────────▶│   AI APIs   │            │
                    │ (Anthropic/ │            │
                    │   OpenAI)   │            │
                    └─────────────┘            │
                            │                  │
                            ▼                  │
                     ┌─────────────┐           │
                     │   Polar     │           │
                     │  (Billing)  │           │
                     └─────────────┘           │
```

### Component Breakdown

1. **CLI UI** (`packages/cli`)
   - Presents the terminal interface
   - Collects user input
   - Calls the API endpoints (`/sessions/*`, `/chat/*`)
   - Executes AI-requested tools locally (file read/write, grep, bash), restricted by mode

2. **Server API** (`packages/server`)
   - Hono-based API
   - Routes: auth, sessions, chat, billing
   - Middleware: `requireAuth` (Clerk token) and `requireCreditsBalance` (blocks when credits are 0)

3. **Database** (`packages/database`)
   - Prisma client + schema
   - Stores user sessions/messages

4. **Shared** (`packages/shared`)
   - Shared Zod schemas
   - AI tool contracts
   - Model definitions

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Notes |
|------------|---------|-------|
| **Bun** | v1.0.0+ | [Install Bun](https://bun.sh/docs/installation) |
| **Node.js** | v18+ | Compatible environment for Bun |
| **PostgreSQL** | Latest | Local or cloud-hosted (Neon, Railway, etc.) |
| **Clerk** | Account | For OAuth authentication |
| **Polar** | Account | For credits and billing |
| **AI Provider** | API Key | Anthropic and/or OpenAI |

---

## Installation

### Clone and Install Dependencies

```bash
git clone git@github.com:qaysh/knightcode.git
cd knightcode
bun install --ignore-scripts
```

### Configure Environment (For Full Development)

If you want to run the full local stack (CLI + Server + Database), create a `.env` file:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Fill in the required values (see [Environment Variables](#environment-variables) section below).

### Quick Start Commands

| Command | Description |
|---------|-------------|
| `bun run dev:cli` | Start the CLI in watch mode |
| `bun run dev:server` | Start the Hono server with hot reload |
| `bun run link:cli` | Build and link the `nightcode` executable locally |

---

## Environment Variables

This repository expects environment variables for server runtime (auth, DB, AI providers), Polar billing, and the API URL used by the CLI.

### Example `.env` File

```bash
# Server URL the CLI should connect to
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nightcode?schema=public

# AI Providers (at least one)
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# Clerk Authentication
CLERK_FRONTEND_API=your_clerk_frontend_api_url
CLERK_OAUTH_CLIENT_SECRET=your_oauth_client_secret
CLERK_OAUTH_CLIENT_ID=your_oauth_client_id
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_SECRET=jwt-secret

# Polar Billing
POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_PRODUCT_ID=your_polar_product_id
POLAR_SERVER=sandbox  # or production
POLAR_CREDITS_METER_ID=your_polar_credits_meter_id
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `API_URL` | ✅ | Server API URL (default: http://localhost:3000) |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | ❌* | Anthropic API key |
| `OPENAI_API_KEY` | ❌* | OpenAI API key |
| `CLERK_FRONTEND_API` | ✅ | Clerk frontend API URL |
| `CLERK_OAUTH_CLIENT_SECRET` | ✅ | Clerk OAuth client secret |
| `CLERK_OAUTH_CLIENT_ID` | ✅ | Clerk OAuth client ID |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `JWT_SECRET` | ✅ | JWT secret for session tokens |
| `POLAR_ACCESS_TOKEN` | ✅ | Polar access token |
| `POLAR_PRODUCT_ID` | ✅ | Polar product ID for credits |
| `POLAR_SERVER` | ❌ | Polar environment (sandbox/production) |
| `POLAR_CREDITS_METER_ID` | ✅ | Polar meter ID for credits |

*At least one AI provider is required.

---

## Clerk OAuth Setup

The CLI uses Clerk OAuth with PKCE (Proof Key for Code Exchange) for secure authentication.

### Step 1: Create OAuth Application in Clerk

1. In your Clerk dashboard, go to **Configure** → **Developers** → **OAuth applications**
2. Click **Add OAuth application**
3. Name it (e.g., "KnightCode")
4. Select these four scopes: `openid`, `email`, `profile`, and `offline_access`
5. Turn on **Public** (required for Authorization Code with PKCE flow)
6. Turn on **Consent screen** so users can approve requested scopes

### Step 2: Configure Redirect URLs

Add the following redirect URIs:

| Environment | Redirect URL |
|-------------|--------------|
| Local Development | `http://localhost:3000/auth/callback` |
| Production | `https://<your-server-domain>/auth/callback` |

### Step 3: Copy Credentials to `.env`

| Environment Variable | Clerk Value |
|---------------------|-------------|
| `CLERK_OAUTH_CLIENT_ID` | OAuth application Client ID |
| `CLERK_OAUTH_CLIENT_SECRET` | OAuth application Client Secret |
| `CLERK_FRONTEND_API` | Clerk frontend API URL |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

---

## Polar Credits Setup

Polar provides credits gating and billing ingestion for usage metering.

### Step 1: Create a Meter

In your Polar dashboard:

| Setting | Value |
|---------|-------|
| Meter name | `nightcode_credits` |
| Filter | Name equals `nightcode_usage` |
| Aggregation | Sum |
| Aggregation property | `credits` |

The event name and metadata key must match exactly. The server sends usage events like this:

```json
{
  "name": "nightcode_usage",
  "metadata": { "credits": 100 }
}
```

### Step 2: Create Benefit and Product

1. Create a **meter credits benefit** using the `nightcode_credits` meter
2. Set the credited units (e.g., 1000 credits)
3. Create a **one-time purchase product** (e.g., $20 for 1000 credits)
4. Attach the credits benefit to that product
5. Set customer portal visibility to **private**

### Step 3: Copy Credentials to `.env`

| Environment Variable | Where to Find |
|---------------------|---------------|
| `POLAR_ACCESS_TOKEN` | Polar developer settings token |
| `POLAR_PRODUCT_ID` | Product ID from the credits product |
| `POLAR_SERVER` | Use `sandbox` locally, `production` for live billing |
| `POLAR_CREDITS_METER_ID` | Meter ID from the meter URL |

---

## Database Setup

### Requirements
- A running PostgreSQL instance (local or cloud-hosted)

### Setup Steps

From the repository root:

1. **Generate Prisma client:**
```bash
bun run --cwd packages/database db:generate
```

2. **Push the schema to your database:**
```bash
bun run --cwd packages/database db:push
```

> For production, use `db:migrate` instead of `db:push` for better migration management.

---

## Running the App

### Option 1: Quickstart (Using Hosted Backend)

The CLI connects to my hosted Railway backend by default. No local server required.

```bash
bun run dev:cli
```

That's it! Log in with Clerk and start using KnightCode.

### Option 2: Fully Local Setup (CLI + Server + Database)

1. **Start PostgreSQL** and ensure `DATABASE_URL` is set correctly

2. **Generate and push Prisma schema:**
```bash
bun run --cwd packages/database db:generate
bun run --cwd packages/database db:push
```

3. **Start the server:**
```bash
bun run dev:server
```
Server runs at: `http://localhost:3000`

4. **Start the CLI (pointing to local server):**
```bash
API_URL=http://localhost:3000 bun run dev:cli
```

5. **Log in and use KnightCode:**
   - Login via the CLI's OAuth flow
   - Create a session
   - Send chat messages

---

## Production Deployment

### Recommended Architecture

KnightCode runs as two services:
1. **Server API** - Deploy to a platform that supports Bun (Railway, Fly.io, Vercel, etc.)
2. **CLI** - Runs on the user's machine (or hosted for demos)

### Server Deployment (Railway)

1. **Build the server:**
```bash
bun run --cwd packages/server build
```

2. **Deploy to Railway:**
   - Create a new Web Service
   - Choose a Bun/Node-compatible runtime
   - Configure the start command to run `packages/server/dist/index.js`

3. **Configure Railway environment variables:**
   - `DATABASE_URL`
   - `JWT_SECRET`
   - All `CLERK_*` values
   - All `POLAR_*` values
   - AI provider keys (`ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY`)

4. **Update Clerk redirect URL:**
   - Add `https://<your-railway-domain>/auth/callback` to Clerk's OAuth redirect URIs

5. **Update CLI API URL:**
   - Set `API_URL=https://<your-railway-domain>` in the CLI environment

---

## Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev:cli` | Start the CLI in watch mode |
| `bun run dev:server` | Start the Hono server with hot reload |
| `bun run build:cli` | Build the CLI package |
| `bun run link:cli` | Build and link the `nightcode` executable locally |
| `bun run --cwd packages/database db:generate` | Generate the Prisma client |
| `bun run --cwd packages/database db:push` | Push schema to database |
| `bun run --cwd packages/server build` | Build the server for production |

---

## Project Structure

```
packages/
├── cli/                         # OpenTUI + React terminal client
│   ├── bin/                     # nightcode executable shim
│   └── src/
│       ├── components/          # Terminal UI components, dialogs, messages
│       ├── hooks/               # Chat and UI hooks
│       ├── layouts/             # Root terminal layouts
│       ├── lib/                 # API client, auth, OAuth, local tool execution
│       ├── providers/           # Dialog, keyboard, prompt, theme, toast providers
│       └── screens/             # Home, new session, and session screens
├── database/                    # Prisma schema, generated client, database exports
├── server/                      # Hono API for auth, billing, sessions, and chat
└── shared/                      # Shared schemas, tool contracts, and model registry
```

---

## Demo

Watch KnightCode in action:

[![KnightCode Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## Troubleshooting

### Prisma Errors
- **Verify** `DATABASE_URL` is correct
- **Ensure** Postgres is reachable from the server
- **Check** database connection permissions

### Auth Errors (401)
- **Confirm** Clerk app is configured for your environment (development vs production)
- **Verify** all Clerk environment variables are set correctly
- **Check** OAuth callback URLs are properly configured

### Credits Errors (402)
- **Ensure** Polar meter is created with correct settings
- **Verify** the customer has an active credits meter with a positive balance
- **Check** Polar environment variables are correct

### AI Provider Errors
- **Confirm** API keys for OpenAI/Anthropic are set
- **Verify** the requested model is supported in `packages/shared/src/models`
- **Check** API rate limits and quotas

### CLI Connection Issues
- **Ensure** server is running on `http://localhost:3000`
- **Verify** `API_URL` environment variable is correct
- **Check** firewall and network settings

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Hono](https://hono.dev/) - Lightweight web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Clerk](https://clerk.com/) - Authentication and user management
- [Polar](https://polar.sh/) - Billing and credits infrastructure
- [OpenTUI](https://opentui.dev/) - Terminal UI framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI streaming and tool calling

---

Made with ❤️ by [Qais](https://github.com/QAYSH)
