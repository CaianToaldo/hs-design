# Design System Inspired by HS Marketing

> Category: Agency & Marketing
> Bold orange-and-black agency system. Confident display type, high-contrast
> surfaces, single warm accent. Placeholder white-label brand for HS Marketing —
> swap the orange and font for the official brand assets when available.

## 1. Visual Theme & Atmosphere

HS Marketing's identity is built on a single decisive contrast: warm orange
against near-black. The system feels like a modern creative agency deck — lots
of confident negative space, oversized headlines, and one unmistakable accent
that signals action. Backgrounds alternate between a clean white canvas
(`#FFFFFF`) for content-dense surfaces and a deep ink black (`#111111`) for hero
moments, footers, and statement sections. The orange (`#F26522`) is used
sparingly and deliberately: primary CTAs, active states, key metrics, and the
occasional underline or marker that draws the eye.

The personality is **professional, direct, and results-oriented**. Nothing is
decorative for its own sake — every accent earns its place. Headlines carry the
brand; body copy stays quiet and highly legible. The black-on-white / white-on-
black inversion is the signature move: a section can flip to the dark surface to
mark a shift in rhythm without introducing a second color.

**Key Characteristics:**
- Single warm accent — HS Orange (`#F26522`) — reserved for primary actions and emphasis
- High-contrast inversion: white canvas content surfaces flipping to ink-black statement sections
- Oversized, confident display headlines paired with calm, legible body text
- Generous whitespace; layouts breathe rather than crowd
- Sharp, minimal geometry — small radii (6–8px), thin 1px borders
- Orange used as a "marker" (underlines, dots, short rules) as much as a fill

## 2. Color Palette & Roles

### Primary
- **HS Orange** (`#F26522`): The brand's signature warm orange. Used for primary CTA buttons, active tab indicators, link hovers, key metric numbers, and accent markers. The single highest-visibility color on any surface — keep it scarce.

### Secondary & Accent
- **Orange Deep** (`#D4501A`): Pressed/active state of the primary orange; gradient terminal stop.
- **Orange Tint** (`#FDEEE4`): Soft orange wash for highlighted cards, callout backgrounds, and selected rows on white surfaces.

### Surface & Background
- **Canvas White** (`#FFFFFF`): Default page background for content-dense surfaces.
- **Ink Black** (`#111111`): Statement surface — hero sections, footers, dark cards. White and orange sit on top of it.
- **Off-White** (`#F6F5F3`): Subtle subsurface tint for secondary panels and alternating sections.

### Neutrals & Text
- **Text Strong** (`#111111`): Headings and primary body copy on light surfaces.
- **Text Muted** (`#5A5A5A`): Secondary labels, captions, supporting copy.
- **Border Hairline** (`#E4E2DE`): 1px dividers between cards, rows, and sections.
- **On-Dark Text** (`#F6F5F3`): Primary text color on the ink-black surface.
- **On-Dark Muted** (`#A9A6A1`): Secondary text on dark surfaces.

### Semantic
- **Success** (`#1F9D55`): Confirmations, positive metrics.
- **Error** (`#D92D20`): Form validation, destructive actions.
- **Warning** (`#E0A800`): Cautionary states.

### Gradient System
A narrow orange sweep, used only as a branded moment (button hover, wordmark accent), never as a full surface:

```
linear-gradient(90deg, #F26522 0%, #D4501A 100%)
```

## 3. Typography Rules

### Font Family
- **Inter** (primary): A free, highly-legible variable sans-serif. Fallbacks: `-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

Display headlines lean on the 700–800 weights for confident, magazine-grade
headers; body copy runs at 400–500 for calm readability. Tracking compresses
slightly on large display sizes and stays at 0 for body.

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display | 56px / 3.5rem | 800 | 1.05 | -1.0px | Hero statement headlines |
| H1 | 40px / 2.5rem | 700 | 1.1 | -0.6px | Page titles |
| H2 | 30px / 1.88rem | 700 | 1.2 | -0.4px | Section headings |
| H3 | 22px / 1.38rem | 600 | 1.3 | -0.2px | Card titles, subsections |
| Body Large | 18px / 1.13rem | 400 | 1.6 | 0 | Intro paragraphs |
| Body | 16px / 1.00rem | 400 | 1.6 | 0 | Default body copy |
| Button | 15px / 0.94rem | 600 | 1.2 | 0.2px | CTA and button labels |
| Caption | 14px / 0.88rem | 500 | 1.4 | 0 | Metadata, supporting labels |
| Overline | 12px / 0.75rem | 700 | 1.3 | 1.2px | Uppercase kickers above headings |

### Principles
- **One family, weight-driven hierarchy.** Inter handles everything; contrast comes from weight, not from mixing typefaces.
- **Negative tracking on display only.** Sizes ≥22px compress tracking; body stays at 0 for readability.
- **Uppercase only for the overline kicker.** A 12px 700 uppercase label with wide tracking precedes major headings; nowhere else.
- **Tight headlines, open body.** Display runs at 1.05–1.2; body opens to 1.6.

## 4. Component Stylings

### Buttons

**Primary CTA**
- Background: HS Orange `#F26522`
- Text: White `#FFFFFF`, Inter 600, 15px
- Padding: 12px vertical, 24px horizontal
- Radius: 8px
- Hover: background shifts to Orange Deep `#D4501A`
- Active: `transform: scale(0.98)`; 2px focus ring `0 0 0 2px rgba(242,101,34,0.4)`

**Secondary Button**
- Background: transparent
- Text: Ink Black `#111111`, Inter 600, 15px
- Border: 1px solid Border Hairline `#E4E2DE`
- Radius: 8px
- Hover: border switches to HS Orange, text to HS Orange

**Button on Dark Surface**
- Background: White `#FFFFFF`, text Ink Black `#111111`; OR ghost: transparent with 1px `#A9A6A1` border and On-Dark text

### Cards & Containers

**Content Card**
- Background: White `#FFFFFF`
- Border: 1px solid Border Hairline `#E4E2DE`
- Radius: 8px
- Padding: 24px
- Shadow: none at rest; `rgba(17,17,17,0.06) 0 4px 16px` on hover

**Highlight Card**
- Background: Orange Tint `#FDEEE4`
- Border: none; or 1px `#F26522` at 24% opacity
- Radius: 8px
- Used to call out a featured plan, metric, or quote

**Dark Statement Card**
- Background: Ink Black `#111111`
- Text: On-Dark `#F6F5F3`; accent numbers/labels in HS Orange
- Radius: 8px
- Padding: 32px

### Inputs & Forms

**Text Input**
- Background: White `#FFFFFF`
- Border: 1px solid Border Hairline `#E4E2DE`
- Radius: 6px
- Padding: 10px 14px
- Focus: border switches to HS Orange `#F26522`, 2px outer ring `rgba(242,101,34,0.2)`
- Error: border `#D92D20`, helper text same color

### Navigation

**Top Nav**
- Height: ~72px
- Background: White `#FFFFFF` (or Ink Black on dark pages)
- Left: HS wordmark; Right: text links + a primary orange CTA
- Active link: HS Orange text with a 2px orange underline
- Border-bottom: 1px solid Border Hairline `#E4E2DE`

### Image Treatment
- Primary aspect ratios: 16:9 for hero/banners, 4:3 for cards, 1:1 for avatars
- Radius: 8px on content imagery, `50%` on avatars
- Treatment: full-bleed photography; optional ink-black duotone for brand consistency on hero images

## 5. Layout Principles

### Spacing System
- **Base unit**: 8px
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- **Section padding**: 64–96px top/bottom desktop, 32–48px mobile
- **Card internal padding**: 24–32px
- **Between stacked text rows**: 8–12px

### Grid & Container
- **Max content width**: 1200px standard; 1320px for wide marketing layouts
- **Columns**: 12-column grid, 24px gutters
- **Hero**: asymmetric — ~60% headline/copy, ~40% imagery or CTA panel

### Whitespace Philosophy
Whitespace groups and signals confidence. Headlines get room to land; the
orange accent stays scarce so it never competes with itself. Dark statement
sections use even more padding to feel deliberate.

### Border Radius Scale
| Radius | Use |
|--------|-----|
| 6px | Inputs, chips, small controls |
| 8px | Buttons, cards, containers, imagery |
| 50% | Avatars, circular icon buttons |

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | No shadow | Body content, cards at rest, dark statement sections |
| 1 | `rgba(17,17,17,0.06) 0 4px 16px` | Card hover, dropdowns |
| 2 | `rgba(17,17,17,0.10) 0 8px 28px` | Modals, popovers, sticky CTA panels |
| Focus Ring | `0 0 0 2px rgba(242,101,34,0.4)` | Focused buttons and inputs |

Shadow philosophy: depth is subtle and warm-neutral (black-based, low opacity).
Contrast and the orange accent do the heavy lifting, not heavy shadows.

## 7. Do's and Don'ts

### Do
- Reserve HS Orange `#F26522` for primary actions, active states, and key emphasis — keep it scarce.
- Use the white ↔ ink-black inversion to mark rhythm shifts instead of adding a second accent color.
- Let headlines be large and confident; keep body copy calm at 400–500 weight.
- Use 1px Border Hairline `#E4E2DE` for dividers on light surfaces.
- Use the orange as a "marker" (short underline, dot, rule) as well as a fill.

### Don't
- Don't introduce a second accent color outside the orange family.
- Don't fill large surfaces with orange — it is an accent, not a background.
- Don't use all-caps except the 12px overline kicker.
- Don't add heavy or colored drop shadows — keep elevation subtle and black-based.
- Don't mix display typefaces; Inter (or the official HS font) carries the system.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | ≥1200px | Full 12-column grid, 1200–1320px max width |
| Laptop | 1024–1199px | Grid narrows, nav stays horizontal |
| Tablet | 768–1023px | 2-column content, hero stacks |
| Mobile | 375–767px | Single-column stack, full-width CTAs, hamburger nav |
| Small mobile | <375px | Edge padding tightens to 16px |

### Touch Targets
All interactive elements meet or exceed 44×44px. Primary CTA buttons are ~48px tall on mobile.

### Collapsing Strategy
- **Nav**: horizontal links collapse to a hamburger drawer on <768px; the primary orange CTA persists.
- **Hero**: asymmetric two-column layout stacks to single column, headline first.
- **Cards**: reflow 3 → 2 → 1 columns across breakpoints.
- **Dark statement sections**: keep generous padding; reduce display size one step on mobile.

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA / accent: "HS Orange (#F26522)"
- Page background: "Canvas White (#FFFFFF)"
- Statement surface: "Ink Black (#111111)"
- Subsurface: "Off-White (#F6F5F3)"
- Heading / body text: "Text Strong (#111111)"
- Secondary text: "Text Muted (#5A5A5A)"
- Border / divider: "Border Hairline (#E4E2DE)"
- Highlight wash: "Orange Tint (#FDEEE4)"
- Error: "Error (#D92D20)"
- Success: "Success (#1F9D55)"

### Example Component Prompts
- "Create a primary CTA button: HS Orange (#F26522) background, white Inter 600 label at 15px, 12px × 24px padding, 8px radius. On hover shift to Orange Deep (#D4501A); on focus add a 2px `rgba(242,101,34,0.4)` ring."
- "Build a hero: ink-black (#111111) full-bleed section, white Inter 800 display headline at 56px with -1px tracking, a muted (#A9A6A1) subhead, and a single HS Orange CTA. Keep orange to that one button."
- "Design a content card: white background, 1px Border Hairline (#E4E2DE), 8px radius, 24px padding, no shadow at rest, subtle `rgba(17,17,17,0.06) 0 4px 16px` on hover. Title in Inter 600 22px Text Strong, body in 16px 400 Text Muted."
- "Create a stats strip on ink-black: three metrics, each a 40px 700 HS Orange number above a 14px 500 On-Dark-Muted label, separated by thin `#A9A6A1` vertical rules."

### Iteration Guide
When refining screens generated with this system:
1. Focus on ONE component at a time.
2. Reference exact color names and hex codes (e.g., "HS Orange #F26522", not "orange").
3. Keep the orange scarce — if more than one orange element appears per viewport, consider neutralizing one.
4. Use the white ↔ ink-black inversion to create rhythm rather than adding colors.
5. Default to Inter; 700–800 for display, 400–500 for body.

### Known Gaps
- **Placeholder brand**: HS Orange (`#F26522`), Inter, and ink-black are stand-ins for the official HS Marketing palette and typeface. Replace with the real brand guide values when provided — update this file and the `--accent` default in `apps/web/src/state/appearance.ts` together.
- **Logo**: no official HS wordmark/icon is bundled yet; the UI currently uses the text brand label "HS Design".
- **Motion**: animation timings are not specified; default to fast, subtle ease-out transitions (150–250ms).
