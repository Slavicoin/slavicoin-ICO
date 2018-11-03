
exports.up = function(knex) {
  const sql = `
    CREATE TABLE
      "public"."configuration" (
        "id" int8 NOT NULL,
        "currentBlock"  int8,
        "defaultBlock" int8 NOT NULL,
        PRIMARY KEY ("id")
      );
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS "public"."configuration" CASCADE; 
  `;

  return knex.raw(sql);
};
