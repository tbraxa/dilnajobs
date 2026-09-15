-- Ensure the non-bypass app role can use tables after hosted CREATE ROLE.
-- RLS only applies to roles without BYPASSRLS (do not use the Neon owner as DATABASE_URL).

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    BEGIN
      EXECUTE format('GRANT CONNECT ON DATABASE %I TO dilna_app', current_database());
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'skip GRANT CONNECT: %', SQLERRM;
    END;
    GRANT USAGE ON SCHEMA public TO dilna_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dilna_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO dilna_app;
    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO dilna_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO dilna_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO dilna_app;
  END IF;
END
$$;
