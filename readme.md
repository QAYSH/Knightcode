# KnightCode

A terminal-based AI coding agent that brings the power of AI directly to your command line. Plan, chat, and build inside your local project with a Bun-powered CLI, Hono API, Prisma ORM, Clerk authentication, and AI SDK streaming.

<img width="1241" height="498" alt="NightCode Screenshot" src="https://github.com/user-attachments/assets/839db9cf-c7f7-460d-af75-16579cad2737" />

---

## 🚀 Features

- **Terminal AI Chat** - Run an AI coding assistant directly in your terminal with an OpenTUI and React interface
- **Plan and Build Modes** - Use read-only planning tools or enable write, edit, and shell execution tools for implementation
- **Streaming Responses** - Stream model output through the AI SDK with persisted session history
- **Local Project Tools** - Read files, list directories, glob, grep, write files, edit files, and run shell commands inside the current project
- **Multi-Model Support** - Use supported Anthropic and OpenAI chat models from a shared model registry
- **Persistent Sessions** - Store authenticated user sessions and messages in Postgres via Prisma
- **Clerk OAuth** - Authenticate the CLI through a browser-based Clerk OAuth flow
- **Usage Billing** - Meter AI usage as credits through Polar before allowing session and chat actions

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Bun** (v1.0.0 or higher) - [Install Bun](https://bun.sh/docs/installation)
- **Node.js** (v18+) - Compatible environment for Bun
- **PostgreSQL** database (local or cloud-hosted like Neon)
- **Clerk** account and application configured for OAuth
- **Polar** account for credits and billing
- **Anthropic and/or OpenAI** API keys

---

## 🏗️ Project Structure

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

## 🔧 Quickstart

### 1. Clone and Install

```bash
git clone git@github.com:qaysh/knightcode.git
cd knightcode
bun install
```

### 2. Configure Environment

Create a `.env` file at the repository root:

```bash
cp .env.example .env
```

Fill in the required values:

```bash
# Server Configuration
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

### 3. Set Up Clerk OAuth

NightCode authenticates the CLI through a browser-based Clerk OAuth flow. The CLI opens Clerk authorization in the browser, Clerk redirects to the server at `/auth/callback`, and the server forwards the authorization code back to the local CLI callback server.

**In your Clerk dashboard:**

1. Go to **Configure** > **Developers** > **OAuth applications**
2. Click **Add OAuth application**
3. Name it (e.g., "KnightCode")
4. Select these four scopes: `openid`, `email`, `profile`, and `offline_access`
5. Turn on **Public** (required for Authorization Code with PKCE flow)
6. Turn on **Consent screen** so users can approve requested scopes
7. Add `http://localhost:3000/auth/callback` as a redirect URI for local development
8. Add your production callback URL for deployment

**Copy credentials to `.env`:**

| Environment Variable | Clerk Value |
|---------------------|-------------|
| `CLERK_OAUTH_CLIENT_ID` | OAuth application Client ID |
| `CLERK_OAUTH_CLIENT_SECRET` | OAuth application Client Secret |
| `CLERK_FRONTEND_API` | Clerk frontend API URL |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

### 4. Set Up Polar Billing

NightCode uses Polar credits to gate new work and bill completed AI usage. The server checks the user's active meter balance before creating sessions or sending chat requests, then ingests usage events after AI responses finish.

**In your Polar dashboard (sandbox mode for local development):**

1. **Create a meter** with these exact settings:

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

2. **Create a meter credits benefit** and attach it to a one-time purchase product:
   - Create a benefit using the `nightcode_credits` meter
   - Set the credited units (e.g., 1000 credits)
   - Create a one-time purchase product (e.g., $20 for 1000 credits)
   - Attach the credits benefit to that product
   - Set customer portal visibility to **private**

**Copy credentials to `.env`:**

| Environment Variable | Where to Find |
|---------------------|---------------|
| `POLAR_ACCESS_TOKEN` | Polar developer settings token |
| `POLAR_PRODUCT_ID` | Product ID from the credits product |
| `POLAR_SERVER` | Use `sandbox` locally, `production` for live billing |
| `POLAR_CREDITS_METER_ID` | Meter ID from the meter URL |

### 5. Set Up the Database

Generate the Prisma client:

```bash
bun run --cwd packages/database db:generate
```

Apply the Prisma schema to your Postgres database:

```bash
bun run --cwd packages/database db:push
# or use db:migrate for production
```

### 6. Run the Server

```bash
bun run dev:server
```

The API runs on `http://localhost:3000`.

### 7. Run the CLI

In another terminal:

```bash
bun run dev:cli
```

To build and link the local CLI binary:

```bash
bun run link:cli
nightcode
```

---

## 💻 Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev:cli` | Start the CLI in watch mode |
| `bun run dev:server` | Start the Hono server with hot reload |
| `bun run build:cli` | Build the CLI package |
| `bun run link:cli` | Build and link the nightcode executable |
| `bun run --cwd packages/database db:generate` | Generate the Prisma client |
| `bun run --cwd packages/database db:push` | Push schema to database |
| `bun run --cwd packages/server build` | Build the server for production |

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| `@nightcode/cli` | Terminal UI and client-side tool execution |
| `@nightcode/server` | Hono API, AI streaming, auth checks, and billing ingestion |
| `@nightcode/database` | Prisma client and database schema |
| `@nightcode/shared` | Shared Zod schemas, AI tool contracts, and model definitions |

---

## 🔐 Authentication Flow

1. CLI initiates OAuth flow and opens browser
2. User authenticates with Clerk
3. Clerk redirects to `/auth/callback` on the server
4. Server exchanges code for tokens and sends to local CLI callback
5. CLI stores session token for subsequent API requests

Protected routes:
- `/sessions/*`
- `/chat/*`
- `/billing/*`

---

## 💳 Billing & Credits

The server uses a credit-based billing system via Polar:

1. **Middleware `requireCreditsBalance`**:
   - Denies requests when credits are `<= 0`
   - Returns HTTP 402 (Payment Required)

2. **On each successful chat completion**:
   - Computes estimated credits from `LanguageModelUsage`
   - Calls `polar.events.ingest()` with usage data

3. **User workflows**:
   - `/billing/checkout` - Opens Polar checkout URL for purchasing credits
   - `/billing/portal` - Opens customer's Polar portal

---

## 🚢 Production Deployment

### Recommended Architecture

NightCode runs as two services:
1. **Server API** - Deploy to a platform that supports Bun
2. **CLI** - Runs on the user's machine (or hosted for demos)

### Server Deployment

1. Build the server:
   ```bash
   bun run --cwd packages/server build
   ```

2. Deploy the built output to your hosting platform

3. Set all required environment variables in your platform dashboard

### Container Deployment

If containerizing, ensure all environment variables are set:
- `DATABASE_URL`
- `CLERK_SECRET_KEY` + `CLERK_PUBLISHABLE_KEY`
- `POLAR_*` variables
- AI provider credentials

---

## 🔧 Troubleshooting

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

## 📝 Environment Variables Reference

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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Hono](https://hono.dev/) - Lightweight web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Clerk](https://clerk.com/) - Authentication and user management
- [Polar](https://polar.sh/) - Billing and credits infrastructure
- [OpenTUI](https://opentui.dev/) - Terminal UI framework
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI streaming and tool calling

---

Made with ❤️ by [Qais](https://github.com/QAYSH)
