# Environment Setup Guide

This guide will help you set up the necessary environment variables for the ISTE platform.

## Required Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

### Database Configuration

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/iste_db"
```

**Note**: Replace `username`, `password`, and `iste_db` with your actual PostgreSQL credentials and database name.

### App Configuration

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For production, change this to your actual domain:

```bash
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Node Environment

```bash
NODE_ENV="development"
```

For production:

```bash
NODE_ENV="production"
```

### Email Configuration (Optional for Development)

For development, emails are logged to the console. For production, you can configure a real email service:

```bash
# Optional: Only needed if you want to send real emails
RESEND_API_KEY="re_your_resend_api_key_here"
```

## Complete Example `.env` File

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/iste_db"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"

# Email Configuration (Optional for development)
# RESEND_API_KEY="re_your_resend_api_key_here"
```

## Setup Steps

### 1. Database Setup

1. **Install PostgreSQL** if you haven't already
2. **Create a database**:
    ```sql
    CREATE DATABASE iste_db;
    ```
3. **Update the DATABASE_URL** in your `.env` file with your actual credentials

### 2. Email Service Setup (Optional for Development)

For development, emails are logged to the console, so no email service setup is required.

For production:

1. **Sign up for Resend**:

    - Go to [resend.com](https://resend.com)
    - Create a free account
    - Get your API key from the dashboard

2. **Add the API key** to your `.env` file

### 3. Run Database Migrations

After setting up your environment variables:

```bash
# Generate and apply database migrations
pnpm db:generate
pnpm db:push
```

### 4. Start the Development Server

```bash
pnpm dev
```

## Development Email Behavior

In development mode (`NODE_ENV="development"`), the platform will:

- Log all emails to the console instead of sending them
- Show email content in the terminal for verification
- Allow you to test the email flow without setting up an email service

This makes development easier and faster while still allowing you to see what emails would be sent.

## Troubleshooting

### "Invalid server environment variables" Error

This error occurs when required environment variables are missing or invalid. Check that:

1. Your `.env` file exists in the root directory
2. All required variables are set:
    - `DATABASE_URL` (required)
    - `NEXT_PUBLIC_APP_URL` (required)
    - `NODE_ENV` (required)
3. The DATABASE_URL is a valid PostgreSQL connection string

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify your database credentials
- Check that the database exists
- Make sure the DATABASE_URL format is correct

### Email Not Working

- In development: Check the console logs for email content
- In production: Verify your email service configuration
- Ensure your email service API key is correct

## Production Deployment

For production deployment, make sure to:

1. Set `NODE_ENV="production"`
2. Use a production database URL
3. Set `NEXT_PUBLIC_APP_URL` to your actual domain
4. Configure a real email service (like Resend, SendGrid, or Mailgun)
5. Set up proper SSL certificates

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique passwords for your database
- Rotate your API keys regularly
- Use environment-specific configurations for different deployment stages
