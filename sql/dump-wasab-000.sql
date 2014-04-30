CREATE ROLE dev LOGIN
  NOSUPERUSER INHERIT CREATEDB NOCREATEROLE NOREPLICATION;


ALTER USER dev with password 'dev' 

CREATE DATABASE wasab
  WITH OWNER = dev
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'English_United States.1252'
       LC_CTYPE = 'English_United States.1252'
       CONNECTION LIMIT = -1;

COMMENT ON DATABASE wasab
  IS 'Web Authorization Store & API for Business';