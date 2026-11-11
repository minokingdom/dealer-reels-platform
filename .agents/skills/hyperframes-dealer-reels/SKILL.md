---
name: hyperframes-dealer-reels
description: >-
  Creates deterministic 9:16 Instagram Reels and short-form promotional videos for car dealers using the HyperFrames architecture (HTML/CSS, seekable timelines on window.__timelines, 3D showroom effects, kinetic typography, and personalized dealer outro cards). Use this skill whenever the user asks to generate, edit, or automate car promotion short-form videos or HyperFrames compositions.
---

# HyperFrames Car Dealer Reels Skill

This skill defines the standard architecture and workflow for generating programmatic 9:16 (1080x1920, 60fps) automotive promotional Reels using the **HyperFrames** deterministic timeline specification.

## 1. HyperFrames Scene Specification

Every composition MUST adhere to the deterministic seeking model so both the temporary dealer preview web page and the headless frame-by-frame MP4 encoder produce 100% pixel-identical output:

1. **Clip Containers (`data-start`, `data-duration`, `data-track-index`)**:
   - **Scene 1 (`0.0s ~ 3.0s`) — Impact Hook & Discount Counter**:
     - `<div id="clip-hook" class="clip" data-start="0" data-duration="3" data-track-index="0">`
     - Kinetic typography hook headline + rapidly counting discount number (`0` -> `targetDiscount` with `power4.out` easing).
   - **Scene 2 (`3.0s ~ 8.0s`) — 3D Showroom Vehicle Showcase & Benefits**:
     - `<div id="clip-showcase" class="clip" data-start="3" data-duration="5" data-track-index="0">`
     - 3D perspective showroom lighting, Ken Burns / 3D tilt camera movement over vehicle photos or 3D models, and staggered benefit cards.
   - **Persistent Overlay (`0.0s ~ 8.0s`) — Dealer Lower-Third Bar**:
     - `<div id="clip-lower-third" class="clip" data-start="0" data-duration="8" data-track-index="1">`
     - Displays `[Branch | Dealer Name & Title | Phone Number]` at the bottom of the promo section.
   - **Scene 3 (`8.0s ~ 12.0s`) — Personalized Dealer 3D Metallic Outro Card**:
     - `<div id="clip-dealer-outro" class="clip" data-start="8" data-duration="4" data-track-index="0">`
     - 3D flip transition into the dealer's personalized business card (profile badge/photo, branch, name, large phone CTA, special release gift package, and QR code).

2. **Global Timeline Registration (`window.__timelines`)**:
   - All animations MUST be paused by default and driven by `window.__timelines["main"].seek(timeInSeconds)`.
   - Never rely on wall-clock `setInterval` or uncontrolled CSS animations that cannot be scrubbed deterministically by `seek(t)`.

## 2. Deterministic Easing & Motion Rules

- **Slot-Machine Number Counter**: Interpolate promotional figures (e.g., `1,150만원 할인`, `월 46만원`) from `0` to the final value during `0.2s ~ 1.6s` using cubic/quartic ease-out (`1 - Math.pow(1 - p, 4)`).
- **Kinetic Stagger**: Stagger headline words and benefit badges by `0.18s` with elastic/back overshoot (`easeOutBack`).
- **3D Metallic Card Sheen**: During `8.0s ~ 12.0s`, sweep a specular highlight across the dealer's business card container while tilting the card in 3D space.

## 3. Workflow Steps

1. **Update or Generate Composition**:
   - Edit `public/index.html` or generate a standalone HyperFrames HTML composition containing `window.__timelines`.
2. **Stage for Dealer Approval**:
   - Generate a unique dealer token URL (`/v/:token`) so the dealer can scrub the timeline, inspect their 8~12s outro card, edit their phone/branch/caption if needed, and click **[승인 완료]**.
3. **Render & Publish**:
   - Use [hyperframes-renderer.js](../../hyperframes-renderer.js) to step through `frame = 0 .. totalFrames - 1`, call `window.__timelines["main"].seek(frame / fps)`, pipe frames to FFmpeg (`libx264 -pix_fmt yuv420p -r 60`), and publish via [instagram-api.js](../../instagram-api.js).
