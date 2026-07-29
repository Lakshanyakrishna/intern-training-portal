/**
 * Seed Test Users Script
 *
 * Creates test accounts (applicant, intern, mentor, admin) in Supabase
 * and populates their profile, progress, and settings data.
 *
 * Usage:
 *   export SUPABASE_URL="https://your-project.supabase.co"
 *   export SUPABASE_SERVICE_KEY="your-service-role-key"
 *   npx tsx scripts/seed-test-users.ts
 *
 * Note: Requires a Supabase service_role key (not anon key) to create
 * auth users and bypass RLS.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Role = 'intern' | 'mentor' | 'admin';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: Role;
  college: string;
  yearOfStudy?: string;
  batch: string;
  displayName: string;
  theme: 'light' | 'dark';
}

const users: SeedUser[] = [
  {
    email: 'applicant@test.com',
    password: 'Test1234!',
    name: 'Alice Applicant',
    role: 'intern',
    college: 'MIT',
    yearOfStudy: '3rd Year',
    batch: '',
    displayName: 'Alice',
    theme: 'light',
  },
  {
    email: 'intern@test.com',
    password: 'Test1234!',
    name: 'Charlie Intern',
    role: 'intern',
    college: 'UC Berkeley',
    yearOfStudy: '4th Year',
    batch: '2026A',
    displayName: 'Charlie',
    theme: 'light',
  },
  {
    email: 'mentor@test.com',
    password: 'Test1234!',
    name: 'Diana Mentor',
    role: 'mentor',
    college: 'Harvard',
    batch: '2026A',
    displayName: 'Diana',
    theme: 'dark',
  },
  {
    email: 'admin@test.com',
    password: 'Test1234!',
    name: 'Eve Admin',
    role: 'admin',
    college: 'CMU',
    batch: '2026A',
    displayName: 'Eve',
    theme: 'light',
  },
];

async function createAuthUser(email: string, password: string): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    throw new Error(`Failed to create auth user ${email}: ${error.message}`);
  }
  if (!data.user) throw new Error(`No user returned for ${email}`);
  console.log(`  Created auth user: ${email} -> ${data.user.id}`);
  return data.user.id;
}

async function seedUser(u: SeedUser): Promise<void> {
  console.log(`\nSeeding: ${u.email} (${u.role})`);

  let userId: string;

  // Check if user exists in auth, or create
  const { data: existing } = await supabase.auth.admin.getUserByEmail(u.email);
  if (existing?.user) {
    userId = existing.user.id;
    console.log(`  Auth user already exists: ${userId}`);
  } else {
    userId = await createAuthUser(u.email, u.password);
  }

  // Insert/upsert into public.users
  const { error: userErr } = await supabase.from('users').upsert({
    id: userId,
    email: u.email,
    name: u.name,
    role: u.role,
    college: u.college || null,
    year_of_study: u.yearOfStudy || null,
    batch: u.batch || null,
    joined_date: new Date().toISOString().split('T')[0],
    onboarding_complete: true,
  });
  if (userErr) {
    console.error(`  ERROR inserting users row: ${userErr.message}`);
    return;
  }
  console.log('  users row: OK');

  // Insert/upsert user_settings
  const { error: settingsErr } = await supabase.from('user_settings').upsert({
    user_id: userId,
    theme: u.theme,
    display_name: u.displayName,
  });
  if (settingsErr) {
    console.error(`  ERROR inserting user_settings: ${settingsErr.message}`);
    return;
  }
  console.log('  user_settings: OK');

  // If intern, seed progress data
  if (u.role === 'intern') {
    const { error: progressErr } = await supabase.from('progress').upsert({
      user_id: userId,
      xp: 1250,
      level: 4,
      streak: 7,
      last_active: new Date().toISOString().split('T')[0],
      training_start_date: '2026-01-15',
    });
    if (!progressErr) console.log('  progress: OK');
    else console.error(`  progress ERROR: ${progressErr.message}`);
  }

  // If mentor, skip progress (mentors don't have training progress)
  if (u.role === 'mentor' || u.role === 'admin') {
    console.log('  (skipped progress: mentor/admin)');
  }

  if (u.email === 'applicant@test.com') {
    const { error: appErr } = await supabase.from('applications').insert({
      name: u.name,
      email: u.email,
      college: u.college,
      year_of_study: u.yearOfStudy,
      status: 'pending',
    });
    if (!appErr) console.log('  applications row: OK');
    else if (appErr.code === '23505') console.log('  applications row: already exists (duplicate)');
    else console.error(`  applications ERROR: ${appErr.message}`);
  }

  console.log(`  DONE: ${u.email}`);
}

async function main() {
  console.log('=== Seed Test Users ===\n');
  for (const u of users) {
    await seedUser(u);
  }
  console.log('\n=== Seed Complete ===');
  console.log('\nTest accounts created:');
  console.log('  applicant@test.com / Test1234! (applicant)');
  console.log('  intern@test.com    / Test1234! (intern)');
  console.log('  mentor@test.com    / Test1234! (mentor)');
  console.log('  admin@test.com     / Test1234! (admin)');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
