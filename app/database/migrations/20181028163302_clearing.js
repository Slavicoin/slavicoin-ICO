
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
    CREATE TABLE
      "public"."clearing_transactions" (
        "clearing_id" int2 NOT NULL,
        "incoming_id" int2 NOT NULL,
        "outgoing_id" int2 NOT NULL,
        PRIMARY KEY ("clearing_id", "incoming_id", "outgoing_id"),
        CONSTRAINT "ct_clearing_fk" FOREIGN KEY ("clearing_id") REFERENCES "public"."clearing" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "ct_incoming_fk" FOREIGN KEY ("incoming_id") REFERENCES "public"."transaction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "ct_outgoing_fk" FOREIGN KEY ("outgoing_id") REFERENCES "public"."transaction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION

      );
  `;
  return knex.raw(sql);
};

exports.down = function(knex, Promise) {
  const sql = `
    DROP SEQUENCE IF EXISTS "public"."clearing_id_seq" CASCADE; 
    DROP SEQUENCE IF EXISTS "public"."clearing_type_id_seq" CASCADE; 
    
    DROP TABLE IF EXISTS "public"."clearing_transactions" CASCADE; 
    DROP TABLE IF EXISTS "public"."clearing" CASCADE; 
    DROP TABLE IF EXISTS "public"."clearing_type" CASCADE; 
  `;
  return knex.raw(sql);
};
