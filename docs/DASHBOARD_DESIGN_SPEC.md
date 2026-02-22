# Real Estate Dashboard — Design Specification

> Complete specification for faithfully recreating the dashboard in Figma, Sketch, or any design tool.

---

## Table of Contents

1. [Canvas & Grid](#1-canvas--grid)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing & Sizing System](#4-spacing--sizing-system)
5. [Elevation & Shadow](#5-elevation--shadow)
6. [Iconography](#6-iconography)
7. [Components](#7-components)
   - [Top Navigation Bar](#71-top-navigation-bar)
   - [Left Sidebar](#72-left-sidebar)
   - [Hero Stats Card](#73-hero-stats-card)
   - [Sub-metric Cards](#74-sub-metric-cards)
   - [Revenue Chart Card](#75-revenue-chart-card)
   - [AI Promo Card](#76-ai-promo-card)
   - [Sales Statistic Card](#77-sales-statistic-card)
   - [Visit Statistic Card](#78-visit-statistic-card)
   - [New Visitors Card](#79-new-visitors-card)
   - [Listing Board](#710-listing-board)
8. [Layout Map](#8-layout-map)
9. [Asset Notes](#9-asset-notes)

---

## 1. Canvas & Grid

| Property | Value |
|---|---|
| Frame size | 1440 × 900 px (desktop) |
| Page background | `#F4F5F7` |
| Outer page padding | 24px all sides |
| Column layout | 2 columns: Left 66% / Right 34% |
| Column gap | 20px |
| Row gap (between cards) | 16px |

---

## 2. Color Palette

### Primary Colors

| Token | Name | Hex |
|---|---|---|
| `color-primary` | Forest Green | `#1A3C34` |
| `color-primary-light` | Mint Green | `#E8F5EF` |
| `color-accent-green` | Medium Green | `#4CAF82` |
| `color-accent-teal` | Soft Teal | `#5BC4C0` |
| `color-accent-orange` | Warm Orange | `#E07A3A` |
| `color-accent-blue` | Steel Blue | `#4A90A4` |
| `color-accent-yellow` | Yellow Green | `#D4E157` |

### Neutral Colors

| Token | Name | Hex |
|---|---|---|
| `color-bg-page` | Page Background | `#F4F5F7` |
| `color-bg-card` | Card White | `#FFFFFF` |
| `color-border` | Divider | `#E5E7EB` |
| `color-text-primary` | Near Black | `#1A1A1A` |
| `color-text-secondary` | Medium Gray | `#6B7280` |
| `color-text-caption` | Light Gray | `#9CA3AF` |
| `color-progress-track` | Progress BG | `#E0E0E0` |

### Semantic Colors

| Token | Usage | Hex |
|---|---|---|
| `color-positive` | Upward trend, success | `#4CAF82` |
| `color-negative` | Downward trend, warning | `#E07A3A` |
| `color-tooltip-bg` | Tooltip background | `#1F2937` |
| `color-tooltip-text` | Tooltip text | `#FFFFFF` |

---

## 3. Typography

### Font Family

```
Primary: Inter (fallback: Poppins, DM Sans, system-ui)
```

> All weights used: Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800)

### Type Scale

| Token | Usage | Size | Weight | Line Height | Color |
|---|---|---|---|---|---|
| `text-hero-value` | Hero stats (2,560 / 40.0%) | 34px | 800 | 1.1 | `#1A1A1A` |
| `text-card-value-lg` | Large card values ($24.9k, 12,480) | 26px | 700 | 1.2 | `#1A1A1A` |
| `text-card-value-md` | Medium card values (1250, $1,25,541) | 24px | 700 | 1.2 | `#1A1A1A` |
| `text-chart-value` | Chart metric values ($26,000) | 19px | 700 | 1.3 | `#1A1A1A` |
| `text-section-title` | Section headings | 16px | 600 | 1.4 | `#1A1A1A` |
| `text-nav-label` | Navigation tab text | 14px | 500 | 1.4 | `#374151` |
| `text-body` | Body / promo description | 13px | 400 | 1.6 | `#6B7280` |
| `text-label` | Field labels, stat labels | 12px | 400 | 1.4 | `#6B7280` |
| `text-caption` | Captions, axis labels, dates | 11px | 400 | 1.4 | `#9CA3AF` |
| `text-badge` | Percentage badges, tooltip | 12px | 500 | 1.3 | varies |
| `text-cta` | Button text | 13px | 600 | 1.4 | `#FFFFFF` |

---

## 4. Spacing & Sizing System

Base unit: **4px**

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps (icon to label) |
| `space-2` | 8px | Small gaps (between badges) |
| `space-3` | 12px | Inner card gaps |
| `space-4` | 16px | Card padding, row gaps |
| `space-5` | 20px | Column gaps, card padding |
| `space-6` | 24px | Page padding, section padding |
| `space-8` | 32px | Between metric groups |
| `space-10` | 40px | Large section separations |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Progress bars, small tags |
| `radius-md` | 8px | Tooltips, small badges |
| `radius-lg` | 12px | Listing property cards |
| `radius-xl` | 16px | All main cards |
| `radius-pill` | 20px | Navigation tabs, filter tabs, buttons, search bar |

---

## 5. Elevation & Shadow

| Token | CSS Value | Usage |
|---|---|---|
| `shadow-card` | `0 2px 8px rgba(0,0,0,0.06)` | All white cards |
| `shadow-tooltip` | `0 4px 12px rgba(0,0,0,0.15)` | Chart tooltip |
| `shadow-nav` | `0 1px 4px rgba(0,0,0,0.04)` | Top nav bar bottom shadow |

---

## 6. Iconography

| Property | Value |
|---|---|
| Style | Outlined / stroke icons |
| Size | 20–22px |
| Stroke weight | 1.5–2px |
| Inactive color | `#9CA3AF` |
| Active / highlighted | `#1A3C34` |
| Recommended library | Heroicons, Lucide, or Feather Icons |

---

## 7. Components

---

### 7.1 Top Navigation Bar

```
Height:          64px
Background:      #FFFFFF
Bottom border:   1px solid #E5E7EB
Horizontal pad:  24px
Shadow:          shadow-nav
```

#### Logo Area
```
Width:           60px (aligns with sidebar)
Content:         Circular brand icon, ~32px diameter
```

#### Navigation Tabs
```
Items:           Dashboard | Order | Property
Padding:         8px 16px
Border-radius:   radius-pill (20px)
Gap between:     8px

Active state:
  Background:    #1A3C34
  Text color:    #FFFFFF
  Font:          text-nav-label, weight 600

Inactive state:
  Background:    transparent
  Text color:    #374151
  Font:          text-nav-label, weight 500
```

#### Search Bar
```
Width:           300px
Height:          36px
Background:      #F4F5F7
Border:          1px solid #E5E7EB
Border-radius:   radius-pill (20px)
Padding:         8px 16px
Icon:            Search icon, left, 16px, #9CA3AF
Placeholder:     "Search here", color #9CA3AF
Position:        Horizontally centered in nav
```

#### Right Actions
```
Gap between items:  16px
Message icon:       20px, #9CA3AF
Bell icon:          20px, #9CA3AF
  Notification badge: 8px circle, #E07A3A, top-right of bell
Avatar:             36px diameter, circular clip, photo
Greeting text:      "Hello Angel", text-nav-label, #374151
```

---

### 7.2 Left Sidebar

```
Width:           64px
Height:          Full viewport height (minus nav)
Background:      #FFFFFF
Right border:    1px solid #E5E7EB
Padding top:     20px
```

#### Icons
```
Icon size:       22px
Vertical gap:    24px
Color (default): #9CA3AF
Color (active):  #1A3C34
Alignment:       Horizontally centered
Bottom icons:    2 icons pushed to bottom with flex spacer
```

---

### 7.3 Hero Stats Card

```
Width:           100% of left column
Height:          ~235px
Background:      #FFFFFF
Border-radius:   radius-xl (16px)
Padding:         24px
Shadow:          shadow-card
Overflow:        hidden (for image clip)
```

#### Stats Row (top-left of card)
```
Layout:          Horizontal, gap 40px

Stat item:
  Label:         text-caption, #9CA3AF, margin-bottom 4px
  Value:         text-hero-value (34px, weight 800), #1A1A1A
```

#### Property Image
```
Position:        Absolute or flex-end within card
Width:           ~55% of card width
Height:          ~100% of card height
Object-fit:      contain or cover
Alignment:       Right-center
Border-radius:   0 (bleeds to card edge) or subtle radius
```

#### Sub-metric Cards Row
```
Layout:          2 cards, side by side
Gap:             12px
Margin-top:      auto (pushed to bottom of hero card)
```

---

### 7.4 Sub-metric Cards

> These sit at the bottom of the Hero Stats Card.

```
Width:           ~48% each
Background:      #FFFFFF
Border:          1px solid #E5E7EB
Border-radius:   radius-lg (12px)
Padding:         12px 16px
```

#### Completed Deals Card
```
Icon:            Green checkmark circle, 24px, #4CAF82
Label:           "Completed Deals", text-label, #6B7280
Value:           "1250", text-card-value-md (24px, 700), #1A1A1A
Percentage:      "80%", text-badge, #9CA3AF, right-aligned
Progress bar:
  Height:        5px
  Border-radius: radius-sm (4px)
  Fill width:    80%
  Fill color:    #4CAF82
  Track color:   #E0E0E0
  Margin-top:    8px
```

#### Total Revenue Card
```
Icon:            Dollar circle, 24px, #5BC4C0
Label:           "Total Revenue", text-label, #6B7280
Value:           "$1,25,541", text-card-value-md (24px, 700), #1A1A1A
Percentage:      "34%", text-badge, #9CA3AF, right-aligned
Progress bar:
  Fill width:    34%
  Fill color:    #5BC4C0
  Track color:   #E0E0E0
```

---

### 7.5 Revenue Chart Card

```
Width:           100% of left column
Background:      #FFFFFF
Border-radius:   radius-xl (16px)
Padding:         24px
Shadow:          shadow-card
```

#### Card Header Row
```
Layout:          Space-between (title left, filters right)

Title block:
  Title:         "Revenue", text-section-title (16px, 600)
  Subtitle:      "Your Revenue This Year", text-caption, #9CA3AF
  Gap:           4px

Filter tabs:
  Items:         All | Income | Expenses | Profit
  Padding:       6px 14px
  Border-radius: radius-pill (20px)
  Gap:           6px

  Active tab:
    Background:  #1A3C34
    Text color:  #FFFFFF
    Font:        12px, weight 600

  Inactive tab:
    Background:  transparent
    Text color:  #9CA3AF
    Font:        12px, weight 500
```

#### Metrics Row
```
Layout:          3 columns, gap 40px
Margin:          16px 0

Metric item:
  Icon:          20px colored circle (left of label)
  Label:         text-caption (#9CA3AF)
  Value:         text-chart-value (19px, 700), #1A1A1A
  Badge row:     Percentage + arrow icon, 12px
    Up:          color #4CAF82, arrow ↑
    Down:        color #E07A3A, arrow ↓

  Income icon color:   #1A3C34 (dark green)
  Expenses icon color: #E07A3A (orange)
  Profit icon color:   #5BC4C0 (teal)
```

#### Line Chart
```
Height:          220px
X-axis labels:   Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
                 text-caption (11px), #9CA3AF
Y-axis labels:   $150 $300 $450 $600 $750 $900 $1.05k $1.2k
                 text-caption (11px), #9CA3AF
Grid lines:      Dashed, 1px, #E5E7EB, horizontal only

Lines:
  Income:        Color #2D6A4F, stroke 2.5px, smooth curve
  Expenses:      Color #E07A3A, stroke 2.5px, smooth curve
  Profit:        Color #5BC4C0, stroke 2.5px, smooth curve

Active point:    Filled circle, 6px diameter, matching line color
Vertical guide:  Dashed vertical line at active point, 1px, #9CA3AF
```

#### Tooltip (shown at active data point)
```
Background:      #1F2937
Border-radius:   radius-md (8px)
Padding:         10px 12px
Shadow:          shadow-tooltip
Width:           ~130px

Row layout (×3):
  Dot:           6px circle, matching line color
  Label:         12px, #9CA3AF (Income / Expenses / Profit)
  Value:         12px, 500, #FFFFFF, right-aligned
  Row gap:       6px
```

---

### 7.6 AI Promo Card

```
Width:           100% of right column
Background:      #E8F5EF
Border-radius:   radius-xl (16px)
Padding:         20px
Shadow:          shadow-card
Min-height:      ~200px
Overflow:        hidden
```

#### Content (left side)
```
Label:           "New AI Feature", 11px, 500, #4CAF82, margin-bottom 8px
Title:           "Leads and Property Search", 19px, 700, #1A1A1A, margin-bottom 8px
Body:            13px, 400, #6B7280, line-height 1.6, max-width ~55% of card
```

#### CTA Button
```
Text:            "Search Now"
Font:            text-cta (13px, 600, #FFFFFF)
Background:      #1A3C34
Border-radius:   radius-pill (20px)
Padding:         10px 20px
Margin-top:      16px
```

#### Decorative Graphic (right side)
```
Position:        Absolute, right side of card, vertically centered
Width:           ~45% of card
Content:         3–4 concentric arc lines (thin, ~1px, color #BEE3CC)
Avatars:         3 circular user photos, 40px diameter each
                 Positioned at different arc intersections
                 Border: 2px solid #FFFFFF
```

---

### 7.7 Sales Statistic Card

```
Width:           100% of right column
Background:      #FFFFFF
Border-radius:   radius-xl (16px)
Padding:         20px
Shadow:          shadow-card
```

#### Layout
```
Left icon:       Chart/analytics icon, 32×32px, color #9CA3AF
                 Background: #F4F5F7, border-radius radius-md (8px)
                 Margin-right: 16px

Right content:
  Row 1:
    Left block:
      Label:     "Total Profit", text-caption, #9CA3AF
      Value:     "$24.9k", text-card-value-lg (26px, 700), #1A1A1A
    Right block:
      Label:     "Visitors", text-caption, #9CA3AF
      Value:     "$24k", 14px, 600, #1A1A1A
      Dot:       6px, #4CAF82, inline before value

  Progress bar:
    Height:      5px
    Fill:        ~65%, color #4CAF82
    Track:       #E0E0E0
    Border-radius: radius-sm (4px)
    Margin-top:  10px
```

---

### 7.8 Visit Statistic Card

```
Width:           100% of right column
Background:      #FFFFFF
Border-radius:   radius-xl (16px)
Padding:         20px
Shadow:          shadow-card
```

#### Layout
```
Title:           "Visit Statistic", text-section-title (16px, 600), #1A1A1A

Content row (2 columns):
  Left column:
    Day labels:  "Sat  Sun  Mon", text-caption, #9CA3AF
                 Horizontal, gap 16px, margin-bottom 6px
    Sparkline:   Wavy line chart, height ~40px, width ~120px
                 Color: #D4E157 (yellow-green)
                 Stroke: 2px, no fill, smooth wave

  Right column:
    Label:       "Rate", text-caption, #9CA3AF
    Value:       "32.43%", 19px, 700, #1A1A1A
    Sparkline:   Wavy line chart, height ~40px
                 Color: #5BC4C0 (teal/mint)
                 Stroke: 2px, no fill
```

---

### 7.9 New Visitors Card

```
Width:           100% of right column
Background:      #FFFFFF
Border-radius:   radius-xl (16px)
Padding:         20px
Shadow:          shadow-card
```

#### Layout
```
Header row:
  Title:         "New Visitors", text-section-title (16px, 600), #1A1A1A
  Badge:         "$2.2k", 11px, 500, #FFFFFF
                 Background: #1A3C34, border-radius radius-md (8px)
                 Padding: 2px 8px
                 Position: top-right, above highlighted bar

Body:
  Subtitle:      "48% new visitors this week.", text-caption, #9CA3AF
  Value:         "12,480", text-card-value-lg (26px, 700), #1A1A1A
  Change badge:  "▲ 28", 12px, 500, #4CAF82, inline after value
  Margin-bottom: 12px
```

#### Bar Chart
```
Height:          70px
Bars:            6 bars (Jul Aug Sep Oct Nov Dec)
Bar width:       16px
Bar gap:         8px
Bar radius:      4px top corners only
Default bar:     #E0E0E0 (light gray)
Highlighted bar: #4A90A4 (steel blue) — December
X-axis labels:   text-caption (11px), #9CA3AF, below each bar
```

---

### 7.10 Listing Board

```
Width:           Full width (spans both columns)
Margin-top:      20px
```

#### Section Header
```
Layout:          Space-between
Title:           "Listing Board", text-section-title (16px, 600), #1A1A1A
Dropdown:        "Recent listed ▾", 13px, 500, #6B7280
                 No background, no border (or light 1px border)
                 Border-radius: radius-sm
```

#### Property Cards Row
```
Layout:          Horizontal flex, gap 12px
Card count:      5 visible cards
Each card:
  Width:         ~18% of total width (flex: 1)
  Border-radius: radius-lg (12px)
  Shadow:        shadow-card
  Background:    #FFFFFF
  Overflow:      hidden

  Image:
    Height:      110px
    Width:       100%
    Object-fit:  cover
    Border-radius: radius-lg radius-lg 0 0 (top only)
```

---

## 8. Layout Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOP NAVIGATION BAR (64px)                   │
├────────┬────────────────────────────────────┬───────────────────┤
│        │   HERO STATS CARD                  │  AI PROMO CARD    │
│        │   (with property image)            │  (mint green)     │
│  LEFT  │   ┌──────────────┬─────────────┐  │                   │
│  SIDE  │   │ Completed    │ Total       │  ├───────────────────┤
│  BAR   │   │ Deals        │ Revenue     │  │  SALES STATISTIC  │
│ (64px) │   └──────────────┴─────────────┘  ├───────────────────┤
│        ├────────────────────────────────────┤  VISIT STATISTIC  │
│        │   REVENUE CHART CARD               ├───────────────────┤
│        │   (line chart, full width left)    │  NEW VISITORS     │
│        │                                    │  (bar chart)      │
├────────┴────────────────────────────────────┴───────────────────┤
│            LISTING BOARD (full width, 5 property cards)         │
└─────────────────────────────────────────────────────────────────┘
```

### Column Widths (approximate px at 1440px canvas)
```
Sidebar:          64px
Main content gap: 24px (page padding left)
Left column:      ~860px  (66% of content area)
Column gap:       20px
Right column:     ~432px  (34% of content area)
Page padding right: 24px
```

---

## 9. Asset Notes

| Asset | Description |
|---|---|
| Property hero image | Photorealistic modern luxury house (white, glass facade, 3-story), PNG with transparent or white bg |
| User avatars (promo) | 3 circular user photos, ~40px, placed on concentric arc decorative graphic |
| User avatar (nav) | Real person photo or placeholder avatar, 36px circle |
| Concentric arcs graphic | SVG illustration of 3–4 thin arcs, light green lines, no fill |
| Chart lines | Rendered via charting library (e.g., Recharts, Chart.js) or drawn as SVG paths in design tool |

---

## Design Tool Setup Checklist

- [ ] Set canvas to **1440 × 900px**
- [ ] Add background rectangle `#F4F5F7`, fills full canvas
- [ ] Install **Inter** font family (all weights 400–800)
- [ ] Create color styles from [Section 2](#2-color-palette)
- [ ] Create text styles from [Section 3](#3-typography)
- [ ] Create shared shadow effects from [Section 5](#5-elevation--shadow)
- [ ] Build sidebar and nav as fixed-width frames
- [ ] Build right column cards as individual auto-layout frames
- [ ] Build left column with hero + revenue chart stacked vertically
- [ ] Add listing board as a full-width row at the bottom
- [ ] Use auto-layout with 16–20px gaps throughout for responsiveness

---

*Specification generated from visual reference — February 2026*
