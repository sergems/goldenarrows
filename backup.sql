--
-- PostgreSQL database dump
--

\restrict 95lvb7PgpmcuXnLgwcPei4KghzrgJ5xkrGCX3irckOOuEWNTfN6aTezjc6abJ3g

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enquiries (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'unread'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enquiries OWNER TO postgres;

--
-- Name: enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enquiries_id_seq OWNER TO postgres;

--
-- Name: enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enquiries_id_seq OWNED BY public.enquiries.id;


--
-- Name: fixtures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fixtures (
    id integer NOT NULL,
    date text NOT NULL,
    "time" text,
    home_team text NOT NULL,
    away_team text NOT NULL,
    competition text DEFAULT 'DStv Premiership'::text NOT NULL,
    venue text NOT NULL,
    ticket_url text,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fixtures OWNER TO postgres;

--
-- Name: fixtures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fixtures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fixtures_id_seq OWNER TO postgres;

--
-- Name: fixtures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fixtures_id_seq OWNED BY public.fixtures.id;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery (
    id integer NOT NULL,
    title text NOT NULL,
    type text DEFAULT 'photo'::text NOT NULL,
    url text NOT NULL,
    thumbnail_url text,
    category text DEFAULT 'matches'::text NOT NULL,
    caption text,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery OWNER TO postgres;

--
-- Name: gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gallery_id_seq OWNER TO postgres;

--
-- Name: gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_id_seq OWNED BY public.gallery.id;


--
-- Name: league_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.league_table (
    id integer NOT NULL,
    "position" integer NOT NULL,
    team text NOT NULL,
    logo_url text,
    played integer DEFAULT 0 NOT NULL,
    won integer DEFAULT 0 NOT NULL,
    drawn integer DEFAULT 0 NOT NULL,
    lost integer DEFAULT 0 NOT NULL,
    goals_for integer DEFAULT 0 NOT NULL,
    goals_against integer DEFAULT 0 NOT NULL,
    goal_difference integer DEFAULT 0 NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    is_golden_arrows boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.league_table OWNER TO postgres;

--
-- Name: league_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.league_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.league_table_id_seq OWNER TO postgres;

--
-- Name: league_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.league_table_id_seq OWNED BY public.league_table.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text,
    category text DEFAULT 'club'::text NOT NULL,
    image_url text NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    author text DEFAULT 'Golden Arrows FC'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    published_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.news_id_seq OWNER TO postgres;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: players; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.players (
    id integer NOT NULL,
    name text NOT NULL,
    "position" text NOT NULL,
    number integer NOT NULL,
    nationality text NOT NULL,
    age integer,
    photo_url text,
    bio text,
    appearances integer DEFAULT 0 NOT NULL,
    goals integer DEFAULT 0 NOT NULL,
    assists integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.players OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.players_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.players_id_seq OWNER TO postgres;

--
-- Name: players_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.players_id_seq OWNED BY public.players.id;


--
-- Name: results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.results (
    id integer NOT NULL,
    date text NOT NULL,
    home_team text NOT NULL,
    away_team text NOT NULL,
    home_score integer NOT NULL,
    away_score integer NOT NULL,
    competition text DEFAULT 'DStv Premiership'::text NOT NULL,
    venue text,
    scorers text[] DEFAULT '{}'::text[] NOT NULL,
    match_report text,
    highlight_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.results OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.results_id_seq OWNER TO postgres;

--
-- Name: results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;


--
-- Name: slides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.slides (
    id integer NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    subtitle text,
    link text,
    link_label text,
    sort_order integer DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.slides OWNER TO postgres;

--
-- Name: slides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.slides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.slides_id_seq OWNER TO postgres;

--
-- Name: slides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.slides_id_seq OWNED BY public.slides.id;


--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sponsors (
    id integer NOT NULL,
    name text NOT NULL,
    logo_url text NOT NULL,
    website_url text,
    tier text DEFAULT 'partner'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sponsors OWNER TO postgres;

--
-- Name: sponsors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sponsors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sponsors_id_seq OWNER TO postgres;

--
-- Name: sponsors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sponsors_id_seq OWNED BY public.sponsors.id;


--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    name text NOT NULL,
    role text NOT NULL,
    photo_url text,
    bio text,
    nationality text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- Name: enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enquiries ALTER COLUMN id SET DEFAULT nextval('public.enquiries_id_seq'::regclass);


--
-- Name: fixtures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixtures ALTER COLUMN id SET DEFAULT nextval('public.fixtures_id_seq'::regclass);


--
-- Name: gallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery ALTER COLUMN id SET DEFAULT nextval('public.gallery_id_seq'::regclass);


--
-- Name: league_table id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league_table ALTER COLUMN id SET DEFAULT nextval('public.league_table_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: players id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players ALTER COLUMN id SET DEFAULT nextval('public.players_id_seq'::regclass);


--
-- Name: results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);


--
-- Name: slides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slides ALTER COLUMN id SET DEFAULT nextval('public.slides_id_seq'::regclass);


--
-- Name: sponsors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsors ALTER COLUMN id SET DEFAULT nextval('public.sponsors_id_seq'::regclass);


--
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enquiries (id, first_name, last_name, email, subject, message, status, created_at) FROM stdin;
1	Test	User	test@test.com	Website Test	This is a test enquiry to confirm the form works correctly.	resolved	2026-06-02 07:40:04.757247+00
\.


--
-- Data for Name: fixtures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fixtures (id, date, "time", home_team, away_team, competition, venue, ticket_url, completed, created_at) FROM stdin;
1	2026-06-14	15:00	Golden Arrows FC	Mamelodi Sundowns	DStv Premiership	Princess Magogo Stadium	\N	f	2026-06-01 10:51:26.789401+00
2	2026-06-21	15:00	AmaZulu FC	Golden Arrows FC	DStv Premiership	Moses Mabhida Stadium	\N	f	2026-06-01 10:51:28.040813+00
3	2026-06-28	15:00	Golden Arrows FC	Orlando Pirates	DStv Premiership	Princess Magogo Stadium	\N	f	2026-06-01 10:51:29.259643+00
4	2026-07-05	15:00	Kaizer Chiefs	Golden Arrows FC	DStv Premiership	FNB Stadium	\N	f	2026-06-01 10:51:30.702173+00
5	2026-07-12	15:00	Golden Arrows FC	Cape Town City	DStv Premiership	Princess Magogo Stadium	\N	f	2026-06-01 10:51:31.907605+00
\.


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery (id, title, type, url, thumbnail_url, category, caption, published_at, created_at) FROM stdin;
\.


--
-- Data for Name: league_table; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.league_table (id, "position", team, logo_url, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, is_golden_arrows, updated_at) FROM stdin;
17	1	Mamelodi Sundowns	\N	28	24	1	3	65	13	52	73	f	2026-06-07 18:18:54.291642+00
18	2	Orlando Pirates	\N	28	19	4	5	43	20	23	61	f	2026-06-07 18:18:54.291642+00
19	3	Stellenbosch	\N	28	13	9	6	34	21	13	48	f	2026-06-07 18:18:54.291642+00
20	4	Sekhukhune United	\N	28	13	7	8	39	31	8	46	f	2026-06-07 18:18:54.291642+00
21	5	TS Galaxy	\N	28	8	11	9	30	30	0	35	f	2026-06-07 18:18:54.291642+00
22	6	Amazulu	\N	28	10	5	13	29	34	-5	35	f	2026-06-07 18:18:54.291642+00
23	7	Polokwane City	\N	28	8	10	10	19	25	-6	34	f	2026-06-07 18:18:54.291642+00
24	8	Richards Bay	\N	28	9	6	13	19	26	-7	33	f	2026-06-07 18:18:54.291642+00
25	9	Kaizer Chiefs	\N	28	8	8	12	25	32	-7	32	f	2026-06-07 18:18:54.291642+00
26	10	Marumo Gallants	\N	28	8	8	12	26	39	-13	32	f	2026-06-07 18:18:54.291642+00
27	11	Chippa United	\N	28	8	7	13	22	28	-6	31	f	2026-06-07 18:18:54.291642+00
28	12	Golden Arrows	\N	28	7	10	11	20	32	-12	31	t	2026-06-07 18:18:54.291642+00
29	13	Magesi	\N	28	8	7	13	19	31	-12	31	f	2026-06-07 18:18:54.291642+00
30	14	Supersport United	\N	28	6	9	13	18	30	-12	27	f	2026-06-07 18:18:54.291642+00
31	15	Cape Town City	\N	28	7	6	15	15	31	-16	27	f	2026-06-07 18:18:54.291642+00
32	16	Royal AM	\N	0	0	0	0	0	0	0	0	f	2026-06-07 18:18:54.291642+00
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, slug, excerpt, content, category, image_url, featured, author, tags, published_at, created_at) FROM stdin;
2	Knox Mutizwa Named PSL Player of the Month	knox-mutizwa-player-month	Our talismanic striker Knox Mutizwa has been recognised for his outstanding contributions in April, collecting 5 crucial goals.	Our talismanic striker Knox Mutizwa has been recognised for his outstanding contributions in April, collecting 5 crucial goals.	club-news	https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800	t	Arrows Media	{awards,knox-mutizwa}	2026-05-21 10:52:12.143813+00	2026-06-01 10:52:12.143813+00
3	Pre-Season Camp Announced for July 2025	preseason-camp-july-2025	The squad will head to a specially arranged pre-season training camp to prepare for the 2025/26 DStv Premiership season.	The squad will head to a specially arranged pre-season training camp to prepare for the 2025/26 DStv Premiership season.	club-news	https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800	f	Arrows Media	{pre-season,training}	2026-05-08 10:52:13.500985+00	2026-06-01 10:52:13.500985+00
4	Junior Arrows Youth Academy Trials Open	youth-academy-trials-2025	Golden Arrows FC is pleased to announce open trials for the Junior Arrows Youth Academy for talented players aged 10-16.	Golden Arrows FC is pleased to announce open trials for the Junior Arrows Youth Academy for talented players aged 10-16.	community	https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800	f	Community Team	{youth,academy,community}	2026-05-11 10:52:14.754139+00	2026-06-01 10:52:14.754139+00
5	Club Partners With Durban Community Schools	community-schools-partnership	As part of our ongoing commitment to KwaZulu-Natal, Golden Arrows has launched a new educational partnership with 10 Durban schools.	As part of our ongoing commitment to KwaZulu-Natal, Golden Arrows has launched a new educational partnership with 10 Durban schools.	community	https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800	f	Community Team	{community,education,KZN}	2026-05-10 10:52:15.913125+00	2026-06-01 10:52:15.913125+00
6	New Away Kit Unveiled for 2025/26 Season	away-kit-unveil-2025-26	Golden Arrows FC is delighted to unveil the stunning new away kit for the upcoming 2025/26 DStv Premiership season.	Golden Arrows FC is delighted to unveil the stunning new away kit for the upcoming 2025/26 DStv Premiership season.	club-news	https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800	f	Arrows Media	{kit,fashion,2025-26}	2026-05-06 10:52:17.261668+00	2026-06-01 10:52:17.261668+00
11	Golden Arrows Sign Sere Mulayi	golden-arrows-sign-sere-mulayi-1780851457720	Lamontville Golden Arrows FC are delighted to announce the signing of Sere Mulayi, Zambian forward.	Zambian forward Sere Mulayi joins Lamontville Golden Arrows FC. The 22-year-old signing wears the number 95 shirt and is set to strengthen the Abafana Bes'thende squad.\n\n"We are delighted to welcome Sere to the club," said a club spokesperson.\n\nSere Mulayi is available immediately and the club wishes him every success in the famous Golden Arrows colours.	Transfer News	/api/uploads/1780851445683-bp6ddt.jpeg	f	Golden Arrows FC	{Transfer,Squad,Signing}	2026-06-07 16:57:40.084629+00	2026-06-07 16:57:40.084629+00
\.


--
-- Data for Name: players; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.players (id, name, "position", number, nationality, age, photo_url, bio, appearances, goals, assists, created_at) FROM stdin;
2	Nkosinathi Sibisi	Goalkeeper	16	South African	24	\N	Promising backup goalkeeper pushing for a starting spot.	4	0	0	2026-06-01 10:50:33.020218+00
3	Nhlanhla Vilakazi	Defender	5	South African	27	\N	Commanding center-back and club captain. A leader on and off the pitch.	21	1	2	2026-06-01 10:50:34.897998+00
4	Mondli Mpungose	Defender	3	South African	25	\N	Pacey left-back who contributes going forward.	19	0	1	2026-06-01 10:50:36.051642+00
5	Thabo Molefe	Defender	4	South African	28	\N	Experienced right-back, strong in the tackle.	20	2	0	2026-06-01 10:50:37.188766+00
6	Sibusiso Mthembu	Defender	6	South African	23	\N	Young center-back with excellent reading of the game.	15	0	0	2026-06-01 10:50:38.426137+00
7	Phumlani Ntanzi	Midfielder	8	South African	26	\N	Creative midfielder and the engine of Golden Arrows. An assist machine.	23	4	7	2026-06-01 10:50:39.758824+00
8	Lungelo Dlamini	Midfielder	10	South African	24	\N	Technically gifted number 10, brilliant in tight spaces.	22	5	4	2026-06-01 10:50:40.872542+00
9	Mxolisi Macuphu	Midfielder	14	South African	28	\N	Defensive midfielder who wins the ball and distributes simply.	18	2	3	2026-06-01 10:50:42.082897+00
10	Nkosinathi Mthembu	Midfielder	7	South African	22	\N	Exciting wide midfielder with pace and directness.	16	3	2	2026-06-01 10:50:43.306283+00
11	Knox Mutizwa	Forward	9	Zimbabwean	30	\N	Club legend and top scorer. Knox's goals have fired Golden Arrows to numerous victories. Lightning quick, clinical finish.	24	12	3	2026-06-01 10:50:44.563234+00
12	Sibusiso Khumalo	Forward	11	South African	25	\N	Explosive left winger with electric pace and a nose for goal.	20	8	4	2026-06-01 10:50:45.788081+00
13	Nduduzo Sibiya	Forward	21	South African	22	\N	Versatile attacker who can play anywhere across the front line.	14	5	2	2026-06-01 10:50:47.110223+00
14	Serge Malema	Forward	17	South African	26			11	26	0	2026-06-01 13:49:24.794201+00
15	Sibusiso Ngidi	Forward	27	South African	22			0	0	0	2026-06-02 07:48:11.075545+00
16	Alan Boots	Goalkeeper	58	Zambian	26			0	0	0	2026-06-02 07:50:31.483385+00
17	Junoir Lukichwa	Forward	16	South African	22			0	0	0	2026-06-02 18:41:56.906215+00
18	Junior Lukichwa	Forward	19	Congolese	22			0	0	0	2026-06-02 18:44:23.308901+00
19	Sere Mulayi	Forward	95	Zambian	22	/api/uploads/1780851445683-bp6ddt.jpeg		5	12	0	2026-06-07 16:57:39.787165+00
\.


--
-- Data for Name: results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.results (id, date, home_team, away_team, home_score, away_score, competition, venue, scorers, match_report, highlight_url, created_at) FROM stdin;
1	2025-05-24	Golden Arrows FC	Sekhukhune United	2	1	DStv Premiership	Princess Magogo Stadium	{"Knox Mutizwa 23'","Phumlani Ntanzi 67'"}	Golden Arrows secured all three points in a hard-fought home victory over Sekhukhune United. Knox Mutizwa opened the scoring with a clinical finish before Ntanzi doubled the lead with a long-range strike. Sekhukhune pulled one back late on, but Arrows held on for a crucial win.	\N	2026-06-01 10:51:32.983276+00
2	2025-05-17	TS Galaxy	Golden Arrows FC	1	1	DStv Premiership	Mbombela Stadium	{"Lungelo Dlamini 45'"}	A hard-earned point away at TS Galaxy. Dlamini's brilliant first-half equalizer rescued a point for Arrows.	\N	2026-06-01 10:51:34.185787+00
3	2025-05-10	Golden Arrows FC	Swallows FC	3	0	DStv Premiership	Princess Magogo Stadium	{"Knox Mutizwa 12'","Knox Mutizwa 34'","Sibusiso Khumalo 78'"}	A dominant home performance as Arrows swept Swallows aside with a commanding 3-0 victory. Knox Mutizwa bagged a brace to continue his prolific form.	\N	2026-06-01 10:51:35.624285+00
4	2025-05-03	Mamelodi Sundowns	Golden Arrows FC	2	0	DStv Premiership	Loftus Versfeld	{}	A tough afternoon against the league leaders. Sundowns proved too strong on the day, though Golden Arrows showed tremendous fighting spirit.	\N	2026-06-01 10:51:37.23087+00
5	2025-04-26	Golden Arrows FC	Chippa United	2	1	DStv Premiership	Princess Magogo Stadium	{"Nduduzo Sibiya 55'","Knox Mutizwa 82'"}	Knox Mutizwa's late winner delighted the Arrows faithful as the club claimed three vital points against Chippa United.	\N	2026-06-01 10:51:38.471559+00
6	2026-06-02	Lamontville Golden Arrows	Kaizer Chiefs	2	1	DStv Premiership	Princess Magogo Stadium	{"Mthethwa 24'","Dube 67'"}	\N	\N	2026-06-02 07:49:36.029458+00
\.


--
-- Data for Name: slides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.slides (id, title, image_url, subtitle, link, link_label, sort_order, active, created_at) FROM stdin;
1	Abafana Bes'thende	/api/uploads/1780388118425-ajmqpp.jpg	The Pride of KwaZulu-Natal. Passion, Spirit, and Electric Football.			1	t	2026-06-02 08:15:52.782447+00
2	Golden Birthdays	/api/uploads/1780388317426-tq8o6q.png	We celebrate you			0	t	2026-06-02 08:18:55.311658+00
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sponsors (id, name, logo_url, website_url, tier, created_at) FROM stdin;
1	DStv	https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/DStv_logo.svg/200px-DStv_logo.svg.png	https://www.dstv.com	title	2026-06-01 10:52:18.738839+00
2	Nedbank	https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nedbank_logo.svg/200px-Nedbank_logo.svg.png	https://www.nedbank.co.za	main	2026-06-01 10:52:20.093868+00
3	Castle Lager	https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Castle-lager-logo.svg/200px-Castle-lager-logo.svg.png	https://www.castlelager.co.za	partner	2026-06-01 10:52:21.620334+00
4	eThekwini Municipality	https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Coat_of_arms_of_Durban.svg/200px-Coat_of_arms_of_Durban.svg.png	https://www.durban.gov.za	partner	2026-06-01 10:52:23.025642+00
5	Hollywoodbets	https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Hollywoodbets_logo.svg/200px-Hollywoodbets_logo.svg.png	https://www.hollywoodbets.net	partner	2026-06-01 10:52:24.315736+00
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (id, name, role, photo_url, bio, nationality, created_at) FROM stdin;
1	Vusumuzi Vilakazi	Head Coach	\N	Experienced PSL coach with a calm, tactical approach. Has led the team through several memorable campaigns.	South African	2026-06-01 10:51:17.458187+00
2	Sbusiso Dlamini	Assistant Coach	\N	Works closely with the head coach on training sessions and match preparation.	South African	2026-06-01 10:51:18.654436+00
3	Lungelo Ntanzi	Goalkeeper Coach	\N	Specialist goalkeeper coach who develops our shot-stoppers.	South African	2026-06-01 10:51:20.015876+00
4	Nhlanhla Cele	Fitness Coach	\N	Ensures players maintain peak physical condition throughout the season.	South African	2026-06-01 10:51:21.468931+00
5	Dr. Sipho Khumalo	Club Doctor	\N	Leads the medical team, overseeing player health and injury management.	South African	2026-06-01 10:51:22.875671+00
6	Thulani Mthembu	Physiotherapist	\N	Expert physio dedicated to player rehabilitation and injury prevention.	South African	2026-06-01 10:51:24.278286+00
7	Nomvula Zulu	Sports Analyst	\N	Provides data-driven insights to guide tactical decisions and opponent analysis.	South African	2026-06-01 10:51:25.656108+00
\.


--
-- Name: enquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enquiries_id_seq', 1, true);


--
-- Name: fixtures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fixtures_id_seq', 5, true);


--
-- Name: gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_id_seq', 1, false);


--
-- Name: league_table_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.league_table_id_seq', 32, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.news_id_seq', 11, true);


--
-- Name: players_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.players_id_seq', 19, true);


--
-- Name: results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.results_id_seq', 6, true);


--
-- Name: slides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.slides_id_seq', 2, true);


--
-- Name: sponsors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sponsors_id_seq', 5, true);


--
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 7, true);


--
-- Name: enquiries enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);


--
-- Name: fixtures fixtures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixtures
    ADD CONSTRAINT fixtures_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: league_table league_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.league_table
    ADD CONSTRAINT league_table_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: players players_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (id);


--
-- Name: results results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.results
    ADD CONSTRAINT results_pkey PRIMARY KEY (id);


--
-- Name: slides slides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.slides
    ADD CONSTRAINT slides_pkey PRIMARY KEY (id);


--
-- Name: sponsors sponsors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sponsors
    ADD CONSTRAINT sponsors_pkey PRIMARY KEY (id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 95lvb7PgpmcuXnLgwcPei4KghzrgJ5xkrGCX3irckOOuEWNTfN6aTezjc6abJ3g

