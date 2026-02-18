# 📋 Project Context: AI Asset Library

> Last Updated: 2023-10-27
> Stage: MVP

---

## 🎯 Overview

**Problem:** Small businesses and marketing teams struggle to create high-quality, consistent AI prompts for various use cases (planning, images, content conversion), leading to wasted time and poor results.
**Target User:** SME Owners, Marketing Teams, Content Creators.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite/CRA), TailwindCSS, Lucide React, Recharts |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions implied) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | Vercel (Likely/Standard for this stack) |
| APIs / Integrations | LINE API, Stripe (Planned), OpenAI/Claude (Planned) |
| Automation | N/A (Manual prompt generation logic currently implemented) |

---

## 🎨 Design System

| Element | Detail |
|---|---|
| UI Library | TailwindCSS (Custom Components) |
| Primary Color | Orange `#F27405` (Action), Deep Navy `#012840` (Bg), Turquoise `#05F2F2` (Accent) |
| Font | Noto Sans Thai |
| Design Reference | N/A |

---

## 📊 Current Status

### ✅ Completed
- **Core Asset Library:** Asset browsing, filtering, and detail views.
- **Prompt Generation Logic:** Template-based variable substitution.
- **User Authentication:** Supabase Auth (Sign up/Login).
- **Favorites System:** Saving and organizing prompts into folders.
- **Team & Workshop:** Basic team dashboard, workshop creation, and live status.
- **Fine-Tune Studio:** Creating custom prompt templates with controls.
- **Marketplace:** Viewing and filtering listings (Mock data).
- **Admin Dashboard:** Basic analytics visualization.

### 🔄 In Progress
- **AI Integration:** Connecting real OpenAI/Claude APIs (currently mocked with `setTimeout`).
- **Payment Integration:** Stripe integration for subscription tiers.
- **White-Labeling:** Tenant configuration and custom branding application.
- **Integrations:** Real connection to LINE OA and other platforms.

### 🎯 Next Priorities
1. **AI Model Connection:** Replace mock generation with actual LLM calls.
2. **Payment Gateway:** Implement real checkout flow.
3. **Advanced RAG:** Implement vector storage for the "Product File to RAG" feature.

### 🐛 Known Issues / Blockers
- **Mock Data:** Most analytics, marketplace listings, and generation results are hardcoded mocks.
- **Mobile Responsiveness:** Some complex tables or dashboards need further optimization for small screens.

---

## 📌 Notes for AI Assistant

- This is a **MVP** product targeting **SME Owners**.
- When generating code, use **React + TailwindCSS + Supabase**.
- Follow the existing **dark mode aesthetic** (`bg-[#012840]`, text white).
- All new features should align with the `types.ts` and `supabase.ts` structure provided.
- Ensure all interactive elements have proper loading states and error handling.
`
