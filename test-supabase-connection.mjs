/**
 * Script kiểm tra kết nối Supabase cho cả 3 project
 * 
 * HƯỚNG DẪN:
 * 1. Vào https://supabase.com/dashboard/project/wtezillfvsdkjfctrimi/settings/api
 * 2. Copy "anon public" key vào SUPABASE_ANON_KEY bên dưới
 * 3. Vào https://supabase.com/dashboard/project/wtezillfvsdkjfctrimi/settings/database
 * 4. Copy DB Password vào DB_PASSWORD bên dưới
 * 5. Chạy: node test-supabase-connection.mjs
 */

// ============================================================
// ⚠️  ĐIỀN THÔNG TIN VÀO ĐÂY
// ============================================================
const SUPABASE_URL = 'https://wtezillfvsdkjfctrimi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cAJhDWxpKcVlsP-OlQALbQ_YXBGIRw1';
const DB_PASSWORD = 'Donhotung2004';
// ============================================================

const colors = {
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  blue:   (t) => `\x1b[34m${t}\x1b[0m`,
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
};

const log = {
  ok:   (msg) => console.log(`  ${colors.green('✅')} ${msg}`),
  fail: (msg) => console.log(`  ${colors.red('❌')} ${msg}`),
  info: (msg) => console.log(`  ${colors.blue('ℹ')}  ${msg}`),
  warn: (msg) => console.log(`  ${colors.yellow('⚠')}  ${msg}`),
};

async function testSupabaseREST() {
  console.log(colors.bold('\n━━━ 1. Kiểm tra Supabase REST API ━━━'));
  
  // Check if placeholder still
  if (SUPABASE_ANON_KEY.includes('[YOUR-')) {
    log.warn('Chưa điền SUPABASE_ANON_KEY. Bỏ qua test REST API.');
    return false;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      log.ok(`REST API kết nối thành công! (${res.status})`);
      log.info(`Số đơn hàng trả về: ${Array.isArray(data) ? data.length : 'N/A'}`);
      return true;
    } else if (res.status === 401) {
      log.fail(`Sai Anon Key (401 Unauthorized)`);
    } else if (res.status === 404) {
      log.warn(`Table 'orders' chưa tồn tại (404) - cần chạy migration`);
    } else {
      const body = await res.text();
      log.fail(`HTTP ${res.status}: ${body.substring(0, 100)}`);
    }
    return false;
  } catch (err) {
    log.fail(`Lỗi kết nối: ${err.message}`);
    return false;
  }
}

async function testPostgresDirect() {
  console.log(colors.bold('\n━━━ 2. Kiểm tra PostgreSQL Direct Connection ━━━'));

  if (DB_PASSWORD.includes('[YOUR-')) {
    log.warn('Chưa điền DB_PASSWORD. Bỏ qua test PostgreSQL.');
    return false;
  }

  const { default: pg } = await import('pg').catch(() => ({ default: null }));
  if (!pg) {
    log.warn('Package "pg" chưa cài. Chạy: npm install pg');
    return false;
  }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: `postgresql://postgres:${DB_PASSWORD}@db.wtezillfvsdkjfctrimi.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT version(), NOW()');
    client.release();
    await pool.end();
    
    const version = res.rows[0].version.substring(0, 50);
    log.ok(`PostgreSQL Direct Connection thành công!`);
    log.info(`Version: ${version}...`);
    log.info(`Server time: ${res.rows[0].now}`);
    return true;
  } catch (err) {
    await pool.end().catch(() => {});
    if (err.message.includes('password authentication failed')) {
      log.fail(`Sai DB Password`);
    } else if (err.message.includes('ECONNREFUSED') || err.message.includes('timeout')) {
      log.fail(`Không thể kết nối đến Supabase DB host: ${err.message}`);
    } else {
      log.fail(`PostgreSQL error: ${err.message}`);
    }
    return false;
  }
}

async function testPostgresPooler() {
  console.log(colors.bold('\n━━━ 3. Kiểm tra Transaction Pooler (cho Next.js) ━━━'));

  if (DB_PASSWORD.includes('[YOUR-')) {
    log.warn('Chưa điền DB_PASSWORD. Bỏ qua test Pooler.');
    return false;
  }

  const { default: pg } = await import('pg').catch(() => ({ default: null }));
  if (!pg) {
    log.warn('Package "pg" chưa cài trong thư mục này.');
    return false;
  }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: `postgresql://postgres.wtezillfvsdkjfctrimi:${DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    await pool.end();
    
    log.ok(`Transaction Pooler kết nối thành công!`);
    log.info(`Server time: ${res.rows[0].now}`);
    return true;
  } catch (err) {
    await pool.end().catch(() => {});
    log.fail(`Pooler error: ${err.message}`);
    return false;
  }
}

async function checkTablesExist() {
  console.log(colors.bold('\n━━━ 4. Kiểm tra Database Tables ━━━'));

  if (SUPABASE_ANON_KEY.includes('[YOUR-')) {
    log.warn('Chưa điền SUPABASE_ANON_KEY. Bỏ qua kiểm tra tables.');
    return;
  }

  const tables = ['orders', 'customers', 'products', 'order_items', 'printers', 'app_settings'];
  
  for (const table of tables) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      
      if (res.status === 200) {
        log.ok(`Table '${table}' tồn tại`);
      } else if (res.status === 404) {
        log.fail(`Table '${table}' CHƯA tồn tại → cần chạy migration`);
      } else {
        log.warn(`Table '${table}': HTTP ${res.status}`);
      }
    } catch {
      log.fail(`Không thể kiểm tra table '${table}'`);
    }
  }
}

async function main() {
  console.log(colors.bold(colors.blue('\n🔍 SUPABASE CONNECTION TEST')));
  console.log(`   Project ID: wtezillfvsdkjfctrimi`);
  console.log(`   URL: ${SUPABASE_URL}`);
  
  // Check if any credentials are filled
  const hasAnonKey = !SUPABASE_ANON_KEY.includes('[YOUR-');
  const hasDbPassword = !DB_PASSWORD.includes('[YOUR-');
  
  if (!hasAnonKey && !hasDbPassword) {
    console.log(colors.red('\n⚠️  CHƯA ĐIỀN CREDENTIALS!\n'));
    console.log('Vui lòng:');
    console.log('  1. Mở file test-supabase-connection.mjs');
    console.log('  2. Điền SUPABASE_ANON_KEY từ: https://supabase.com/dashboard/project/wtezillfvsdkjfctrimi/settings/api');
    console.log('  3. Điền DB_PASSWORD từ:        https://supabase.com/dashboard/project/wtezillfvsdkjfctrimi/settings/database');
    console.log('  4. Chạy lại: node test-supabase-connection.mjs\n');
    process.exit(0);
  }

  const [restOk, pgOk] = await Promise.allSettled([
    testSupabaseREST(),
    testPostgresDirect(),
  ]);
  
  await testPostgresPooler();
  await checkTablesExist();

  console.log(colors.bold('\n━━━ KẾT QUẢ ━━━'));
  const restSuccess = restOk.status === 'fulfilled' && restOk.value;
  const pgSuccess = pgOk.status === 'fulfilled' && pgOk.value;

  if (restSuccess) log.ok('nilon-website (Next.js): Kết nối Supabase ✓');
  else log.fail('nilon-website (Next.js): Kết nối Supabase ✗');

  if (pgSuccess) log.ok('nilon-invoices (Electron): Kết nối PostgreSQL ✓');
  else log.fail('nilon-invoices (Electron): Kết nối PostgreSQL ✗');

  console.log('');

  if (restSuccess && pgSuccess) {
    console.log(colors.green(colors.bold('  🎉 Tất cả kết nối thành công!')));
    console.log(colors.green('  Bước tiếp theo: cd nilon-website && npx prisma db push'));
  } else {
    console.log(colors.yellow('  Một số kết nối thất bại. Kiểm tra lại credentials.'));
  }
  console.log('');
}

main().catch(console.error);
