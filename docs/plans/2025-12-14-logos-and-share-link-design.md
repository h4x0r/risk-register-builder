# Logos and Share Link Design

## Overview

Add co-branded logos to header and enable sharing risk registers via URL.

## Design Decisions

### 1. Header with Co-branded Logos

- Two logos side by side with "×" divider
- Both logos: 36px height, equal sizing
- HKIOS logo → links to https://www.hkios.hk/
- Security Ronin logo → links to https://www.securityronin.com/
- hkios-logo.png used as favicon/app icon
- Replaces text title

### 2. URL State Encoding

- Use `lz-string` library for compression
- Format: `?data=<compressed-base64>`
- Only encode `entries` array
- On page load: decompress and hydrate store
- Warn if URL > 2,000 chars

### 3. Export Link Feature

- New "Copy Link" option in export dropdown
- Copies compressed URL to clipboard
- Toast notification: "Link copied to clipboard"
- Warning toast if URL too long

## Implementation Tasks

1. Move logo files to /public/
2. Update favicon in app metadata
3. Update AppHeader with logos
4. Install lz-string library
5. Add URL encoding/decoding utilities
6. Add URL hydration on page load
7. Add Copy Link to export dropdown
8. Add toast notification component
9. Add i18n translations
