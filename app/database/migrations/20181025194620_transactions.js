
exports.up = function(knex) {
  const sql = `    
    CREATE SEQUENCE
      "public"."transaction_id_seq" 
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
    
    CREATE SEQUENCE
      "public"."currency_id_seq" 
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;    
    
    CREATE SEQUENCE
      "public"."transaction_type_id_seq" 
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
  
    CREATE TABLE
      "public"."currency" (
        "id" int2 NOT NULL DEFAULT nextval('"public".currency_id_seq'::regclass),
        "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
        PRIMARY KEY ("id")
      );    
    CREATE TABLE
      "public"."transaction_type" (
        "id" int2 NOT NULL DEFAULT nextval('"public".transaction_type_id_seq'::regclass),
        "name" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
        PRIMARY KEY ("id")
      );                
                      
    CREATE TABLE
      "public"."transaction" (
        "id" int2 NOT NULL DEFAULT nextval('"public".transaction_id_seq'::regclass),
        "hash" varchar(64) COLLATE "pg_catalog"."default" NOT NULL,
        "timestamp" timestamp DEFAULT NULL,
        "transaction_timestamp" timestamp DEFAULT NOW(),
        "value" int2 NOT NULL DEFAULT 1,
        "type" int2 NOT NULL DEFAULT 1,
        PRIMARY KEY ("id"),
        CONSTRAINT "t_type_fk" FOREIGN KEY ("type") REFERENCES "public"."transaction_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "t_currency_fk" FOREIGN KEY ("value") REFERENCES "public"."currency" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
        
    `;
  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP SEQUENCE IF EXISTS "public"."transaction_id_seq" CASCADE; 
    DROP SEQUENCE IF EXISTS "public"."currency_id_seq" CASCADE; 
    DROP SEQUENCE IF EXISTS "public"."transaction_type_id_seq" CASCADE; 

    
    DROP TABLE IF EXISTS "public"."currency" CASCADE;
    DROP TABLE IF EXISTS "public"."transaction_type" CASCADE;
    DROP TABLE IF EXISTS "public"."transaction" CASCADE;

  `;
  return knex.raw(sql);
};
