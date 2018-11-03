const logger = require('app/common/log/logger.service');
const { postgres } = require('configuration/database/database-configuration.service')
const knex = require('knex');
const persistence = knex(postgres);

async function emptyDatabase(shallExit) {
  const clearingSQL = `
    SELECT setval('"public"."transaction_id_seq"', 1, false);
    SELECT setval('"public"."currency_id_seq"', 1, false);
    SELECT setval('"public"."transaction_type_id_seq"', 1, false);
    SELECT setval('"public"."transaction_state_id_seq"', 1, false);
    SELECT setval('"public"."clearing_id_seq"', 1, false);
    SELECT setval('"public"."clearing_type_id_seq"', 1, false);
    
    do
     $$
      declare
        l_stmt text;
      begin 
        select 'truncate ' || string_agg(format('%I.%I', schemaname, tablename), ',')
        into l_stmt 
        from pg_tables
        where schemaname in ('public') and 
        tablename not in ('knex_migrations', 'knex_migrations_lock');
        execute l_stmt;
      end;
      $$
  `;
  try {
    await persistence.raw(clearingSQL);
    logger.info('Successful clearing');
    if(shallExit) {
      process.exit();
    }
  } catch(error) {
    console.log(error);
    logger.error('Database error');
    logger.error(error);
    process.exit(-1);
  }
}
async function seedInitial() {
  await emptyDatabase();
  async function transaction(t) {
    const insertConfigurationSQL = `
      INSERT INTO "public"."configuration" VALUES (1, null, 6258187);
    `;

    await t.raw(insertConfigurationSQL);
  }

  try {
    await persistence.transaction(transaction);
    logger.info('Successful seeding');
    process.exit();
  } catch(error) {
    console.error(error);
    logger.error('Database error');
    logger.error(error);
    process.exit(-1);
  }
}

switch(process.argv[2]) {
  case 'clear':
    emptyDatabase(true);
    break;
  case 'initial':
    seedInitial();
    break;
  default:
    logger.warn('Available options');
    logger.warn('clear');
    logger.warn('initial');
}