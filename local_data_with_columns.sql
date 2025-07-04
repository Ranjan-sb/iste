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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, name, email, email_verified, image, created_at, updated_at, role) VALUES ('0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', 'Ranjan', 'ranjan@xcelerator.co.in', false, NULL, '2025-06-30 11:37:21.081', '2025-06-30 11:37:21.081', 'user');
INSERT INTO public.users (id, name, email, email_verified, image, created_at, updated_at, role) VALUES ('KlcMVIubNqY0IvE7fJKg9NGX5uEfvfxE', 'Neeraj', 'neeraj@xcelerator.co.in', false, NULL, '2025-06-30 13:02:03.919', '2025-06-30 13:02:03.919', 'user');
INSERT INTO public.users (id, name, email, email_verified, image, created_at, updated_at, role) VALUES ('PgF3PAfK81paIie4NoicHJldTEU97UFv', 'Surya', 'surya@xcelerator.co.in', false, NULL, '2025-06-30 13:31:56.298', '2025-06-30 13:31:56.298', 'user');
INSERT INTO public.users (id, name, email, email_verified, image, created_at, updated_at, role) VALUES ('NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', 'Anju Reddy', 'anju@xcelerator.co.in', false, NULL, '2025-06-30 16:09:17.105', '2025-06-30 16:09:17.105', 'user');
INSERT INTO public.users (id, name, email, email_verified, image, created_at, updated_at, role) VALUES ('pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', 'Raj', 'raj@xcelerator.co.in', false, NULL, '2025-07-03 06:16:31.604', '2025-07-03 06:16:31.604', 'user');


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.accounts (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) VALUES ('Xs6SaRBzg8gDiuxbvlMBkh1LOjCEpNzA', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', 'credential', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', NULL, NULL, NULL, NULL, NULL, NULL, 'a8c3e8a35698ea80c616294b87840dbd:43e80f581fe7f4ef06cfc2c96bc7bbc018304b1135cb31b3152ee5404417e8e52e5a574e91e27ab072e3ecd2161010ebc00168b6837941e6b36cbcd2bd50f5ca', '2025-06-30 11:37:21.087', '2025-06-30 11:37:21.087');
INSERT INTO public.accounts (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) VALUES ('Y9D6BcF6igEJ5aInX8oXTgnj5ZQDgbgR', 'KlcMVIubNqY0IvE7fJKg9NGX5uEfvfxE', 'credential', 'KlcMVIubNqY0IvE7fJKg9NGX5uEfvfxE', NULL, NULL, NULL, NULL, NULL, NULL, '57c36be05750a82883a31c54af66183f:40f4376b90eaa19dac6562b016877c92453a5372c07d0f5ce4c4fecc80b3be564de5cbf3f8e9ac914416a6a7858ace767404f2f52680ddad028931c5fde18f86', '2025-06-30 13:02:03.921', '2025-06-30 13:02:03.921');
INSERT INTO public.accounts (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) VALUES ('DAEqxyalFIlVw3pwLceC4AToITSLSjet', 'PgF3PAfK81paIie4NoicHJldTEU97UFv', 'credential', 'PgF3PAfK81paIie4NoicHJldTEU97UFv', NULL, NULL, NULL, NULL, NULL, NULL, '5a96abb317abc2b66f69f46e4c19e185:7b178724f8f31f4a0b65d0a011f971336e21a9bfc5cd4d9bb16ec4bc8c23353f00b1c798b67f552ea4732505b1b536892ba5c912336a161032b92c2996b5a3d4', '2025-06-30 13:31:56.301', '2025-06-30 13:31:56.301');
INSERT INTO public.accounts (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) VALUES ('s95ECx9Kx7in3sT11NlPOLMNWeQfJHAq', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', 'credential', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', NULL, NULL, NULL, NULL, NULL, NULL, 'e75a127d33904b98d02608a7bebe3703:383feff00659a9ec80c1cd668388c6796efbd63b04d8a261fd9da160165835f340e8895ba703f5106317f210fb7c431b4599e08c4ed933b2ecac70b6c9f71d2a', '2025-06-30 16:09:17.108', '2025-06-30 16:09:17.108');
INSERT INTO public.accounts (id, account_id, provider_id, user_id, access_token, refresh_token, id_token, access_token_expires_at, refresh_token_expires_at, scope, password, created_at, updated_at) VALUES ('Z5KO0x6poplug24dtOURl3WkvGLHFGki', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', 'credential', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', NULL, NULL, NULL, NULL, NULL, NULL, '15881c610d60a344aa45b08a58a7345c:e8254a7a7e59e4c94c1c1f95f69ca6f5429409aaa929c3bbe86c3c5eb413a532c55c35e67a083d37f049d83796aa51765df9b552da0c5ee0b706aec8ae0994b4', '2025-07-03 06:16:31.61', '2025-07-03 06:16:31.61');


--
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (1, 'Best Innovation Award', 'Testing Best Innovation Award 2025', 'faculty', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '["PG", "PhD"]', '[]', '[]', 60, '["Not eligible if you applied last year"]', '2025-07-02 00:00:00', '2025-07-23 00:00:00', '2025-08-15 00:00:00', '[{"type": "short_answer", "order": 0, "title": "Project Name", "options": [], "required": true}, {"type": "short_answer", "order": 1, "title": "submission date", "options": [], "required": true}, {"type": "short_answer", "order": 2, "title": "Guide Name", "options": [], "required": true}, {"type": "file_upload", "order": 3, "title": "Project report ", "options": [], "required": true}]', true, true, '2025-07-01 11:12:09.349', '2025-07-01 11:12:09.349');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (2, 'gvsgcshcvshd', 'cgashcshcvbsha', 'faculty', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '["PhD"]', '[]', '[]', NULL, '[]', '2025-07-05 00:00:00', '2025-07-20 00:00:00', '2025-07-30 00:00:00', '[{"type": "short_answer", "order": 0, "title": "Paper Publish Name", "options": [], "required": false}, {"type": "checkbox", "order": 1, "title": "Paper published?", "options": [{"value": "Yes"}, {"value": "No"}], "required": false}, {"type": "date", "order": 2, "title": "Submission Date", "options": [], "required": false}, {"type": "date_range", "order": 3, "title": "Worked during", "options": [], "required": false}]', true, true, '2025-07-01 13:03:46.681', '2025-07-01 13:03:46.681');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (3, 'Test Awards', 'Test Awards Test Awards', 'student', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', '["PhD"]', '[]', '[]', NULL, '[]', '2025-07-04 00:00:00', '2025-07-14 00:00:00', '2025-07-31 00:00:00', '[{"type": "short_answer", "order": 0, "title": "Project Name", "options": [], "required": false}, {"type": "checkbox", "order": 1, "title": "Project Published", "options": [{"value": "Yes"}, {"value": "No"}], "required": false}, {"type": "date", "order": 2, "title": "Date of Publish", "options": [], "required": false}, {"type": "date_range", "order": 3, "title": "Duration of project", "options": [], "required": false}, {"type": "file_upload", "order": 4, "title": "Report", "options": [], "required": false}]', true, true, '2025-07-01 13:40:49.748', '2025-07-01 13:40:49.748');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (4, 'Best of the Best Award', 'Testing Awards', 'faculty', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '["PG", "PhD"]', '[]', '[]', 65, '[]', '2025-07-03 00:00:00', '2025-07-16 00:00:00', '2025-07-31 00:00:00', '[{"type": "multiple_choice", "order": 0, "title": "Have you recieved this award before?", "options": [{"value": "Yes"}, {"value": "No"}], "required": true}]', true, true, '2025-07-02 10:16:51.355', '2025-07-02 10:16:51.355');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (5, 'National test award', 'National test award National test award', 'faculty', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '["PG", "UG", "PhD", "Diploma"]', '[]', '[]', 65, '[]', '2025-07-05 00:00:00', '2025-07-19 00:00:00', '2025-08-02 00:00:00', '[{"type": "multiple_choice", "order": 0, "title": "Have you applied for this award in the past 2 years and won?", "options": [{"value": "Yes"}, {"value": "No"}], "required": true}]', true, true, '2025-07-02 10:48:15.082', '2025-07-02 10:48:15.082');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (6, 'National Award for Students', 'National Award for Students', 'student', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', '["UG"]', '[]', '[]', 25, '[]', '2025-07-05 00:00:00', '2025-07-15 00:00:00', '2025-07-30 00:00:00', '[{"type": "multiple_choice", "order": 0, "title": "Is it 1st time applying?", "options": [{"value": "Yes"}, {"value": "No"}], "required": true}, {"type": "paragraph", "order": 1, "title": "What makes you interested about this award?", "options": [], "required": true}]', true, true, '2025-07-03 07:53:28.125', '2025-07-03 07:53:28.125');
INSERT INTO public.awards (id, name, description, category, created_by, eligibility_level, eligibility_states, eligibility_branches, max_age, special_requirements, submission_deadline, evaluation_deadline, result_deadline, custom_fields, is_active, is_published, created_at, updated_at) VALUES (7, 'Best of the Best Award dasdvashjf', 'dsfsd f,sdfg sd,g', 'faculty', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', '["UG"]', '[]', '[]', 70, '[]', '2025-07-05 00:00:00', '2025-07-18 00:00:00', '2025-07-30 00:00:00', '[{"type": "file_upload", "order": 0, "title": "Submit doccument", "options": [], "required": true}]', true, true, '2025-07-03 14:18:07.767', '2025-07-03 14:18:07.767');


--
-- Data for Name: award_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.award_applications (id, award_id, applicant_id, form_data, status, submitted_at, created_at, updated_at) VALUES (1, 1, 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', '{"question_0": "Testing Project", "question_1": "112213232", "question_2": "dasdgasd", "question_3": "Laptop Policy Contract - Google Docs.pdf"}', 'submitted', '2025-07-01 11:54:25.26', '2025-07-01 11:54:25.26', '2025-07-01 11:54:25.26');
INSERT INTO public.award_applications (id, award_id, applicant_id, form_data, status, submitted_at, created_at, updated_at) VALUES (2, 3, '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '{"question_0": "Test Project", "question_1": ["Yes"], "question_2": "2025-06-10", "question_3": {"to": "2025-06-02", "from": "2025-05-02"}, "question_4": {"id": 1, "size": 183667, "filename": "Laptop Policy Contract - Google Docs.pdf", "mimetype": "application/pdf"}}', 'submitted', '2025-07-01 13:46:16.014', '2025-07-01 13:45:47.783', '2025-07-01 13:46:16.014');
INSERT INTO public.award_applications (id, award_id, applicant_id, form_data, status, submitted_at, created_at, updated_at) VALUES (3, 2, '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', '{"question_0": "Test Publish", "question_1": ["Yes"], "question_2": "2025-07-10"}', 'draft', NULL, '2025-07-01 13:56:04.451', '2025-07-01 14:19:23.387');
INSERT INTO public.award_applications (id, award_id, applicant_id, form_data, status, submitted_at, created_at, updated_at) VALUES (4, 5, 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', '{"address": "ajsdvasjyfajfaj", "pincode": "560040", "isMember": true, "projects": [{"title": "ProjectX", "guides": [{"name": "Test Guide-1", "email": "testguide1@gmail.com", "mobile": "9786226305", "address": "dshtdcfjvcjsdf"}], "benefits": ["fjahbndlkasdnkldnmlakdm", "aasjfdkafakf", "fdskjfbsdjfbdj,fbdjs"], "briefResume": "", "briefResumeFile": {"id": 6, "size": 183667, "filename": "Laptop Policy Contract - Google Docs (1).pdf", "mimetype": "application/pdf"}, "institutionRemarks": {"id": 7, "size": 183667, "filename": "Laptop Policy Contract - Google Docs.pdf", "mimetype": "application/pdf"}, "outstandingWorkArea": "educational-technology"}], "department": "Computer Science", "question_0": "No", "dateOfBirth": "1991-10-02", "designation": "Professor", "phoneNumber": "988765432", "semesterYear": "", "applicantName": "Anju reddy", "otherExperience": "", "industryExperience": "Software", "institutionAddress": "Atria University", "teachingExperience": {"pg": "2", "ug": "2"}, "academicQualification": "B.Tech", "fieldOfSpecialization": "Computer Science"}', 'submitted', '2025-07-02 11:09:56.123', '2025-07-02 11:09:56.123', '2025-07-02 11:09:56.123');
INSERT INTO public.award_applications (id, award_id, applicant_id, form_data, status, submitted_at, created_at, updated_at) VALUES (5, 6, 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', '{"address": "D Subbaiah Road\n368/a", "pincode": "570024", "isMember": true, "projects": [{"title": "testing proj", "guides": [{"name": "dfdsfsd", "email": "guide1@gmail.com", "mobile": "9876543223", "address": "dvashfcvsdhjfvsdjf"}], "benefits": ["vfgsdfsjdfvs", "sfjdgfjdsfjsb", "kbvdsjkvbdbgvjskdvb"], "briefResume": "", "briefResumeFile": {"id": 8, "size": 183667, "filename": "Laptop Policy Contract - Google Docs.pdf", "mimetype": "application/pdf"}, "institutionRemarks": {}, "outstandingWorkArea": "industry-interaction"}], "department": "Computer Science", "question_0": "Yes", "question_1": "dsdfyjdsgffhfhklwhafcku adgewufgewkfhewrf", "dateOfBirth": "1999-10-01", "designation": "Student", "phoneNumber": "8746374361", "semesterYear": "final year", "applicantName": "Raj", "otherExperience": "", "industryExperience": "", "institutionAddress": "D Subbaiah Road\n368/a", "teachingExperience": {"pg": "", "ug": ""}, "academicQualification": "B.Tech", "fieldOfSpecialization": "Computer Science"}', 'submitted', '2025-07-03 08:51:04.399', '2025-07-03 07:56:42.903', '2025-07-03 08:51:04.399');


--
-- Data for Name: award_evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.files (id, filename, r2_key, mimetype, size, uploaded_by, application_id, field_id, created_at, r2_url, public_url) VALUES (8, 'Laptop Policy Contract - Google Docs.pdf', 'uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/a2fbf34a-70a5-4d98-9da4-3073a88c4d38.pdf', 'application/pdf', 183667, 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', NULL, 'brief-resume-file-0', '2025-07-03 13:31:48.148636', 'https://iste.79700a707b6947d5c391b165d553413e.r2.cloudflarestorage.com/uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/a2fbf34a-70a5-4d98-9da4-3073a88c4d38.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b0990e60cc5a91fa6655aebd6da06381%2F20250703%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250703T080148Z&X-Amz-Expires=3600&X-Amz-Signature=6133d093130d544176e0fc94278541d821355bbfb6bc68deb85e26f64818e454&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject', 'https://pub-fb686e835a6241639756fb2bb00f1e85.r2.dev/uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/a2fbf34a-70a5-4d98-9da4-3073a88c4d38.pdf');
INSERT INTO public.files (id, filename, r2_key, mimetype, size, uploaded_by, application_id, field_id, created_at, r2_url, public_url) VALUES (9, 'Laptop_Bill.pdf', 'uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/2071fdfa-b393-4533-9f53-c5e8d8b17470.pdf', 'application/pdf', 110371, 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', NULL, 'institution-remarks-0', '2025-07-03 14:20:36.189385', 'https://iste.79700a707b6947d5c391b165d553413e.r2.cloudflarestorage.com/uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/2071fdfa-b393-4533-9f53-c5e8d8b17470.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=b0990e60cc5a91fa6655aebd6da06381%2F20250703%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250703T085036Z&X-Amz-Expires=3600&X-Amz-Signature=f9ed33898847bc6ed40a0ae0b6b4bd258fb31b0cdf653a5b7ffc3863ed6626b2&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject', 'https://pub-fb686e835a6241639756fb2bb00f1e85.r2.dev/uploads/pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja/2071fdfa-b393-4533-9f53-c5e8d8b17470.pdf');


--
-- Data for Name: hello; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('vB8X0mdY4rvTRkDDWhAbZAk9BOb8kYK9', '2025-07-07 11:39:25.102', 'aNUDROtyJwMdmMKTlNZtUvyI8HH3RVN1', '2025-06-30 11:39:25.103', '2025-06-30 11:39:25.103', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('jtAH5m0tRxzJcO9G3VNgPItqqtB6k0sL', '2025-07-07 11:39:38.137', 'sF0s5fw7TDFtGEpCAMPXYtJUK3AGml1T', '2025-06-30 11:39:38.137', '2025-06-30 11:39:38.137', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('gavj7uNEipGr8bqWJZkDohtrPvyQOep4', '2025-07-07 11:43:03.416', '9d9OhqRUZfSC4a1YIeUMhiJ42yJRhRBh', '2025-06-30 11:43:03.417', '2025-06-30 11:43:03.417', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('fuBROBehowovix96HkQoq3TnOGgAmypk', '2025-07-07 11:45:23.724', 'Gw8OmkpcsnMDxHSmLOCyOtK7GUma71eq', '2025-06-30 11:45:23.725', '2025-06-30 11:45:23.725', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('RlgPdyIyBdNv7PQd8lTguYVfyp2xM6BT', '2025-07-07 12:40:07.177', 'mzjEg76mwLv9svghISaYDnWTUw7i1ok4', '2025-06-30 12:40:07.178', '2025-06-30 12:40:07.178', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('p19PWVq01jga75JLe50LyuZwkv9ZQxxU', '2025-07-07 12:50:11.834', '90VjSSwUCMWJPFVcwbap4dWsEiOKxCFv', '2025-06-30 12:50:11.835', '2025-06-30 12:50:11.835', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('rb79TX9Ax6NV1nSYK2kOIqI0ESgy0Enf', '2025-07-07 13:02:03.924', 'MHViiwgsskw8JHcBalQidZFGaAWIubNo', '2025-06-30 13:02:03.924', '2025-06-30 13:02:03.924', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'KlcMVIubNqY0IvE7fJKg9NGX5uEfvfxE');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('g6EIGgxU5gnd8w8fNsBJf4fbctehDKUd', '2025-07-07 13:31:56.308', 'f5ooxWo3lw6NfIlE3FGSCoGeScuWiskQ', '2025-06-30 13:31:56.308', '2025-06-30 13:31:56.308', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'PgF3PAfK81paIie4NoicHJldTEU97UFv');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('I8Uk9SVMprlnSa8vFMogdLkx52HIWtIy', '2025-07-07 16:09:17.112', 'eLD4yqp2KObTcMiQx6rlsLemrqj7wvAF', '2025-06-30 16:09:17.112', '2025-06-30 16:09:17.112', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('1WtUJbpXSGZx55SOPeBBxydR8amd74dO', '2025-07-07 16:09:27.643', 'VO8u4Gh634U9Oh6yqMZMKUhA4tKcYvpq', '2025-06-30 16:09:27.643', '2025-06-30 16:09:27.643', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('Y17LBF9qoRtBBCGWUff0DA4eTrcNYbMw', '2025-07-07 16:26:06.065', 'GhVAFwxYaEJes9z8flZrTdfmf2KLpWfw', '2025-06-30 16:26:06.065', '2025-06-30 16:26:06.065', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('zqqOEIhePiI7pDb1coB6MlHE6vfYoHrD', '2025-07-07 17:44:07.001', 'lu8J8TgY87oH2gsoQPgaT0jFcGzDrjOx', '2025-06-30 17:44:07.001', '2025-06-30 17:44:07.001', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('wkbfFrBDzgVCVfmQQE8V2T8jCPhr7b8X', '2025-07-10 07:04:13.844', 'fYN7ju6D5EtF9EPS6YzIIz0Agyu2XSyN', '2025-07-03 07:04:13.844', '2025-07-03 07:04:13.844', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('MZYUi9VdDwlt19fAUGX0aRfrf738ayKf', '2025-07-10 10:20:29.577', 'uKSqLnA4j2GpS8ZHXV90L03U2kubT9Ks', '2025-07-03 10:20:29.578', '2025-07-03 10:20:29.578', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('E52FmvsDrZB4mXReg0EO5vYgmyFE2uIw', '2025-07-10 11:03:10.206', 'k7ztf2M4o6Uwkvf27J8mgyUQcyRka6FX', '2025-07-03 11:03:10.206', '2025-07-03 11:03:10.206', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('fmjPlkY8rdOsga1S9dtpzGwThdY8CewN', '2025-07-10 14:12:55.879', '7RPGsjm9mmvrK981HpThR0PeRbtwCwdf', '2025-07-03 14:12:55.879', '2025-07-03 14:12:55.879', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('DmdE1luvFnpWYRlHv16XMW9PLRETsVh5', '2025-07-09 15:44:31.499', 'qTVGK67PzHPdx4f20euCCDGKTDFBWvbL', '2025-07-01 14:43:11.153', '2025-07-01 14:43:11.153', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('neZabhW3zKtvDnWNKzGVkRFWYPykN2f5', '2025-07-10 06:16:31.613', 'fNzX3hPmK3hLCWxECCLhODvf8LOr3mHA', '2025-07-03 06:16:31.613', '2025-07-03 06:16:31.613', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');
INSERT INTO public.sessions (id, expires_at, token, created_at, updated_at, ip_address, user_agent, user_id) VALUES ('QON080uP2whMZeP7aGbml56yoOYaeGe4', '2025-07-10 06:16:47.993', 'tgswJ5XVdEA0cK8JutkW4FWRLiluMdqQ', '2025-07-03 06:16:47.993', '2025-07-03 06:16:47.993', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (5, 'pZZnc8GMOfzVmRiEH3X1V6ZBY2nRyRja', 1, 'Raj', '7987892341', '{"bio": "Computer Science Engineer", "email": "raj@xcelerator.co.in", "awards": [{"id": "1751528996495", "name": "Test Award", "awardFor": "student-mentoring", "issueDate": "2025-07-01", "description": "", "issuingOrganization": "AIT"}], "skills": [{"id": "1751528940975", "name": "JavaScropt", "level": "expert", "category": "programming"}, {"id": "1751552072809", "name": "Typescript", "level": "expert", "category": "technical"}], "patents": [], "journals": [], "projects": [{"id": "1751529017227", "name": "Test Project", "role": "co-investigator", "abstract": "", "collaborators": "gsfash", "publicationDate": "2025-07-02"}], "department": "computer-science", "university": "nit-karnataka", "certifications": [{"id": "1751528963612", "name": "Test Cert", "type": "workshop", "issuer": "AIT", "issueDate": "2025-07-04"}]}', '2025-07-03 06:17:41.992', '2025-07-03 14:14:50.685');
INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (4, '0ZpfNgu1IbX6Ny43MY4uZVCGnudH0JPI', 2, 'Ranjan', '9886226305', '{"bio": "Mechanical Engineer", "email": "ranjan@xcelerator.co.in", "awards": [{"id": "1751305150885", "name": "Test Award", "awardFor": "innovation", "issueDate": "2025-06-19", "description": "Test Award", "issuingOrganization": "IIM"}], "skills": [{"id": "1751305015630", "name": "CAD", "level": "intermediate", "category": "technical"}, {"id": "1751305043926", "name": "Design", "level": "advanced", "category": "technical"}, {"id": "1751305063822", "name": "C++", "level": "beginner", "category": "programming"}], "patents": [], "journals": [{"id": "1751305520722", "title": "Test Journal", "status": "submitted", "collaborators": "Tester", "publicationDate": "2025-06-21"}], "projects": [{"id": "1751305183551", "name": "Test Project", "role": "project-lead", "abstract": "ISTE", "collaborators": "IIT", "publicationDate": "2025-06-26"}], "department": "mechanical", "university": "atria", "certifications": [{"id": "1751305104894", "name": "Test", "type": "certification", "issuer": "IIT", "issueDate": "2025-06-25", "expiryDate": "2025-06-29"}]}', '2025-06-30 17:39:49.455', '2025-06-30 17:45:32.266');
INSERT INTO public.user_profiles (id, user_id, role_id, full_name, contact, meta_data, created_at, updated_at) VALUES (3, 'NUZdmarP4XkbCJlej92IfWIN9dx4lbaV', 2, 'Anju Reddy', '9886226320', '{"bio": "Electronics", "email": "anju@xcelerator.co.in", "awards": [{"id": "1751308034317", "name": "Test Award", "awardFor": "best-teacher", "issueDate": "2025-06-13", "description": "cscsdcsdv", "issuingOrganization": "trewdad"}, {"id": "1751308046644", "name": "vsdvdsvsdv", "awardFor": "research-excellence", "issueDate": "2025-06-11", "description": "", "issuingOrganization": "dvdsvsdvsdv"}], "skills": [{"id": "1751307890856", "name": "NextJS", "level": "advanced", "category": "technical"}, {"id": "1751307905006", "name": "ReactJS", "level": "advanced", "category": "technical"}, {"id": "1751307923172", "name": "Javascript", "level": "expert", "category": "programming"}, {"id": "1751307933022", "name": "Typescript", "level": "intermediate", "category": "programming"}, {"id": "1751307941847", "name": "Go", "level": "expert", "category": "programming"}], "patents": [{"id": "1751308107414", "name": "adsdasdas", "patentFor": "innovation", "awardedDate": "2025-06-06", "awardingBody": "assdwew", "collaborators": "adasdasd"}], "journals": [{"id": "1751308079644", "title": "vsdvdsv", "status": "under-review", "collaborators": "ascdsca", "publicationDate": "2025-06-20"}, {"id": "1751308092802", "title": "test", "status": "submitted", "collaborators": "sdqadwewe", "publicationDate": "2025-06-07"}], "projects": [{"id": "1751308064503", "name": "zdfdsfserewr", "role": "co-investigator", "abstract": "", "collaborators": "ewfdwef", "publicationDate": "2025-06-07"}], "department": "electronics", "university": "iit-bangalore", "certifications": [{"id": "1751307975223", "name": "test cert", "type": "certification", "issuer": "test org", "issueDate": "2025-06-13", "expiryDate": "2025-06-20"}, {"id": "1751308006349", "name": "Test certificate", "type": "course", "issuer": "Org", "issueDate": "2025-06-07", "expiryDate": "2025-06-19"}]}', '2025-06-30 17:34:14.498', '2025-06-30 18:29:37.567');


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: award_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: award_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: awards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: hello_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

