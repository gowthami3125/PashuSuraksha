# PashuSuraksha — Master Build Specification

## 0. Rules for the AI Agent
- Senior full-stack engineer & UX designer guidelines.
- Never invent data. All demo or simulated data must be stored with `is_simulated = true` and shown with a small "Sample data" badge.
- Never claim "real-time", "official", "ICAR-NIVEDI data" unless true and cited.
- Never mention SIH, hackathon, or problem statement numbers anywhere.
- No national emblem. No "Government of ..." branding.
- Footer note: advice supports, and does not replace, a veterinarian.
- Beginner-friendly errors and clear user guidance.

## 9. Design System (Dark Blue & White Theme)
- **Dominant Colour**: White (`#FFFFFF`). Navy is used for header, footer, hero band, and main buttons only.
- **Navy (Primary)**: `#0F2F5C`, hover `#0B2447`.
- **Header and Footer**: `#0B2447` with white text.
- **Page & Card Background**: `#FFFFFF`.
- **Section Background**: `#F3F4F6` (neutral grey, NOT blue-tinted).
- **Text**: `#111827`, muted text `#4B5563`.
- **Borders**: `#D1D5DB` (1px neutral grey).
- **Accent**: `#E07B00` (used strictly for thin top strip, active tab indicator/underline, focus ring).
- **Risk Colours** (ONLY for risk):
  - Low Risk: `#15803D` badge with white text + icon + label.
  - Medium Risk: `#D97706` badge with dark text (`#111827`) + icon + label.
  - High Risk: `#DC2626` badge with white text + icon + label.
- **Typography**: Noto Sans (with Noto Sans Devanagari and Telugu).
- **Flat UI Elements**: 1px grey border (`#D1D5DB`), small radius (6-8px / `rounded-lg`), no heavy shadows, no gradients, no neon, no glow, no glass/blur effects.

## 16. Code Quality & Maintenance
- Clean, readable, well-commented code.
- Strict WCAG AA contrast compliance.
- All secrets and API configurations in environment variables (`.env`).
