# Inklusif Kerja - Feature Specification 📋

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Specification Document

---

## 📖 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Version A: Job Seeker Interface](#version-a-job-seeker-interface)
3. [Version B: Job Provider Interface](#version-b-job-provider-interface)
4. [Core Technical Modules](#core-technical-modules)
5. [Accessibility & Compliance](#accessibility--compliance)
6. [User Flows](#user-flows)
7. [Technical Architecture](#technical-architecture)

---

## Executive Summary

**Inklusif Kerja** (Inclusive Work) is a dual-version recruitment platform designed to eliminate accessibility barriers in Indonesia's employment ecosystem. The application transforms the job search experience for blind individuals from a 135-minute struggle with inaccessible forms into a seamless, gesture-driven process while providing employers with tools to meet legal hiring quotas and reduce bias.

### Problem Statement

- **76.7%** of standard job portals contain critical blockers for blind users
- Average time to complete an application: **135 minutes** (vs. 15 minutes for sighted users)
- Indonesian Law No. 8/2016 requires **1% (private)** or **2% (public)** disability hiring quotas
- Employers lack knowledge on inclusive recruitment practices and reasonable accommodations

### Solution Overview

- **Version A**: Gesture-based card system for blind job seekers
- **Version B**: Compliance tracking and unbiased screening for employers
- **AI-Powered**: Job description summarization and automated application processing
- **WCAG 2.1 AA Compliant**: Full accessibility standards implementation

---

## Version A: Job Seeker Interface

### 1. Gesture-Based Card System

#### 1.1 Card Interface Design

**Purpose**: Replace complex, inaccessible forms with simple, swipeable job cards.

**Card Structure**:
```
┌─────────────────────────────────────┐
│  [Job Title]                        │
│  [Company Name]                     │
│  ─────────────────────────────────  │
│  💰 [Salary Range]                  │
│  📍 [Location]                      │
│  🚇 [TransJakarta: 200m]            │
│  ♿ [Accessibility: High]           │
│  ─────────────────────────────────  │
│  [AI-Generated Summary]             │
│  (3-4 key points)                   │
└─────────────────────────────────────┘
```

**Card States**:
- **Default**: Full card visible, ready for interaction
- **Swiping Right**: Card moves right with green overlay (Apply action)
- **Swiping Left**: Card moves left with red overlay (Dismiss action)
- **Expanded**: Full job description view (Double Tap)

#### 1.2 Flick-Based Gesture System

**Core Principle**: Only direction matters, not the path. Gestures are forgiving and accommodate varied dexterity levels.

**Supported Gestures**:

| Gesture | Action | Feedback | Audio Cue |
|---------|--------|---------|-----------|
| **Flick Right** | Apply for job | Haptic: Success pulse (2 vibrations) | "Applied" (Indonesian) |
| **Flick Left** | Dismiss/Next job | Haptic: Single pulse | "Next job" |
| **Double Tap** | Open full description | Haptic: Confirmation pulse | "Opening details" |
| **Long Press** | Save for later | Haptic: Long pulse | "Saved" |
| **Swipe Up** | View saved jobs | Haptic: Upward pulse | "Saved jobs" |
| **Swipe Down** | Refresh listings | Haptic: Refresh pulse | "Refreshing" |

**Gesture Detection Algorithm**:
```typescript
interface GestureConfig {
  minSwipeDistance: 50; // pixels
  maxSwipeTime: 300; // milliseconds
  directionThreshold: 0.7; // 70% directional accuracy
  allowCurvedPaths: true; // For dexterity accommodation
}
```

**Implementation Requirements**:
- Touch targets minimum **48×48 pixels** (WCAG 2.1 Level AAA)
- Gesture recognition must work with **single-pointer** interactions only
- No multi-finger gestures required
- Support for assistive touch devices

#### 1.3 Haptic Feedback System

**Purpose**: Provide "cognitive assurance" of task completion through tactile feedback.

**Haptic Patterns**:

| Action | Pattern | Duration | Intensity |
|--------|---------|----------|-----------|
| **Apply Success** | _ _ (2 short pulses) | 200ms each | Medium (0.6) |
| **Dismiss** | _ (1 short pulse) | 150ms | Light (0.4) |
| **Error** | _ _ _ (3 rapid pulses) | 100ms each | Strong (0.8) |
| **Loading** | Continuous vibration | Until complete | Light (0.3) |
| **Confirmation** | Long pulse | 400ms | Medium (0.5) |

**Platform Support**:
- **Android**: Vibration API (navigator.vibrate)
- **iOS**: Haptic Feedback API (UIImpactFeedbackGenerator)
- **Web**: Vibration API with fallback to audio-only

**Code Example**:
```typescript
const hapticFeedback = {
  apply: () => navigator.vibrate([0, 200, 100, 200]),
  dismiss: () => navigator.vibrate([0, 150]),
  error: () => navigator.vibrate([0, 100, 50, 100, 50, 100]),
  loading: () => navigator.vibrate([0, 200, 50, 200, 50, 200]),
};
```

#### 1.4 Audio Feedback System

**Purpose**: Complement haptic feedback with clear audio cues for confirmation.

**Audio Cues Library**:

| Action | Audio File | Duration | Tone |
|--------|------------|----------|------|
| **Apply** | `apply-success.mp3` | 0.5s | Rising tone (C→E) |
| **Dismiss** | `dismiss.mp3` | 0.3s | Neutral tone (C) |
| **Error** | `error.mp3` | 0.4s | Descending tone (E→C) |
| **Card Load** | `card-load.mp3` | 0.2s | Soft chime |
| **Saved** | `saved.mp3` | 0.3s | Confirmation chime |

**Text-to-Speech Integration**:
- **Android**: TalkBack TTS engine
- **iOS**: VoiceOver TTS engine
- **Web**: Web Speech API with Indonesian language support

**Audio Announcements**:
```typescript
const announce = (message: string) => {
  // Screen reader announcement
  const announcement = new SpeechSynthesisUtterance(message);
  announcement.lang = 'id-ID';
  announcement.volume = 0.8;
  window.speechSynthesis.speak(announcement);
  
  // Visual feedback (for low vision users)
  showToast(message);
};
```

#### 1.5 AI-Powered Job Description Summarization (JD Reader)

**Purpose**: Transform long, inaccessible PDFs and job descriptions into structured, audio-friendly summaries.

**Input Sources**:
- PDF documents (scanned or text-based)
- HTML job postings
- Image-based job ads (OCR required)
- Plain text descriptions

**AI Processing Pipeline**:

```
[Raw Job Description]
    ↓
[OCR/Text Extraction] (if PDF/image)
    ↓
[LLM Analysis] (GPT-4 or equivalent)
    ↓
[Structured Extraction]
    ↓
[Audio Card Generation]
```

**Extracted Information**:

1. **Job Title & Company**
   - Format: "Position: [Title] at [Company]"
   - Example: "Position: Software Developer at PT Teknologi Indonesia"

2. **Salary Range**
   - Format: "Salary: [Min] to [Max] Rupiah per month"
   - Example: "Salary: 8 to 12 million Rupiah per month"
   - Includes: Benefits summary if available

3. **Location & Commute Accessibility**
   - Format: "Location: [Address], [Distance] from [Landmark]"
   - Example: "Location: Sudirman, 200 meters from TransJakarta station"
   - Includes:
     - Distance to nearest public transport
     - Accessibility of building entrance
     - Parking availability

4. **Disability Support Level**
   - Format: "Accessibility: [Level] - [Details]"
   - Levels: High, Medium, Low
   - Details include:
     - Screen reader compatible software
     - Assistive technology support
     - Physical accessibility (ramps, elevators)
     - Flexible work arrangements

**LLM Prompt Template**:
```
Extract the following information from this job description in Indonesian:

1. Job Title and Company Name
2. Salary Range (if mentioned)
3. Location with public transport accessibility
4. Disability support level and accommodations

Format as a structured summary suitable for audio reading.
Keep it concise (under 150 words).
```

**Output Format**:
```json
{
  "title": "Software Developer",
  "company": "PT Teknologi Indonesia",
  "salary": {
    "min": 8000000,
    "max": 12000000,
    "currency": "IDR"
  },
  "location": {
    "address": "Jl. Sudirman No. 123",
    "district": "Jakarta Pusat",
    "transjakartaDistance": 200,
    "accessibility": "Wheelchair accessible entrance"
  },
  "supportLevel": "High",
  "accommodations": [
    "JAWS screen reader compatible",
    "Flexible work hours",
    "Remote work option available"
  ],
  "summary": "Position: Software Developer at PT Teknologi Indonesia. Salary: 8 to 12 million Rupiah per month. Location: Sudirman, 200 meters from TransJakarta station. Accessibility: High - JAWS compatible, flexible hours, remote option."
}
```

**Audio Card Playback**:
- Auto-reads summary when card loads
- Pause/Resume controls
- Speed adjustment (0.5x to 2x)
- Repeat last sentence option

### 2. Job Discovery & Filtering

#### 2.1 Smart Job Matching

**Matching Criteria**:
- Skills alignment (percentage match)
- Location proximity to user's preferred area
- Accessibility level requirements
- Salary range preferences
- Work arrangement (remote, hybrid, on-site)

**Filter Options** (Voice-Activated):
- "Show jobs near TransJakarta"
- "Show remote jobs only"
- "Show high accessibility jobs"
- "Show jobs paying above 10 million"

#### 2.2 Saved Jobs Management

- Swipe up gesture to view saved jobs
- Organize by: Applied, Saved, Interested
- Reminder notifications for application deadlines

### 3. Application Tracking

**Status Tracking**:
- Applied (with date)
- Under Review
- Interview Scheduled
- Offer Received
- Rejected

**Notifications**:
- Haptic + Audio for status updates
- Screen reader announcements
- Optional email/SMS notifications

---

## Version B: Job Provider Interface

### 1. Employer Dashboard Overview

**Purpose**: Provide employers with tools to meet legal hiring quotas, understand accommodations, and reduce bias in recruitment.

**Dashboard Sections**:
1. Quota Compliance Tracker
2. Job Posting Management
3. Candidate Screening (Unbiased)
4. Reasonable Accommodation Profiles
5. Analytics & Reports

### 2. Quota Compliance Tracker

#### 2.1 Real-Time Compliance Visualizer

**Purpose**: Show company progress toward mandatory hiring quotas (Law No. 8/2016).

**Compliance Requirements**:
- **Private Sector**: 1% of total workforce
- **Public Sector**: 2% of total workforce
- **Calculation**: (Employees with Disabilities / Total Employees) × 100

**Visual Components**:

```
┌─────────────────────────────────────┐
│  Compliance Status                  │
│  ─────────────────────────────────  │
│  Current: 0.5% (5/1000 employees)   │
│  Required: 1.0% (10/1000)          │
│  ─────────────────────────────────  │
│  [Progress Bar: 50%]                │
│  ─────────────────────────────────  │
│  Gap: 5 employees needed            │
│  Deadline: [Date]                   │
│  ─────────────────────────────────  │
│  [View Action Plan]                 │
└─────────────────────────────────────┘
```

**Features**:
- **Real-time Updates**: Syncs with HR system
- **Department Breakdown**: Compliance by department
- **Historical Trends**: Track progress over time
- **Alerts**: Notifications when below threshold
- **Action Recommendations**: Suggested hiring actions

**Compliance Calculation**:
```typescript
interface ComplianceMetrics {
  totalEmployees: number;
  employeesWithDisabilities: number;
  requiredPercentage: number; // 1% or 2%
  currentPercentage: number;
  gap: number; // Employees needed
  deadline: Date;
  status: 'compliant' | 'at-risk' | 'non-compliant';
}
```

**Visualization Types**:
1. **Progress Ring**: Circular progress indicator
2. **Bar Chart**: Department-wise breakdown
3. **Timeline**: Historical compliance trends
4. **Heat Map**: Department compliance status

#### 2.2 Action Plan Generator

**Purpose**: Generate actionable steps to achieve compliance.

**Action Plan Components**:
- **Immediate Actions**: Post jobs, review current candidates
- **Short-term**: Training programs, accommodation setup
- **Long-term**: Policy updates, inclusive hiring practices

**Example Output**:
```
Action Plan to Achieve Compliance:
─────────────────────────────────
1. Post 3 new accessible job listings (This week)
2. Review 15 pending applications from disabled candidates (This week)
3. Schedule interviews with top 5 candidates (Next week)
4. Set up screen reader testing environment (Next month)
5. Train HR team on inclusive hiring (Next month)
```

### 3. Reasonable Accommodation Profiling

#### 3.1 Accommodation Database

**Purpose**: Help employers understand what accommodations are needed and their costs.

**Accommodation Categories**:

1. **Technology Accommodations**
   - Screen reader software (JAWS, NVDA, VoiceOver)
   - Braille displays
   - Voice recognition software
   - Large print displays
   - High contrast monitors

2. **Physical Accommodations**
   - Wheelchair accessible entrances
   - Adjustable desks
   - Ergonomic keyboards
   - Tactile paving
   - Accessible restrooms

3. **Work Arrangement Accommodations**
   - Flexible work hours
   - Remote work options
   - Reduced work hours
   - Job sharing

4. **Communication Accommodations**
   - Sign language interpreters
   - Captioning services
   - Alternative communication methods
   - Extended time for tasks

**Accommodation Profile Template**:
```json
{
  "candidateId": "12345",
  "disabilityType": "Visual Impairment",
  "accommodations": [
    {
      "type": "Technology",
      "item": "JAWS Screen Reader",
      "cost": 5000000,
      "oneTime": true,
      "description": "Professional screen reader software for Windows",
      "setupTime": "2-3 days"
    },
    {
      "type": "Work Arrangement",
      "item": "Flexible Hours",
      "cost": 0,
      "oneTime": false,
      "description": "Allow flexible start/end times",
      "setupTime": "Immediate"
    }
  ],
  "totalCost": 5000000,
  "estimatedSetupTime": "1 week"
}
```

#### 3.2 Cost Calculator

**Purpose**: Estimate total accommodation costs.

**Features**:
- One-time vs. recurring costs
- Government subsidy eligibility
- ROI calculator (productivity gains)
- Comparison with non-accommodation scenarios

**Cost Breakdown Example**:
```
Accommodation Cost Estimate
───────────────────────────
One-time Costs:
  - JAWS Screen Reader: Rp 5,000,000
  - Ergonomic Keyboard: Rp 500,000
  - Total: Rp 5,500,000

Recurring Costs:
  - Software License (annual): Rp 2,000,000
  - Support Services (monthly): Rp 500,000

Government Subsidies Available:
  - Technology Grant: Up to Rp 10,000,000
  - Eligible: Yes

Net Cost: Rp 0 (Fully subsidized)
```

### 4. Unbiased Screening System

#### 4.1 Blind Audio Screening

**Purpose**: Remove visual bias from initial candidate screening.

**Screening Process**:

1. **Audio Profile Creation**
   - Candidate records professional summary (2-3 minutes)
   - Structured format: Experience, Skills, Motivation
   - Optional: Professional voice actor narration

2. **Skill-Based Scoring**
   - Technical skills assessment (no photo)
   - Work sample evaluation
   - Behavioral interview questions

3. **Blind Review Interface**
   - No candidate photos
   - No names (initials only)
   - No age/gender indicators
   - Focus on: Skills, Experience, Fit

**Audio Screening Interface**:
```
┌─────────────────────────────────────┐
│  Candidate: A.B.                    │
│  ─────────────────────────────────  │
│  [▶ Play Audio Profile]             │
│  Duration: 2:34                     │
│  ─────────────────────────────────  │
│  Skills Score: 85/100                │
│  Experience: 5 years                │
│  Education: Bachelor's Degree        │
│  ─────────────────────────────────  │
│  [View Full Profile]                │
│  [Schedule Interview]                │
│  [Reject]                           │
└─────────────────────────────────────┘
```

**Features**:
- **Playback Controls**: Play, Pause, Rewind, Speed adjustment
- **Transcript View**: Optional text transcript
- **Comparison Mode**: Side-by-side audio comparison
- **Notes**: Recruiter can add private notes
- **Rating System**: Score candidates on multiple dimensions

#### 4.2 Skill Mapping Tool

**Purpose**: Help employers understand how blind candidates' skills map to job requirements.

**Skill Categories**:
- **Technical Skills**: Programming, data analysis, etc.
- **Soft Skills**: Communication, problem-solving, etc.
- **Adaptive Skills**: Screen reader proficiency, etc.

**Skill Assessment**:
- Self-reported skills (with verification)
- Portfolio/work samples
- Skills tests (accessible format)
- Third-party certifications

**Skill Match Visualization**:
```
Job Requirements vs. Candidate Skills
──────────────────────────────────────
Technical Skills:
  ✅ JavaScript: Expert (Required: Intermediate)
  ✅ React: Advanced (Required: Intermediate)
  ⚠️  Python: Basic (Required: Advanced)
  
Soft Skills:
  ✅ Communication: Excellent
  ✅ Problem Solving: Strong
  ✅ Teamwork: Excellent

Overall Match: 85%
Recommendation: Strong Candidate
```

### 5. Job Posting Management

#### 5.1 Accessible Job Posting Creator

**Purpose**: Create job postings that are accessible and attract diverse candidates.

**Features**:
- **Accessibility Checklist**: Ensures posting meets WCAG standards
- **Inclusive Language Checker**: Flags biased language
- **Accommodation Information**: Space to describe workplace accommodations
- **Multi-format Export**: PDF, HTML, Plain Text

**Posting Template**:
```
Job Title: [Required]
Company: [Required]
Location: [Required]
Salary Range: [Optional but recommended]
─────────────────────────────────────
Job Description:
[Rich text editor with accessibility checker]

Required Skills:
[Bullet list]

Preferred Qualifications:
[Bullet list]

Workplace Accommodations:
[ ] Wheelchair accessible
[ ] Screen reader compatible
[ ] Flexible work hours
[ ] Remote work available
[ ] Other: [Specify]

Application Instructions:
[Clear, step-by-step process]
```

#### 5.2 Posting Analytics

**Metrics Tracked**:
- Views (total, unique)
- Applications received
- Application completion rate
- Diversity metrics (optional, anonymized)
- Time to fill position

### 6. Analytics & Reports

#### 6.1 Compliance Reports

**Report Types**:
1. **Monthly Compliance Report**: Current status, trends
2. **Hiring Activity Report**: Applications, interviews, hires
3. **Accommodation Cost Report**: Spending on accommodations
4. **Diversity Metrics**: Representation across departments

**Export Formats**:
- PDF (accessible)
- Excel
- CSV

#### 6.2 Performance Dashboards

**Key Metrics**:
- Time to hire (disabled vs. non-disabled candidates)
- Retention rates
- Productivity metrics
- Accommodation ROI

---

## Core Technical Modules

### Module 1: Scraper & Parser Agent

#### 1.1 Overview

**Purpose**: Automatically collect job listings from multiple sources and extract structured data.

**Supported Sources**:
- **Kemnaker Karirhub**: Official government job portal
- **DNetwork**: Disability employment network
- **Kerjabilitas**: Disability-focused job platform
- **LinkedIn Indonesia**: General job postings
- **JobStreet Indonesia**: General job postings
- **Custom Company Websites**: Configurable scrapers

#### 1.2 Architecture

```
[Job Sources]
    ↓
[Scraper Engine]
    ↓
[OCR/Text Extraction] (if needed)
    ↓
[Parser Agent] (LLM-powered)
    ↓
[Data Validation]
    ↓
[Database Storage]
```

#### 1.3 Scraping Methods

**1. API Integration** (Preferred):
- Direct API access where available
- Rate limiting and authentication
- Scheduled updates (every 6 hours)

**2. Web Scraping**:
- Headless browser (Puppeteer/Playwright)
- Respect robots.txt
- Handle dynamic content (React/Vue apps)
- Cookie/session management

**3. RSS/Feed Parsing**:
- XML/RSS feed parsing
- Atom feed support
- Scheduled polling

#### 1.4 OCR & Text Extraction

**Use Cases**:
- Scanned PDF job descriptions
- Image-based job ads (social media)
- Screenshots of job postings

**OCR Pipeline**:
```python
# Pseudo-code
def extract_text_from_image(image_path):
    # Step 1: Preprocessing
    image = preprocess_image(image_path)  # Enhance contrast, denoise
    
    # Step 2: OCR
    text = ocr_engine.extract(image, language='id')  # Indonesian support
    
    # Step 3: Post-processing
    text = clean_text(text)  # Remove artifacts, fix common errors
    
    return text
```

**OCR Engines**:
- **Tesseract**: Open-source, multi-language
- **Google Cloud Vision API**: High accuracy
- **AWS Textract**: Document-focused
- **Azure Computer Vision**: General purpose

**Text Extraction from PDFs**:
- **PyPDF2**: Text-based PDFs
- **pdfplumber**: Complex layouts
- **Adobe PDF Services API**: Professional grade

#### 1.5 Parser Agent (LLM-Powered)

**Purpose**: Extract structured data from unstructured job descriptions.

**LLM Model**: GPT-4 or equivalent (Claude, Gemini)

**Extraction Schema**:
```typescript
interface ParsedJobListing {
  title: string;
  company: string;
  location: {
    address: string;
    city: string;
    district?: string;
    coordinates?: { lat: number; lng: number };
  };
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  benefits: string[];
  workArrangement: 'remote' | 'hybrid' | 'on-site';
  accessibility: {
    level: 'high' | 'medium' | 'low';
    details: string[];
  };
  applicationUrl: string;
  deadline?: Date;
  source: string;
  sourceId: string;
}
```

**LLM Prompt Template**:
```
You are a job listing parser. Extract the following information from this job description in Indonesian:

1. Job Title
2. Company Name
3. Location (with district/city)
4. Salary Range (if mentioned)
5. Job Description (summary)
6. Requirements (list)
7. Benefits (list)
8. Work Arrangement (remote/hybrid/on-site)
9. Accessibility Information (if mentioned)
10. Application URL or Instructions

Return as JSON following this schema: [schema]

Job Description:
[raw_text]
```

**Error Handling**:
- **Validation**: Schema validation for extracted data
- **Confidence Scoring**: LLM confidence score for each field
- **Manual Review Queue**: Low-confidence extractions flagged for review
- **Retry Logic**: Failed extractions retried with different prompts

#### 1.6 Data Storage & Deduplication

**Storage**:
- **Database**: PostgreSQL with full-text search
- **Cache**: Redis for frequently accessed listings
- **File Storage**: S3-compatible for PDFs/images

**Deduplication Algorithm**:
```typescript
function isDuplicate(newJob: ParsedJobListing, existingJobs: ParsedJobListing[]): boolean {
  // Check 1: Exact title + company match
  const exactMatch = existingJobs.find(
    j => j.title === newJob.title && j.company === newJob.company
  );
  if (exactMatch) return true;
  
  // Check 2: Similarity score (fuzzy matching)
  const similarity = calculateSimilarity(newJob, existingJobs);
  if (similarity > 0.85) return true; // 85% similarity threshold
  
  // Check 3: URL matching (if same source)
  const urlMatch = existingJobs.find(j => j.applicationUrl === newJob.applicationUrl);
  if (urlMatch) return true;
  
  return false;
}
```

**Update Strategy**:
- **New Listings**: Added immediately
- **Updated Listings**: Detected via change in description/requirements
- **Expired Listings**: Marked as inactive after deadline passes
- **Archive**: Old listings archived after 90 days

### Module 2: Automated Application Engine (RPA)

#### 2.1 Overview

**Purpose**: Automatically fill out external company web forms on behalf of users, bypassing accessibility blockers.

**Use Case**: When a job seeker wants to apply for a job on an external company website that has inaccessible forms, the RPA engine fills it out automatically using the user's saved profile data.

#### 2.2 Architecture

```
[User Profile Data]
    ↓
[Form Analyzer] (AI-powered)
    ↓
[Field Mapper] (Match profile to form fields)
    ↓
[RPA Engine] (Browser automation)
    ↓
[Form Filler] (Fill fields, handle captchas)
    ↓
[Submission Handler] (Submit, capture confirmation)
    ↓
[Status Tracker] (Monitor application status)
```

#### 2.3 Form Analysis

**AI-Powered Form Analyzer**:

**Input**: URL of job application form

**Process**:
1. **Load Form**: Headless browser loads the form
2. **DOM Analysis**: Extract form structure
3. **Field Detection**: Identify input fields, labels, required fields
4. **Accessibility Check**: Detect unlabeled fields, missing ARIA labels
5. **Field Mapping**: Map form fields to user profile data

**Field Detection**:
```typescript
interface FormField {
  type: 'text' | 'email' | 'phone' | 'file' | 'select' | 'textarea' | 'checkbox' | 'radio';
  name: string;
  label?: string; // May be missing (accessibility issue)
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select/radio
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  accessibility: {
    hasLabel: boolean;
    hasAriaLabel: boolean;
    isAccessible: boolean;
  };
}
```

**LLM-Powered Field Mapping**:
```
Analyze this job application form and map each field to user profile data.

Form Fields:
[list of fields with types and labels]

User Profile Schema:
[profile schema]

Return mapping as JSON:
{
  "field_name": {
    "profileField": "profile.field.path",
    "confidence": 0.95,
    "transformation": "optional transformation function"
  }
}
```

#### 2.4 RPA Engine Implementation

**Technology Stack**:
- **Playwright**: Modern browser automation
- **Puppeteer**: Alternative option
- **Selenium**: Legacy support if needed

**RPA Workflow**:
```typescript
async function fillApplicationForm(
  formUrl: string,
  userProfile: UserProfile,
  fieldMapping: FieldMapping
): Promise<ApplicationResult> {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Step 1: Navigate to form
    await page.goto(formUrl, { waitUntil: 'networkidle' });
    
    // Step 2: Fill fields
    for (const [fieldName, mapping] of Object.entries(fieldMapping)) {
      const value = getProfileValue(userProfile, mapping.profileField);
      await fillField(page, fieldName, value);
    }
    
    // Step 3: Handle file uploads (resume, etc.)
    if (userProfile.resume) {
      await uploadFile(page, 'resume', userProfile.resume);
    }
    
    // Step 4: Handle CAPTCHA (if present)
    if (await hasCaptcha(page)) {
      await handleCaptcha(page); // May require manual intervention
    }
    
    // Step 5: Submit form
    await submitForm(page);
    
    // Step 6: Capture confirmation
    const confirmation = await captureConfirmation(page);
    
    return {
      success: true,
      confirmationId: confirmation.id,
      message: confirmation.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  } finally {
    await browser.close();
  }
}
```

#### 2.5 Handling Accessibility Blockers

**Common Blockers**:
1. **Unlabeled Fields**: Use AI to infer field purpose from context
2. **CAPTCHA**: Integration with CAPTCHA solving services (2Captcha, Anti-Captcha)
3. **Dynamic Forms**: Wait for JavaScript to load, handle dynamic content
4. **File Uploads**: Handle resume/CV uploads
5. **Multi-step Forms**: Navigate through wizard-style forms

**AI-Powered Field Inference**:
```
This form field has no label. Based on the context (surrounding text, field type, placeholder), infer what information it expects.

Field Context:
- Type: text input
- Placeholder: "Enter your name"
- Position: First field in form
- Surrounding text: "Personal Information"

Infer the field purpose and map to user profile.
```

#### 2.6 User Profile Management

**Profile Structure**:
```typescript
interface UserProfile {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
    };
    dateOfBirth: Date;
    nationalId: string; // KTP number
  };
  professionalInfo: {
    resume: File; // PDF or DOCX
    coverLetter: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string[];
    certifications: Certification[];
  };
  accessibility: {
    disabilityType: string;
    accommodations: string[];
    assistiveTech: string[];
  };
  preferences: {
    preferredSalary: { min: number; max: number };
    preferredLocation: string[];
    workArrangement: 'remote' | 'hybrid' | 'on-site';
  };
}
```

**Profile Builder**:
- Initial setup wizard (accessible)
- Import from LinkedIn
- Import from existing resume (PDF parsing)
- Manual entry with voice input support

#### 2.7 Application Tracking

**Status Monitoring**:
- **Submitted**: Application successfully submitted
- **Under Review**: Company has received application
- **Interview Scheduled**: Interview date set
- **Offer Received**: Job offer extended
- **Rejected**: Application rejected

**Tracking Methods**:
1. **Email Monitoring**: Parse confirmation emails
2. **Portal Monitoring**: Check application status on company portal (if accessible)
3. **Manual Updates**: User can update status manually

### Module 3: Screen Reader Integration

#### 3.1 Overview

**Purpose**: Ensure full compatibility with screen readers used by blind and visually impaired users.

**Supported Screen Readers**:
- **Android**: TalkBack
- **iOS**: VoiceOver
- **Windows**: NVDA, JAWS
- **macOS**: VoiceOver
- **Web**: Screen reader APIs (Chrome, Firefox, Safari)

#### 3.2 ARIA Implementation

**ARIA Labels for Dynamic Content**:

**Card Component**:
```tsx
<div
  role="article"
  aria-label={`Job card: ${job.title} at ${job.company}`}
  aria-describedby={`job-summary-${job.id}`}
  tabIndex={0}
>
  <h2 id={`job-title-${job.id}`}>{job.title}</h2>
  <p id={`job-summary-${job.id}`}>{job.summary}</p>
  <div role="group" aria-label="Job actions">
    <button
      aria-label="Apply for this job"
      onClick={handleApply}
    >
      Apply
    </button>
    <button
      aria-label="Dismiss this job"
      onClick={handleDismiss}
    >
      Dismiss
    </button>
  </div>
</div>
```

**Live Regions for Updates**:
```tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {announcement}
</div>
```

**ARIA Patterns Used**:
- **`role="article"`**: Job cards
- **`role="button"`**: Interactive elements
- **`role="navigation"`**: Navigation menus
- **`aria-label`**: Descriptive labels for all interactive elements
- **`aria-describedby`**: Additional context
- **`aria-live`**: Dynamic content announcements
- **`aria-expanded`**: Collapsible sections
- **`aria-hidden`**: Hide decorative elements

#### 3.3 Touch Target Sizing

**WCAG Requirement**: Minimum 44×44 CSS pixels (48×48 recommended)

**Implementation**:
```css
/* All interactive elements */
button, a, input, select {
  min-width: 48px;
  min-height: 48px;
  padding: 12px; /* Ensures adequate touch target */
}

/* Gesture areas */
.gesture-area {
  min-width: 48px;
  min-height: 48px;
  touch-action: pan-y; /* Allow vertical scrolling */
}
```

**Touch Target Spacing**:
- Minimum 8px spacing between touch targets
- Prevents accidental taps

#### 3.4 Focus Management

**Focus Order**:
- Logical top-to-bottom flow
- Skip links for main content
- Focus trap prevention (no pop-ups trap focus)

**Visual Focus Indicators**:
```css
:focus-visible {
  outline: 3px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Focus Management Code**:
```typescript
// Ensure focus moves logically
function handleCardNavigation(direction: 'next' | 'previous') {
  const cards = document.querySelectorAll('[role="article"]');
  const currentIndex = Array.from(cards).indexOf(document.activeElement);
  
  if (direction === 'next') {
    const nextCard = cards[currentIndex + 1];
    if (nextCard) {
      (nextCard as HTMLElement).focus();
      announce(`Moved to next job: ${getJobTitle(nextCard)}`);
    }
  } else {
    const prevCard = cards[currentIndex - 1];
    if (prevCard) {
      (prevCard as HTMLElement).focus();
      announce(`Moved to previous job: ${getJobTitle(prevCard)}`);
    }
  }
}
```

**Skip Links**:
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<a href="#navigation" className="skip-link">
  Skip to navigation
</a>
```

#### 3.5 Keyboard Navigation

**Keyboard Shortcuts**:
- **Tab**: Move to next interactive element
- **Shift+Tab**: Move to previous element
- **Enter/Space**: Activate button/link
- **Arrow Keys**: Navigate within components (cards, lists)
- **Escape**: Close modals, cancel actions

**Custom Keyboard Shortcuts**:
- **A**: Apply for current job
- **D**: Dismiss current job
- **S**: Save job for later
- **R**: Read full description
- **N**: Next job
- **P**: Previous job

**Keyboard Event Handlers**:
```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return; // Don't interfere with typing
    
    switch (e.key.toLowerCase()) {
      case 'a':
        handleApply();
        break;
      case 'd':
        handleDismiss();
        break;
      case 's':
        handleSave();
        break;
      // ... more shortcuts
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

#### 3.6 Screen Reader Testing

**Testing Checklist**:
- [ ] All interactive elements are focusable
- [ ] All elements have descriptive labels
- [ ] Dynamic content is announced
- [ ] Form errors are announced
- [ ] Navigation is logical
- [ ] No focus traps
- [ ] Touch targets are adequate size
- [ ] Content is readable at 200% zoom

**Testing Tools**:
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Accessibility audit
- **Manual Testing**: Actual screen reader testing (TalkBack, VoiceOver)

---

## Accessibility & Compliance

### WCAG 2.1 Level AA Compliance

#### 1. Perceivable

**1.1 Text Alternatives**:
- All images have alt text
- Decorative images marked as `aria-hidden="true"`
- Icons have text labels or `aria-label`

**1.2 Time-based Media**:
- Audio descriptions for video content (if any)
- Captions for audio content
- Transcripts available

**1.3 Adaptable**:
- Content can be presented in different ways without losing information
- Responsive design (mobile, tablet, desktop)
- Text can be resized up to 200% without loss of functionality

**1.4 Distinguishable**:
- **Color Contrast**: 
  - Text: 4.5:1 ratio (normal text)
  - Large Text: 3:1 ratio (18pt+ or 14pt+ bold)
  - UI Components: 3:1 ratio (buttons, form controls)
- **Text Spacing**: Line height, paragraph spacing adjustable
- **No Color Alone**: Information not conveyed by color alone

#### 2. Operable

**2.1 Keyboard Accessible**:
- All functionality available via keyboard
- No keyboard traps
- Keyboard shortcuts documented

**2.2 Enough Time**:
- No time limits on content (or adjustable)
- Pause/stop controls for auto-updating content

**2.3 Seizures and Physical Reactions**:
- No flashing content (more than 3 flashes per second)

**2.4 Navigable**:
- Skip links provided
- Page titles descriptive
- Focus order logical
- Multiple ways to find content (search, navigation, filters)

**2.5 Input Modalities**:
- Touch targets at least 44×44 CSS pixels
- Gestures can be performed with one hand
- No complex gestures required

#### 3. Understandable

**3.1 Readable**:
- Language of page identified (`lang="id"` for Indonesian)
- Unusual words defined
- Abbreviations explained

**3.2 Predictable**:
- Consistent navigation
- Consistent identification of components
- No unexpected context changes

**3.3 Input Assistance**:
- Error identification (clear error messages)
- Labels and instructions provided
- Error suggestions provided
- Error prevention (confirmations for important actions)

#### 4. Robust

**4.1 Compatible**:
- Valid HTML
- Proper use of ARIA attributes
- Screen reader compatibility
- Assistive technology compatibility

### Implementation Checklist

**Design Phase**:
- [ ] Color contrast ratios calculated
- [ ] Touch target sizes specified (48×48px minimum)
- [ ] Focus indicators designed
- [ ] Keyboard navigation flow mapped

**Development Phase**:
- [ ] ARIA labels added to all interactive elements
- [ ] Semantic HTML used
- [ ] Keyboard navigation implemented
- [ ] Screen reader tested (TalkBack, VoiceOver)
- [ ] Color contrast verified (4.5:1 for text, 3:1 for UI)

**Testing Phase**:
- [ ] Automated accessibility testing (axe, WAVE)
- [ ] Manual screen reader testing
- [ ] Keyboard-only navigation testing
- [ ] High contrast mode testing
- [ ] Zoom testing (200%)

---

## User Flows

### Flow 1: Job Seeker - Browse and Apply

```
1. User opens app
   ↓
2. Screen reader announces: "Inklusif Kerja, Job Seeker Portal"
   ↓
3. First job card loads automatically
   ↓
4. JD Reader announces job summary:
   "Position: Software Developer at PT Teknologi Indonesia.
    Salary: 8 to 12 million Rupiah per month.
    Location: Sudirman, 200 meters from TransJakarta station.
    Accessibility: High - JAWS compatible, flexible hours."
   ↓
5. User gestures:
   - Flick Right → Apply
     → Haptic: 2 pulses
     → Audio: "Applied"
     → Confirmation card shown
   - Flick Left → Dismiss
     → Haptic: 1 pulse
     → Audio: "Next job"
     → Next card loads
   - Double Tap → Full description
     → Haptic: Confirmation pulse
     → Audio: "Opening details"
     → Expanded view shown
   ↓
6. Application submitted via RPA (if external site)
   ↓
7. Status tracked in "My Applications"
```

### Flow 2: Employer - Post Job and Review Candidates

```
1. Employer logs into dashboard
   ↓
2. Views compliance status:
   "Current: 0.5%, Required: 1.0%, Gap: 5 employees"
   ↓
3. Clicks "Post New Job"
   ↓
4. Fills accessible job posting form:
   - Job title, description
   - Salary range
   - Location with accessibility info
   - Workplace accommodations checklist
   ↓
5. Accessibility checker validates posting
   ↓
6. Job posted, appears in job seeker app
   ↓
7. Applications received
   ↓
8. Employer reviews candidates via Blind Audio Screening:
   - Listens to audio profiles
   - Reviews skill scores (no photos)
   - Adds notes
   ↓
9. Selects candidates for interview
   ↓
10. Views accommodation profiles for selected candidates
    ↓
11. Schedules interviews
    ↓
12. Compliance tracker updates automatically
```

### Flow 3: RPA - Automated Application

```
1. Job seeker finds job on external site
   ↓
2. Clicks "Apply with RPA" button
   ↓
3. System analyzes application form:
   - Detects form fields
   - Maps fields to user profile
   - Identifies accessibility blockers
   ↓
4. User reviews mapped data:
   "We'll fill: Name, Email, Phone, Resume"
   ↓
5. User confirms application
   ↓
6. RPA engine:
   - Opens headless browser
   - Navigates to form
   - Fills fields automatically
   - Handles CAPTCHA (if needed)
   - Submits form
   ↓
7. Confirmation captured:
   "Application submitted successfully. Confirmation ID: ABC123"
   ↓
8. Status tracked in "My Applications"
```

---

## Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Version A    │  │ Version B    │  │  Shared      │ │
│  │ (Job Seeker) │  │ (Employer)   │  │  Components  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend API (Node.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Job API      │  │ User API     │  │  RPA API     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Core Technical Modules                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Scraper &    │  │ Automated    │  │  Screen       │ │
│  │ Parser       │  │ Application  │  │  Reader       │ │
│  │ Agent        │  │ Engine (RPA) │  │  Integration │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│              External Services & APIs                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ LLM API      │  │ OCR Service   │  │  Job Sources │ │
│  │ (GPT-4)      │  │ (Tesseract)   │  │  (Karirhub)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Job          │  │ User         │  │  Application │ │
│  │ Listings     │  │ Profiles     │  │  Tracking   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Next.js 16.1.1 (App Router)
- React 18.3.1
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- next-pwa (PWA support)

**Backend**:
- Node.js
- Express.js or Next.js API Routes
- PostgreSQL (database)
- Redis (caching)

**AI/ML Services**:
- OpenAI GPT-4 (job parsing, summarization)
- Tesseract OCR (text extraction)
- Google Cloud Vision API (alternative OCR)

**RPA**:
- Playwright (browser automation)
- Puppeteer (alternative)

**Accessibility**:
- ARIA attributes
- Screen reader APIs
- Haptic feedback APIs

**Deployment**:
- Vercel (frontend)
- AWS/Google Cloud (backend, RPA workers)
- Docker (containerization)

---

## Success Metrics

### User Experience Metrics

**Job Seeker**:
- Average time to apply: **< 5 minutes** (vs. 135 minutes on standard portals)
- Application completion rate: **> 90%**
- User satisfaction score: **> 4.5/5**

**Employer**:
- Compliance achievement rate: **> 80%**
- Time to fill positions: **< 30 days**
- Candidate quality score: **> 4.0/5**

### Technical Metrics

- **Uptime**: 99.9%
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **RPA Success Rate**: > 85%
- **OCR Accuracy**: > 95%

### Accessibility Metrics

- **WCAG Compliance**: 100% Level AA
- **Screen Reader Compatibility**: 100% (TalkBack, VoiceOver)
- **Keyboard Navigation**: 100% functionality
- **Color Contrast**: 100% compliant

---

## Future Enhancements

1. **Multi-language Support**: Expand beyond Indonesian
2. **Video Interviews**: Accessible video interview platform
3. **Skill Assessments**: Accessible skills testing platform
4. **Mentorship Matching**: Connect job seekers with mentors
5. **Employer Training**: Online courses on inclusive hiring
6. **Analytics Dashboard**: Advanced analytics for employers
7. **Mobile Apps**: Native iOS and Android apps
8. **Offline Mode**: Work offline, sync when online

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Specification Complete - Ready for Development
