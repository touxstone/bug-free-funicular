--
-- PostgreSQL database dump
--

\restrict 1YrIhEMBPrfj7hA88hblwUVjPE2VdXl7WO2rmWX9Q1f1wrplsdjBuddctZsGnFd

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: app_user
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO app_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: meter_readings; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public.meter_readings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    reading_date date NOT NULL,
    reading_value numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.meter_readings OWNER TO app_user;

--
-- Name: meter_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public.meter_readings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.meter_readings_id_seq OWNER TO app_user;

--
-- Name: meter_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public.meter_readings_id_seq OWNED BY public.meter_readings.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: app_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO app_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: app_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO app_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: app_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: meter_readings id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.meter_readings ALTER COLUMN id SET DEFAULT nextval('public.meter_readings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: meter_readings; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public.meter_readings (id, user_id, reading_date, reading_value, created_at, updated_at) FROM stdin;
1	1	2026-01-25	13636.02	2026-03-18 20:17:21.149155	2026-03-18 20:17:21.149155
2	2	2026-01-25	7209.31	2026-03-18 20:17:58.844325	2026-03-18 20:17:58.844325
3	3	2026-01-25	2685.06	2026-03-18 20:18:27.308039	2026-03-18 20:18:27.308039
4	4	2026-01-25	5027.06	2026-03-18 20:18:57.979637	2026-03-18 20:18:57.979637
5	5	2026-01-25	10927.03	2026-03-18 20:19:27.528537	2026-03-18 20:19:27.528537
6	6	2026-01-25	11494.55	2026-03-18 20:19:49.672789	2026-03-18 20:19:49.672789
8	2	2026-02-04	7227.12	2026-03-18 20:23:13.070404	2026-03-18 20:23:13.070404
9	3	2026-02-04	2685.06	2026-03-18 20:23:41.714875	2026-03-18 20:23:41.714875
10	4	2026-02-04	5054.17	2026-03-18 20:24:19.98613	2026-03-18 20:24:19.98613
11	5	2026-02-04	10927.03	2026-03-18 20:24:48.544805	2026-03-18 20:24:48.544805
12	6	2026-02-04	11515.66	2026-03-18 20:26:50.383351	2026-03-18 20:26:50.383351
14	2	2026-02-22	7243.24	2026-03-18 20:28:23.042635	2026-03-18 20:28:23.042635
15	3	2026-02-22	2685.06	2026-03-18 20:29:06.669159	2026-03-18 20:29:06.669159
16	4	2026-02-22	5088.42	2026-03-18 20:29:37.156317	2026-03-18 20:29:37.156317
17	5	2026-02-22	10938.95	2026-03-18 20:30:05.968563	2026-03-18 20:30:05.968563
18	6	2026-02-22	11538.77	2026-03-18 20:30:29.375211	2026-03-18 20:30:29.375211
20	2	2026-03-10	7245.36	2026-03-18 20:32:53.972628	2026-03-18 20:32:53.972628
21	3	2026-03-10	2685.06	2026-03-18 20:33:33.440962	2026-03-18 20:33:33.440962
22	4	2026-03-10	5103.38	2026-03-18 20:34:06.15169	2026-03-18 20:34:06.15169
23	5	2026-03-10	10939.98	2026-03-18 20:34:29.821628	2026-03-18 20:34:29.821628
24	6	2026-03-10	11542.74	2026-03-18 20:34:58.042569	2026-03-18 20:34:58.042569
25	1	2026-03-17	13636.02	2026-03-18 20:37:46.277477	2026-03-18 20:37:46.277477
26	3	2026-03-17	2685.06	2026-03-18 20:39:16.971651	2026-03-18 20:39:16.971651
27	4	2026-03-17	5107.50	2026-03-18 20:39:40.981559	2026-03-18 20:39:40.981559
28	5	2026-03-17	10939.98	2026-03-18 20:40:01.088628	2026-03-18 20:40:01.088628
29	6	2026-03-17	11542.74	2026-03-18 20:40:21.910285	2026-03-18 20:40:21.910285
7	1	2026-02-04	13636.02	2026-03-18 20:22:45.015979	2026-03-18 20:56:47.854242
13	1	2026-02-22	13636.02	2026-03-18 20:27:54.327919	2026-03-18 20:57:04.448037
19	1	2026-03-10	13636.02	2026-03-18 20:32:29.753082	2026-03-18 20:58:00.487367
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: app_user
--

COPY public.users (id, username) FROM stdin;
1	usuario_1
2	usuario_2
3	usuario_3
4	usuario_4
5	usuario_5
6	usuario_6
7	usuario_7
8	usuario_8
9	usuario_9
10	usuario_10
\.


--
-- Name: meter_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public.meter_readings_id_seq', 29, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: app_user
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- Name: meter_readings meter_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.meter_readings
    ADD CONSTRAINT meter_readings_pkey PRIMARY KEY (id);


--
-- Name: meter_readings meter_readings_user_id_reading_date_key; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.meter_readings
    ADD CONSTRAINT meter_readings_user_id_reading_date_key UNIQUE (user_id, reading_date);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: meter_readings update_meter_readings_updated_at; Type: TRIGGER; Schema: public; Owner: app_user
--

CREATE TRIGGER update_meter_readings_updated_at BEFORE UPDATE ON public.meter_readings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: meter_readings meter_readings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: app_user
--

ALTER TABLE ONLY public.meter_readings
    ADD CONSTRAINT meter_readings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 1YrIhEMBPrfj7hA88hblwUVjPE2VdXl7WO2rmWX9Q1f1wrplsdjBuddctZsGnFd

