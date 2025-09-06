# Artist Song Promotion Landing Page

A modern, edgy Single-Page Application (SPA) template designed for artists to promote new songs and capture email sign-ups for direct track delivery.

## Features

- **Video Teaser Integration**: YouTube video embed for song previews
- **Optimized Email Capture**: High-conversion email signup form
- **A/B Testing**: Built-in variant testing (Version A: Bold typography, Version B: Gradient backgrounds)
- **Analytics Ready**: Google Analytics integration for tracking conversions
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Modern Design**: Edgy, minimalist aesthetic with high contrast

## Components

- `VideoTeaser`: YouTube video embed component
- `EmailSignup`: Conversion-optimized email form
- `SocialLinks`: Social media links component
- `ArtistLanding`: Main landing page with A/B testing

## Customization

Update the artist data in `src/pages/Index.tsx`:

```typescript
const artistData = {
  artistName: "Your Artist Name",
  songTitle: "Your Song Title",
  headline: "Your Headline",
  subheadline: "Your Subheadline",
  videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  socialLinks: [
    { platform: "Instagram", url: "your-instagram-url", icon: "instagram" },
    { platform: "Twitter", url: "your-twitter-url", icon: "twitter" },
    { platform: "Spotify", url: "your-spotify-url", icon: "spotify" }
  ]
};
```

## Analytics Setup

Replace `GA_MEASUREMENT_ID` in `index.html` with your Google Analytics ID to enable tracking.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```