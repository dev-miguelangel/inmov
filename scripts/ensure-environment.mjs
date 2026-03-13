import { access, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';

const envDir = path.resolve(process.cwd(), 'src/environments');
const prodEnvFile = path.join(envDir, 'environment.ts');
const devEnvFile = path.join(envDir, 'environment.development.ts');

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function firstDefinedValue(...values) {
  return values.find(value => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';
}

function renderEnvironmentFile(production, supabaseUrl, supabaseKey) {
  return `export const environment = {
  production: ${production},
  supabaseUrl: ${JSON.stringify(supabaseUrl)},
  supabaseKey: ${JSON.stringify(supabaseKey)},
};
`;
}

async function ensureEnvironmentFiles() {
  const hasProdEnv = await fileExists(prodEnvFile);
  const hasDevEnv = await fileExists(devEnvFile);

  if (hasProdEnv && hasDevEnv) {
    console.log('Using existing Angular environment files.');
    return;
  }

  await mkdir(envDir, { recursive: true });

  if (hasProdEnv && !hasDevEnv) {
    await copyFile(prodEnvFile, devEnvFile);
    console.log('Created environment.development.ts from existing environment.ts.');
    return;
  }

  if (!hasProdEnv && hasDevEnv) {
    await copyFile(devEnvFile, prodEnvFile);
    console.log('Created environment.ts from existing environment.development.ts.');
    return;
  }

  const supabaseUrl = firstDefinedValue(
    process.env.SUPABASE_URL,
    process.env.NG_APP_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_URL,
  );
  const supabaseKey = firstDefinedValue(
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_KEY,
    process.env.NG_APP_SUPABASE_KEY,
    process.env.PUBLIC_SUPABASE_KEY,
  );

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      'Missing Angular environment files and missing Supabase variables. ' +
      'Set SUPABASE_URL plus SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY / SUPABASE_KEY) before building.'
    );
    process.exit(1);
  }

  await writeFile(prodEnvFile, renderEnvironmentFile(true, supabaseUrl, supabaseKey));
  await writeFile(devEnvFile, renderEnvironmentFile(false, supabaseUrl, supabaseKey));

  console.log('Generated Angular environment files from Supabase environment variables.');
}

await ensureEnvironmentFiles();
