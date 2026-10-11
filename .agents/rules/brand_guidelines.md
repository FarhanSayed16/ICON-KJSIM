# Mandatory Typography & Brand Palette Guidelines

These guidelines are **MANDATORY** and must be strictly followed across the entire **ICON 2026 — DATATRON** project (all pages, components, modules, and styles).

---

## 1. Typography Rules

### Primary Font — Serif Typeface
- **Font**: `Marcellus` (Marcellus - Regular)
- **Role**: Headlines, section headings (`h1` - `h6`), card titles, hero displays, tab titles, modal titles.
- **CSS Variable**: `var(--font-marcellus)`
- **CSS Declaration**:
  ```css
  font-family: var(--font-marcellus), 'Marcellus', Georgia, serif;
  font-weight: 400; /* Marcellus comes in a single weight */
  ```
- **Rule**: Never use sans-serif fonts for section headings, event titles, or primary display titles.

### Secondary Font — Sans-Serif Typeface
- **Font**: `Fira Sans`
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)
- **Role**: Body copy, paragraphs, button labels, navigation links, form inputs, metadata, badges, numbers, counters, micro-instructions.
- **CSS Variable**: `var(--font-fira-sans)`
- **CSS Declaration**:
  ```css
  font-family: var(--font-fira-sans), 'Fira Sans', -apple-system, sans-serif;
  ```

---

## 2. Compulsory Brand Color Palette (Somaiya / KJSIM)

| Token Name | Color Name | PMS Code | CMYK | RGB | Hex Code | Primary Role |
|---|---|---|---|---|---|---|
| `--power-red` | **Power Red** | PMS 186 C | 20, 100, 90, 10 | 183, 32, 46 | `#B7202E` | Active tabs, primary CTAs, key accent lines, primary badges |
| `--vitality-red` | **Vitality Red** | PMS 2347 C | 0, 100, 100, 0 | 237, 28, 36 | `#ED1C24` | Hover states, active indicator dots, highlights, live pills |
| `--pantone-cool-gray` | **Pantone Cool Gray** | PMS 10 C | 0, 0, 0, 80 | 88, 89, 91 | `#58595B` | Secondary body text, descriptions, subtle borders, metadata |
| `--pantone-dark-gray` | **Pantone Dark Gray** | PMS 10 C | 0, 0, 0, 100 | 35, 31, 32 | `#231F20` | Headings, primary text, dark card banners, dark buttons |
| `--pantone-white` | **White** | PMS White | 0, 0, 0, 0 | 255, 255, 255 | `#FFFFFF` | Backgrounds, card surfaces, clean contrast elements |

---

## 3. Enforcement Strategy in Codebase
1. **Root Layout** (`src/app/layout.js`):
   - Injects `Marcellus` (`--font-marcellus`) and `Fira_Sans` (`--font-fira-sans`) into `<html>`.
   - Sets `body` default font to `var(--font-fira-sans), sans-serif`.
2. **Global CSS** (`src/app/globals.css`):
   - Defines `--font-marcellus` and `--font-fira-sans`.
   - Maps `--font-primary` and all headings (`h1`–`h6`, `.section-heading h2`, `[class*="title"]`) to `var(--font-marcellus)`.
   - Maps body, paragraphs, buttons, and inputs to `var(--font-fira-sans)`.
   - Overrides legacy font tokens (`--font-outfit` -> `var(--font-marcellus)`, `--font-inter` & `--font-space` -> `var(--font-fira-sans)`).
3. **Tailwind CSS & Utility Classes** (`src/app/globals.css`):
   - `@theme` defines `--color-power-red`, `--color-vitality-red`, `--color-pantone-cool-gray`, `--color-pantone-dark-gray`, `--color-pantone-white`.
   - Dedicated Somaiya brand classes:
     - `.somaiya-power-red` / `.text-power-red`, `.bg-somaiya-power-red` / `.bg-power-red`, `.border-somaiya-power-red` / `.border-power-red`
     - `.somaiya-vitality-red` / `.text-vitality-red`, `.bg-somaiya-vitality-red` / `.bg-vitality-red`, `.border-somaiya-vitality-red` / `.border-vitality-red`
     - `.somaiya-cool-gray` / `.text-somaiya-gray`, `.somaiya-dark-gray` / `.text-somaiya-dark`, `.bg-somaiya-dark`

