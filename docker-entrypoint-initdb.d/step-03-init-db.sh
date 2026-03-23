#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<EOSQL
  -- NOTE: in bash heredoc $$ expands to the shell PID, so we must escape it
  DO \$\$
  BEGIN
    -- Если роль не создана (например, при повторном старте с уже существующим volume),
    -- не падаем на init-скрипте.
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$DATABASE_USER') THEN
      GRANT ALL ON ALL TABLES IN SCHEMA public TO "$DATABASE_USER";
    END IF;
  END \$\$;
EOSQL