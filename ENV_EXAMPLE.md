# Environment Variables Example

Copy this to `.env.local` in the root directory and fill in your values.

```env
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# OpenAI API (for JD Reader)
# ============================================
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# RPA Configuration
# ============================================
RPA_ENABLED=false
RPA_SERVICE_URL=
RPA_API_KEY=

# ============================================
# OCR Configuration
# ============================================
OCR_PROVIDER=tesseract
GOOGLE_CLOUD_VISION_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1

# ============================================
# Job Scraper Configuration
# ============================================
SCRAPER_ENABLED=false
SCRAPER_INTERVAL_HOURS=6
SCRAPER_SOURCES=karirhub,dnetwork,kerjabilitas

# ============================================
# Email Configuration
# ============================================
EMAIL_PROVIDER=
SENDGRID_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@inklusifkerja.id

# ============================================
# SMS Configuration
# ============================================
SMS_PROVIDER=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# ============================================
# Security
# ============================================
JWT_SECRET=your-jwt-secret-key-here-change-in-production
SESSION_SECRET=your-session-secret-here-change-in-production

# ============================================
# Feature Flags
# ============================================
FEATURE_JD_READER=true
FEATURE_RPA_ENGINE=false
FEATURE_VOICE_FILTERS=false
FEATURE_ANALYTICS=true

# ============================================
# Development
# ============================================
DEBUG=false
MOCK_MODE=false
```
