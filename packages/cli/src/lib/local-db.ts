import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export type LocalSession = {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    messages: unknown[];
};

export type LocalSessionSummary = {
    id: string;
    title: string;
    createdAt: string;
};

const DB_DIR = join(homedir(), ".nightcode");
const DB_PATH = join(DB_DIR, "nightcode.db");

let dbInstance: Database | null = null;

function getDb(): Database {
    if (!dbInstance) {
        if (!existsSync(DB_DIR)) {
            mkdirSync(DB_DIR, { recursive: true, mode: 0o700 });
        }
        dbInstance = new Database(DB_PATH);
        dbInstance.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                messages TEXT NOT NULL
            );
        `);
    }
    return dbInstance;
}

export function listLocalSessions(): LocalSessionSummary[] {
    const db = getDb();
    const rows = db.query(
        "SELECT id, title, created_at as createdAt FROM sessions ORDER BY created_at DESC"
    ).all() as { id: string; title: string; createdAt: string }[];

    return rows.map((row) => ({
        id: row.id,
        title: row.title,
        createdAt: row.createdAt,
    }));
}

export function getLocalSession(id: string): LocalSession | null {
    const db = getDb();
    const row = db.query(
        "SELECT id, title, created_at, updated_at, messages FROM sessions WHERE id = ?"
    ).get(id) as {
        id: string;
        title: string;
        created_at: string;
        updated_at: string;
        messages: string;
    } | null;

    if (!row) return null;

    let parsedMessages: unknown[] = [];
    try {
        parsedMessages = JSON.parse(row.messages);
    } catch {
        parsedMessages = [];
    }

    return {
        id: row.id,
        title: row.title,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        messages: parsedMessages,
    };
}

export function createLocalSession(title: string): LocalSession {
    const db = getDb();
    const id = `local_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const now = new Date().toISOString();
    const emptyMessages = JSON.stringify([]);

    db.query(
        "INSERT INTO sessions (id, title, created_at, updated_at, messages) VALUES (?, ?, ?, ?, ?)"
    ).run(id, title, now, now, emptyMessages);

    return {
        id,
        title,
        createdAt: now,
        updatedAt: now,
        messages: [],
    };
}

export function updateLocalSessionMessages(id: string, messages: unknown[]): void {
    const db = getDb();
    const now = new Date().toISOString();
    db.query(
        "UPDATE sessions SET messages = ?, updated_at = ? WHERE id = ?"
    ).run(JSON.stringify(messages), now, id);
}

export function deleteLocalSession(id: string): void {
    const db = getDb();
    db.query("DELETE FROM sessions WHERE id = ?").run(id);
}
