--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (5, 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', 1, 'Raj', '7987892341', '{"bio": "Computer Science Engineer", "email": "raj@xcelerator.co.in", "awards": [{"id": "1751528996495", "name": "Test Award", "awardFor": "student-mentoring", "issueDate": "2025-07-01", "description": "", "issuingOrganization": "AIT"}], "skills": [{"id": "1751528940975", "name": "JavaScropt", "level": "expert", "category": "programming"}, {"id": "1751552072809", "name": "Typescript", "level": "expert", "category": "technical"}], "patents": [], "journals": [], "projects": [{"id": "1751529017227", "name": "Test Project", "role": "co-investigator", "abstract": "", "collaborators": "gsfash", "publicationDate": "2025-07-02"}], "department": "computer-science", "university": "nit-karnataka", "certifications": [{"id": "1751528963612", "name": "Test Cert", "type": "workshop", "issuer": "AIT", "issueDate": "2025-07-04"}]}', '2025-07-03 06:17:41.992', '2025-07-03 14:14:50.685');
INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (4, '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', 2, 'Ranjan', '9886226305', '{"bio": "Mechanical Engineer", "email": "ranjan@xcelerator.co.in", "awards": [{"id": "1751305150885", "name": "Test Award", "awardFor": "innovation", "issueDate": "2025-06-19", "description": "Test Award", "issuingOrganization": "IIM"}], "skills": [{"id": "1751305015630", "name": "CAD", "level": "intermediate", "category": "technical"}, {"id": "1751305043926", "name": "Design", "level": "advanced", "category": "technical"}, {"id": "1751305063822", "name": "C++", "level": "beginner", "category": "programming"}], "patents": [], "journals": [{"id": "1751305520722", "title": "Test Journal", "status": "submitted", "collaborators": "Tester", "publicationDate": "2025-06-21"}], "projects": [{"id": "1751305183551", "name": "Test Project", "role": "project-lead", "abstract": "ISTE", "collaborators": "IIT", "publicationDate": "2025-06-26"}], "department": "mechanical", "university": "atria", "certifications": [{"id": "1751305104894", "name": "Test", "type": "certification", "issuer": "IIT", "issueDate": "2025-06-25", "expiryDate": "2025-06-29"}]}', '2025-06-30 17:39:49.455', '2025-06-30 17:45:32.266');
INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (3, 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', 2, 'Anju Reddy', '9886226320', '{"bio": "Electronics", "email": "anju@xcelerator.co.in", "awards": [{"id": "1751308034317", "name": "Test Award", "awardFor": "best-teacher", "issueDate": "2025-06-13", "description": "cscsdcsdv", "issuingOrganization": "trewdad"}, {"id": "1751308046644", "name": "vsdvdsvsdv", "awardFor": "research-excellence", "issueDate": "2025-06-11", "description": "", "issuingOrganization": "dvdsvsdvsdv"}], "skills": [{"id": "1751307890856", "name": "NextJS", "level": "advanced", "category": "technical"}, {"id": "1751307905006", "name": "ReactJS", "level": "advanced", "category": "technical"}, {"id": "1751307923172", "name": "Javascript", "level": "expert", "category": "programming"}, {"id": "1751307933022", "name": "Typescript", "level": "intermediate", "category": "programming"}, {"id": "1751307941847", "name": "Go", "level": "expert", "category": "programming"}], "patents": [{"id": "1751308107414", "name": "adsdasdas", "patentFor": "innovation", "awardedDate": "2025-06-06", "awardingBody": "assdwew", "collaborators": "adasdasd"}], "journals": [{"id": "1751308079644", "title": "vsdvdsv", "status": "under-review", "collaborators": "ascdsca", "publicationDate": "2025-06-20"}, {"id": "1751308092802", "title": "test", "status": "submitted", "collaborators": "sdqadwewe", "publicationDate": "2025-06-07"}], "projects": [{"id": "1751308064503", "name": "zdfdsfserewr", "role": "co-investigator", "abstract": "", "collaborators": "ewfdwef", "publicationDate": "2025-06-07"}], "department": "electronics", "university": "iit-bangalore", "certifications": [{"id": "1751307975223", "name": "test cert", "type": "certification", "issuer": "test org", "issueDate": "2025-06-13", "expiryDate": "2025-06-20"}, {"id": "1751308006349", "name": "Test certificate", "type": "course", "issuer": "Org", "issueDate": "2025-06-07", "expiryDate": "2025-06-19"}]}', '2025-06-30 17:34:14.498', '2025-06-30 18:29:37.567');


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

