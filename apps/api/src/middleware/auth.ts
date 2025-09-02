import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);


export interface AuthedRequest extends Request {
user?: any;
}


export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
try {
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
const token = authHeader.replace('Bearer ', '');


// Validate token with Supabase
const { data, error } = await supabase.auth.getUser(token as string);
if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });


req.user = data.user;
return next();
} catch (err) {
console.error('auth middleware err', err);
return res.status(500).json({ error: 'Auth error' });
}
}
