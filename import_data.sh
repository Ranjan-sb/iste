#!/bin/bash

NEON_URL="postgresql://neondb_owner:npg_i6EPFw8bxftQ@ep-hidden-haze-ad6srrm1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "Importing users..."
grep "INSERT INTO.*users" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing accounts..."
grep "INSERT INTO.*accounts" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing sessions..."
grep "INSERT INTO.*sessions" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing verifications..."
grep "INSERT INTO.*verifications" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing profiles..."
grep "INSERT INTO.*profiles\|INSERT INTO.*user_profiles" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing awards..."
grep "INSERT INTO.*awards" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing award_applications..."
grep "INSERT INTO.*award_applications" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing files..."
grep "INSERT INTO.*files" local_data_with_columns.sql | psql "$NEON_URL"

echo "Importing other tables..."
grep "INSERT INTO.*hello" local_data_with_columns.sql | psql "$NEON_URL"

echo "Done!"
