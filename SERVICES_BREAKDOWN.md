# Services Breakdown for Reddit Brand Promoter MVP

## Services Table

| Service | Provider | Purpose | Implementation Status | Notes |
|---------|----------|---------|----------------------|-------|
| **White Label Platform** | Deal.ai | Base platform, domain, monetization | External Setup Required | Need Deal.ai account setup |
| **User Authentication** | Deal.ai Native | User login/signup management | Integration Required | Use Deal.ai's built-in auth |
| **Database** | Supabase | App-specific data storage | Can Implement | Brand agents, content, metrics |
| **Text Generation** | Grok API | Reddit content generation | Can Implement | Already have API key |
| **Image Generation** | External AI (Imagen) | Visual content creation | External Service | Need separate API setup |
| **Reddit Integration** | Reddit API | Posting, engagement tracking | Can Implement | Need Reddit app registration |
| **Analytics** | Google Analytics | User behavior tracking | External Setup | Need GA account setup |

## What I Can Build (Famous.ai System)

### ✅ Immediate Implementation
1. **Supabase Database Schema** - Brand agents, content, metrics tables
2. **Grok Integration** - Text content generation using existing API key
3. **Reddit API Integration** - Posting and engagement tracking
4. **Core UI Components** - Dashboard, agent creation, content review
5. **Content Management** - Approval workflow, scheduling
6. **Performance Dashboard** - Analytics display from Supabase data

### ⚠️ Requires External Setup
1. **Deal.ai White Label** - Platform account and configuration
2. **Deal.ai Authentication** - User management integration
3. **Image Generation API** - Separate AI service for visuals
4. **Google Analytics** - Tracking setup
5. **Domain Configuration** - app.b0nezb0i.com setup

## Deal.ai vs Supabase Distinction

### Deal.ai Knowledge Base
- User authentication and profiles
- White label platform configuration
- Billing and subscription management
- Platform-level analytics
- Cross-app user data

### Supabase (App-Specific)
- Brand Agent profiles and configurations
- Generated content storage
- Reddit API tokens and credentials
- Engagement metrics and performance data
- Content approval history
- Posting schedules and automation settings

## Brand Library Structure
User-specific data tied to Deal.ai user ID:
- Brand identity (colors, fonts, voice)
- Content templates and preferences
- Historical performance data
- Approved content library
- Reddit account connections
- Custom prompt templates