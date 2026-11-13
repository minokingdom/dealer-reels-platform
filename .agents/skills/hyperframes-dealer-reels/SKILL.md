---
name: hyperframes-dealer-reels
description: >-
  Creates deterministic 9:16 Instagram Reels and short-form promotional videos for AutoReels' 10 supported industries (car sales, restaurant, cafe, beauty, real estate, academy, clinic, fitness, shop, interior) using the HyperFrames architecture (HTML/CSS, seekable timelines on window.__timelines, showcase camera moves, kinetic typography, and personalized outro cards — a personal business card for car sales, a store info card for other industries). Use this skill whenever the user asks to generate, edit, or automate industry promotion short-form videos, AutoReels compositions, or HyperFrames compositions. (The skill keeps its original "dealer-reels" name for compatibility.)
---

# HyperFrames Industry Promo Reels Skill (AutoReels)

This skill defines the standard architecture and workflow for generating programmatic 9:16 (1080x1920, 60fps) promotional Reels for every AutoReels industry using the **HyperFrames** deterministic timeline specification.

AutoReels started as a car-dealer product and now supports 10 industries. Always read the selected industry profile before writing copy or choosing visuals.

## 0. Industry Profiles

Industry profiles live in `public/index.html` (objects keyed by industry with `key`, `name`, `role`, `outroMode`, `product`, `cta`, `place`, labels/placeholders, `hashtags`, `aiRole`). The server-side allow list is `INDUSTRY_KEYS` in `api/account.js`. Scene photos live in `public/assets/scenes/<key>/1.jpg ~ 10.jpg`.

| key | Industry | Role | Outro |
| --- | --- | --- | --- |
| `auto` | 자동차 영업 | 카마스터 | personal business card |
| `restaurant` | 음식점 | 사장님 | store card |
| `cafe` | 카페·디저트 | 사장님 | store card |
| `beauty` | 미용·네일·뷰티 | 원장님 | store card |
| `realestate` | 부동산 중개 | 공인중개사 | store card |
| `academy` | 학원·교육 | 원장님 | store card |
| `clinic` | 병원·의원 | 원장님 | store card |
| `fitness` | 헬스·필라테스 | 트레이너 | store card |
| `shop` | 쇼핑몰·소매 | 스토어 | store card |
| `interior` | 인테리어·시공 | 실장님 | store card |

Rules:
- Use the profile's vocabulary (`product`, `cta`, `place`, `role`) instead of car terms. Never put vehicle, discount-financing or showroom wording into a non-`auto` composition.
- Use only the selected industry's scene photos; do not mix photos across industries.
- When the profile has a `caution` text (e.g. `realestate`, `academy`, `clinic`), follow it: no exaggerated or guaranteed-result claims, and include legally required disclosures.
- Legacy field names (`vehicle`, `discount`, `dealer`, `clip-dealer-outro`) are kept for compatibility; treat them as generic "product / offer / user / outro".

## 1. HyperFrames Scene Specification

Every composition MUST adhere to the deterministic seeking model so both the review preview page and the headless frame-by-frame MP4 encoder produce 100% pixel-identical output:

1. **Clip Containers (`data-start`, `data-duration`, `data-track-index`)**:
   - **Scene 1 (`0.0s ~ 3.0s`) — Impact Hook & Key Number Counter**:
     - `<div id="clip-hook" class="clip" data-start="0" data-duration="3" data-track-index="0">`
     - Kinetic typography hook headline + rapidly counting key figure (discount, price, event benefit, etc.; `0` -> target with `power4.out` easing).
   - **Scene 2 (`3.0s ~ 8.0s`) — Product / Space Showcase & Benefits**:
     - `<div id="clip-showcase" class="clip" data-start="3" data-duration="5" data-track-index="0">`
     - Ken Burns / 3D tilt camera movement over the industry's scene photos (vehicle, menu, interior, treatment, listing, class, etc.), plus staggered benefit cards.
   - **Persistent Overlay (`0.0s ~ 8.0s`) — Lower-Third Bar**:
     - `<div id="clip-lower-third" class="clip" data-start="0" data-duration="8" data-track-index="1">`
     - Displays `[Branch or Store | Name & Role | Phone Number]` at the bottom of the promo section.
   - **Scene 3 (`8.0s ~ 12.0s`) — Personalized Outro Card**:
     - `<div id="clip-dealer-outro" class="clip" data-start="8" data-duration="4" data-track-index="0">`
     - `auto`: 3D flip into the personal business card (profile photo, branch, name, large phone CTA, gift package, QR code).
     - `outroMode: 'store'`: store info card (store name, subtitle, location/parking, visitor benefit, CTA such as 예약/상담, QR code).

2. **Global Timeline Registration (`window.__timelines`)**:
   - All animations MUST be paused by default and driven by `window.__timelines["main"].seek(timeInSeconds)`.
   - Never rely on wall-clock `setInterval` or uncontrolled CSS animations that cannot be scrubbed deterministically by `seek(t)`.

## 2. Deterministic Easing & Motion Rules

- **Slot-Machine Number Counter**: Interpolate promotional figures (e.g., `1,150만원 할인`, `첫 방문 30% 할인`, `월 46만원`) from `0` to the final value during `0.2s ~ 1.6s` using cubic/quartic ease-out (`1 - Math.pow(1 - p, 4)`).
- **Kinetic Stagger**: Stagger headline words and benefit badges by `0.18s` with elastic/back overshoot (`easeOutBack`).
- **Outro Card Sheen**: During `8.0s ~ 12.0s`, sweep a specular highlight across the outro card container while tilting the card in 3D space.

## 3. Workflow Steps

1. **Pick the Industry Profile**:
   - Read the selected industry's profile and scene photo folder before writing captions, TTS lines or hashtags.
2. **Update or Generate Composition**:
   - Edit `public/index.html` or generate a standalone HyperFrames HTML composition containing `window.__timelines`.
3. **Stage for User Approval**:
   - Let the user (car master, owner, director, trainer, etc.) scrub the timeline, inspect their 8~12s outro card, edit phone/branch/store/caption if needed, and click **[승인 완료]**.
4. **Render & Publish**:
   - Use [hyperframes-renderer.js](../../hyperframes-renderer.js) to step through `frame = 0 .. totalFrames - 1`, call `window.__timelines["main"].seek(frame / fps)`, and pipe frames to FFmpeg (`libx264 -pix_fmt yuv420p -r 60`).
   - Publish through the multi-SNS API (`api/sns.js`, `lib/server/sns.js`): Instagram, Facebook, YouTube, TikTok and Threads, immediately or as a scheduled post. `instagram-api.js` is the legacy Instagram-only module.
