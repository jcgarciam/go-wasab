--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.4
-- Dumped by pg_dump version 9.3.4
-- Started on 2014-04-30 17:37:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 2028 (class 1262 OID 16394)
-- Dependencies: 2027
-- Name: wasab; Type: COMMENT; Schema: -; Owner: dev
--

COMMENT ON DATABASE wasab IS 'Web Authorization Store & API for Business';


--
-- TOC entry 184 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2031 (class 0 OID 0)
-- Dependencies: 184
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 185 (class 3079 OID 16576)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2032 (class 0 OID 0)
-- Dependencies: 185
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 171 (class 1259 OID 16397)
-- Name: applications; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE applications (
    id integer NOT NULL,
    name character varying(50),
    public_id character varying(50) DEFAULT (uuid_generate_v4())::character varying,
    enabled boolean NOT NULL
);


ALTER TABLE public.applications OWNER TO dev;

--
-- TOC entry 170 (class 1259 OID 16395)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applications_id_seq OWNER TO dev;

--
-- TOC entry 2033 (class 0 OID 0)
-- Dependencies: 170
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE applications_id_seq OWNED BY applications.id;


--
-- TOC entry 175 (class 1259 OID 16442)
-- Name: groups; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE groups (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    application_id integer
);


ALTER TABLE public.groups OWNER TO dev;

--
-- TOC entry 174 (class 1259 OID 16440)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.groups_id_seq OWNER TO dev;

--
-- TOC entry 2034 (class 0 OID 0)
-- Dependencies: 174
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- TOC entry 180 (class 1259 OID 25857)
-- Name: groups_operations; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE groups_operations (
    group_id integer NOT NULL,
    operation_id integer NOT NULL
);


ALTER TABLE public.groups_operations OWNER TO dev;

--
-- TOC entry 182 (class 1259 OID 34385)
-- Name: operations; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE operations (
    id integer NOT NULL,
    application_id integer NOT NULL,
    code character varying(50) NOT NULL,
    description character varying(150) NOT NULL
);


ALTER TABLE public.operations OWNER TO dev;

--
-- TOC entry 181 (class 1259 OID 34383)
-- Name: operations_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE operations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.operations_id_seq OWNER TO dev;

--
-- TOC entry 2035 (class 0 OID 0)
-- Dependencies: 181
-- Name: operations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE operations_id_seq OWNED BY operations.id;


--
-- TOC entry 173 (class 1259 OID 16405)
-- Name: roles; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    enabled boolean NOT NULL
);


ALTER TABLE public.roles OWNER TO dev;

--
-- TOC entry 178 (class 1259 OID 17690)
-- Name: roles_groups; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE roles_groups (
    role_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.roles_groups OWNER TO dev;

--
-- TOC entry 172 (class 1259 OID 16403)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO dev;

--
-- TOC entry 2036 (class 0 OID 0)
-- Dependencies: 172
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- TOC entry 183 (class 1259 OID 34407)
-- Name: roles_operations; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE roles_operations (
    role_id integer NOT NULL,
    operation_id integer NOT NULL
);


ALTER TABLE public.roles_operations OWNER TO dev;

--
-- TOC entry 177 (class 1259 OID 16901)
-- Name: users; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    ext_code character varying(50),
    enabled boolean NOT NULL
);


ALTER TABLE public.users OWNER TO dev;

--
-- TOC entry 176 (class 1259 OID 16899)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO dev;

--
-- TOC entry 2037 (class 0 OID 0)
-- Dependencies: 176
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 179 (class 1259 OID 17696)
-- Name: users_roles; Type: TABLE; Schema: public; Owner: dev; Tablespace: 
--

CREATE TABLE users_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


ALTER TABLE public.users_roles OWNER TO dev;

--
-- TOC entry 1874 (class 2604 OID 16400)
-- Name: id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY applications ALTER COLUMN id SET DEFAULT nextval('applications_id_seq'::regclass);


--
-- TOC entry 1877 (class 2604 OID 17653)
-- Name: id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- TOC entry 1879 (class 2604 OID 34388)
-- Name: id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY operations ALTER COLUMN id SET DEFAULT nextval('operations_id_seq'::regclass);


--
-- TOC entry 1876 (class 2604 OID 16408)
-- Name: id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- TOC entry 1878 (class 2604 OID 16904)
-- Name: id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 1881 (class 2606 OID 34373)
-- Name: applications_name_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY applications
    ADD CONSTRAINT applications_name_key UNIQUE (name);


--
-- TOC entry 1883 (class 2606 OID 16402)
-- Name: applications_pk; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY applications
    ADD CONSTRAINT applications_pk PRIMARY KEY (id);


--
-- TOC entry 1889 (class 2606 OID 34036)
-- Name: groups_name_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_name_key UNIQUE (name);


--
-- TOC entry 1899 (class 2606 OID 34401)
-- Name: groups_operations_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY groups_operations
    ADD CONSTRAINT groups_operations_pkey PRIMARY KEY (group_id, operation_id);


--
-- TOC entry 1901 (class 2606 OID 34415)
-- Name: operations_application_id_code_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY operations
    ADD CONSTRAINT operations_application_id_code_key UNIQUE (application_id, code);


--
-- TOC entry 1903 (class 2606 OID 34413)
-- Name: operations_application_id_description_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY operations
    ADD CONSTRAINT operations_application_id_description_key UNIQUE (application_id, description);


--
-- TOC entry 1905 (class 2606 OID 34390)
-- Name: operations_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY operations
    ADD CONSTRAINT operations_pkey PRIMARY KEY (id);


--
-- TOC entry 1885 (class 2606 OID 16472)
-- Name: roles_name_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- TOC entry 1907 (class 2606 OID 34411)
-- Name: roles_operations_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY roles_operations
    ADD CONSTRAINT roles_operations_pkey PRIMARY KEY (role_id, operation_id);


--
-- TOC entry 1887 (class 2606 OID 16410)
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 1891 (class 2606 OID 16447)
-- Name: tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 1893 (class 2606 OID 34038)
-- Name: users_ext_code_key; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_ext_code_key UNIQUE (ext_code);


--
-- TOC entry 1895 (class 2606 OID 16906)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 1897 (class 2606 OID 17700)
-- Name: users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: dev; Tablespace: 
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 1908 (class 2606 OID 17654)
-- Name: groups_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_application_id_fkey FOREIGN KEY (application_id) REFERENCES applications(id);


--
-- TOC entry 1913 (class 2606 OID 25865)
-- Name: groups_operations_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY groups_operations
    ADD CONSTRAINT groups_operations_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id);


--
-- TOC entry 1914 (class 2606 OID 34402)
-- Name: groups_operations_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY groups_operations
    ADD CONSTRAINT groups_operations_operation_id_fkey FOREIGN KEY (operation_id) REFERENCES operations(id);


--
-- TOC entry 1915 (class 2606 OID 34395)
-- Name: operations_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY operations
    ADD CONSTRAINT operations_application_id_fkey FOREIGN KEY (application_id) REFERENCES applications(id);


--
-- TOC entry 1910 (class 2606 OID 17716)
-- Name: roles_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY roles_groups
    ADD CONSTRAINT roles_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id);


--
-- TOC entry 1909 (class 2606 OID 17711)
-- Name: roles_groups_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY roles_groups
    ADD CONSTRAINT roles_groups_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 1911 (class 2606 OID 17701)
-- Name: users_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT users_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 1912 (class 2606 OID 17706)
-- Name: users_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY users_roles
    ADD CONSTRAINT users_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- TOC entry 2030 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2014-04-30 17:37:10

--
-- PostgreSQL database dump complete
--

