
exports.up = function(knex, Promise) {
  const sql = `
    CREATE SEQUENCE
      "public"."clearing_id_seq" 
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
    
    CREATE SEQUENCE
      "public"."clearing_type_id_seq" 
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
    
    CREATE TABLE
      "public"."clearing_type" (
        "id" int2 NOT NULL DEFAULT nextval('"public".clearing_type_id_seq'::regclass),
        "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
        PRIMARY KEY ("id")
      );
    CREATE TABLE
      "public"."clearing" (
        "id" int2 NOT NULL DEFAULT nextval('"public".clearing_id_seq'::regclass),
        "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
        "type"  int2 DEFAULT 1,
        PRIMARY KEY ("id"),
        CONSTRAINT "c_type_fk" FOREIGN KEY ("type") REFERENCES "public"."clearing_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
  `;
  return knex.raw(sql);
};

exports.down = function(knex, Promise) {
  const sql = `
    DROP SEQUENCE IF EXISTS "public"."clearing_id_seq" CASCADE; 
    DROP SEQUENCE IF EXISTS "public"."clearing_type_id_seq" CASCADE; 
    
    DROP TABLE IF EXISTS "public"."clearing" CASCADE; 
    DROP TABLE IF EXISTS "public"."clearing_type" CASCADE; 
  `;
  return knex.raw(sql);
};
