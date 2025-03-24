import { config } from 'dotenv';
import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';

const { parsed } = config({ path: '.env.local' });
const sql = neon(parsed?.DATABASE_URL || '');

export const db = drizzle({client: sql});
