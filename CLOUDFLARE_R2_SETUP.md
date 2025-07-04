# Cloudflare R2 Storage Setup Guide

This guide will walk you through setting up Cloudflare R2 object storage for the ISTE platform's file upload system.

## Why Cloudflare R2?

- **Cost-effective**: No egress fees, only storage and operations
- **Global performance**: Built on Cloudflare's global network
- **S3-compatible**: Uses standard S3 APIs for easy integration
- **Scalable**: Handles any amount of data with automatic scaling
- **Secure**: Built-in security features and access controls

## Step 1: Create a Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Sign up for a free account or log in to your existing account
3. Complete the account verification process

## Step 2: Access R2 Object Storage

1. In your Cloudflare dashboard, navigate to **R2 Object Storage** in the left sidebar
2. If this is your first time using R2, you'll need to enable it
3. Click **"Purchase R2 Plan"** (the free tier includes 10GB of storage)

## Step 3: Create an R2 Bucket

1. Click **"Create bucket"**
2. Choose a unique bucket name (e.g., `iste-platform-files-prod`)
    - Bucket names must be globally unique across all of Cloudflare R2
    - Use lowercase letters, numbers, and hyphens only
    - Suggested naming: `{project}-{environment}` (e.g., `iste-platform-dev`, `iste-platform-prod`)
3. Select a location hint close to your primary users (e.g., "Eastern North America" for US East Coast)
4. Click **"Create bucket"**

## Step 4: Generate R2 API Tokens

1. In the R2 dashboard, click **"Manage R2 API tokens"**
2. Click **"Create API token"**
3. Configure the token:
    - **Token name**: `ISTE Platform API Token`
    - **Permissions**: Select **"Object Read & Write"**
    - **Bucket**: Select your created bucket or choose "All buckets"
    - **TTL**: Leave blank for no expiration (or set according to your security policy)
4. Click **"Create API token"**
5. **Important**: Copy and save the following credentials immediately:
    - **Access Key ID**: This is your `R2_ACCESS_KEY_ID`
    - **Secret Access Key**: This is your `R2_SECRET_ACCESS_KEY`
    - **Endpoint URL**: Note this for reference (but we construct it automatically)

## Step 5: Get Your Account ID

1. In your Cloudflare dashboard, look for **"Account ID"** in the right sidebar
2. Copy this value - this is your `R2_ACCOUNT_ID`

## Step 6: Configure Environment Variables

Add the following variables to your `.env` file:

```bash
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID="your_account_id_here"
R2_ACCESS_KEY_ID="your_access_key_id_here"
R2_SECRET_ACCESS_KEY="your_secret_access_key_here"
R2_BUCKET_NAME="your_bucket_name_here"
```

### Example Configuration

```bash
# Cloudflare R2 Storage Configuration
R2_ACCOUNT_ID="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
R2_ACCESS_KEY_ID="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
R2_SECRET_ACCESS_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
R2_BUCKET_NAME="iste-platform-prod"
```

## Step 7: (Optional) Set Up Custom Domain

For production environments, you may want to serve files from your own domain:

1. In your R2 bucket settings, click **"Settings"**
2. Under **"Custom Domains"**, click **"Connect Domain"**
3. Enter your custom domain (e.g., `files.yourdomain.com`)
4. Follow the DNS configuration instructions
5. Once configured, add the custom domain to your environment variables:

```bash
R2_PUBLIC_URL="https://files.yourdomain.com"
```

## Step 8: Test the Configuration

1. Start your development server:

    ```bash
    pnpm dev
    ```

2. Try uploading a file through the application
3. Check your R2 bucket in the Cloudflare dashboard to verify files are being uploaded
4. Test downloading files to ensure the signed URLs work correctly

## Security Best Practices

### API Token Security

- **Never commit API tokens to version control**
- **Use different tokens for different environments** (development, staging, production)
- **Regularly rotate API tokens** (every 90 days recommended)
- **Use least-privilege access** - only grant the permissions needed

### Bucket Configuration

- **Enable versioning** if you need to track file changes
- **Set up lifecycle rules** to automatically delete old files if needed
- **Monitor usage** to avoid unexpected costs
- **Use CORS settings** if accessing files directly from the browser

### Environment-Specific Buckets

Consider using separate buckets for different environments:

- `iste-platform-dev` - Development environment
- `iste-platform-staging` - Staging environment
- `iste-platform-prod` - Production environment

## Monitoring and Maintenance

### Monitor Usage

1. Check your R2 usage in the Cloudflare dashboard regularly
2. Set up billing alerts if your usage approaches limits
3. Monitor for unusual activity or unexpected uploads

### Backup Strategy

- R2 provides durability, but consider implementing backup strategies for critical files
- Use lifecycle rules to manage file retention
- Consider versioning for important documents

### Performance Optimization

- Use Cloudflare CDN for frequently accessed files
- Implement caching strategies in your application
- Consider file compression for large documents

## Troubleshooting

### Common Issues

**"Access Denied" Errors**:

- Verify your API token has the correct permissions
- Check that the bucket name is correct
- Ensure your Account ID is accurate

**"Bucket Not Found" Errors**:

- Verify the bucket name in your environment variables
- Check that the bucket exists in your Cloudflare account
- Ensure you're using the correct Account ID

**Upload Failures**:

- Check file size limits (10MB default in the application)
- Verify file types are allowed (PDF, DOC, DOCX)
- Check network connectivity to Cloudflare

**Download Issues**:

- Verify the file exists in R2
- Check that signed URLs are being generated correctly
- Ensure the file hasn't been deleted from R2

### Getting Help

- Check the [Cloudflare R2 documentation](https://developers.cloudflare.com/r2/)
- Review the [R2 API documentation](https://developers.cloudflare.com/r2/api/)
- Contact Cloudflare support for R2-specific issues

## Cost Optimization

### Free Tier Limits

Cloudflare R2 free tier includes:

- 10 GB of storage per month
- 1 million Class A operations per month (writes)
- 10 million Class B operations per month (reads)

### Paid Pricing (as of 2024)

- **Storage**: $0.015 per GB per month
- **Class A operations** (writes): $4.50 per million requests
- **Class B operations** (reads): $0.36 per million requests
- **No egress fees** (unlike AWS S3)

### Cost Optimization Tips

1. **Delete unused files** regularly
2. **Implement file size limits** to prevent abuse
3. **Use lifecycle rules** to automatically clean up old files
4. **Monitor usage** regularly through the dashboard
5. **Consider file compression** for large documents

## Migration from Local Storage

If you're migrating from local file storage:

1. **Backup existing files** before migration
2. **Update database schema** (already done in this setup)
3. **Test thoroughly** in development environment
4. **Plan for downtime** during production migration
5. **Keep local files** as backup until migration is verified

The platform now automatically uses R2 for all new file uploads. Existing files (if any) would need to be migrated manually if needed.

---

This completes the Cloudflare R2 setup for the ISTE platform. The file upload system now uses secure, scalable cloud storage with global performance and cost-effective pricing.
