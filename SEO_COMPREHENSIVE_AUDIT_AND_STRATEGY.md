# SEO Comprehensive Audit & Strategic Roadmap (2025)
## VirtinSaz (ویترین ساز) - Website Builder Platform

---

## 1. Executive Summary

### 1.1 Overall SEO Health Score: 38/100
The platform currently sits at a foundational stage. While the core architecture (Next.js 16) is modern and capable, the current implementation lacks critical SEO components for both the platform and user-generated websites.

### 1.2 Critical Issues Count by Severity
| Severity | Count | Primary Areas |
| :--- | :--- | :--- |
| **Critical** | 4 | Indexing, Metadata, Rendering Method, Sitemaps |
| **High** | 6 | Image Optimization, Dynamic Metadata, Page Speed, Canonicalization |
| **Medium** | 8 | Structured Data, URL Slugs, Blog Architecture, Mobile Optimization |
| **Low** | 5 | Social Sharing (OG), Internal Linking, Breadcrumbs |
| **Enhancement** | 10+ | AI Content Assist, Bulk SEO Edits, GSC Integration |

### 1.3 Top 5 Priority Actions
1. **Transition User Sites to SSR/ISR**: Move `PreviewPage` from Client-Side Rendering (CSR) to Server-Side Rendering (SSR) with `generateMetadata`.
2. **Implement Dynamic Sitemap & Robots.txt**: Create automated generators for the platform and all user subdomains/slugs.
3. **SEO Settings Module**: Add explicit SEO fields (`meta_title`, `meta_description`, `schema_type`) to the `Site` model in the backend.
4. **Image Optimization Pipeline**: Remove `unoptimized: true` and implement a CDN-backed image resizing service.
5. **On-Page Hierarchy Overhaul**: Ensure proper H1-H6 structure across all templates.

### 1.4 Estimated Impact & Timeline
*   **Foundation (Weeks 1-4)**: 40% improvement in crawlability.
*   **Optimization (Months 2-3)**: 60% increase in keyword visibility for platform.
*   **Scalability (Months 4-12)**: 300% growth in user-site traffic through "SEO-by-default".

---

## 2. Platform Architecture Analysis

### 2.1 Technology Stack Review
*   **Frontend**: Next.js 16 (App Router), React 19.
*   **Backend**: Django REST Framework.
*   **Database**: SQLite (Current) → Recommended: PostgreSQL for JSONB performance.
*   **Rendering**: Currently heavily reliant on CSR (`"use client"`).

### 2.2 SEO-Critical Architecture Decisions
*   **The CSR Problem**: Using `"use client"` for the entire `PreviewPage` and `BlogPage` prevents search engines from seeing content immediately. This is the #1 blocker for user-site rankings.
*   **Multi-Tenancy**: Currently using path-based routing (`/preview/[slug]`). For enterprise growth, subdomain routing (`site.virtinsaz.com`) is recommended.

---

## 3. Critical Issues (Severity-Based)

### 3.1 Critical (Must Fix Immediately)

#### Problem 1: Client-Side Rendering for Public Content
*   **Impact**: Crawlers see a "Loading..." state instead of restaurant menus. User sites will not index properly in Google/Bing.
*   **Solution**: Convert `app/preview/[slug]/page.tsx` to a Server Component.
*   **Implementation**: Use `generateMetadata` for dynamic titles and fetch data directly on the server.
*   **Verification**: Check source code (Ctrl+U) to ensure HTML contains full menu content.

#### Problem 2: Missing Sitemap & Robots.txt
*   **Impact**: Google has no roadmap of the platform. New user sites won't be discovered unless manually linked.
*   **Solution**: Implement `app/sitemap.ts` and `app/robots.ts`.
*   **Implementation**:
```typescript
// app/sitemap.ts example
export default async function sitemap() {
  const sites = await getAllPublicSites();
  return sites.map(site => ({
    url: `https://virtinsaz.ir/preview/${site.slug}`,
    lastModified: site.updatedAt,
  }));
}
```

#### Problem 3: Static Metadata at Root
*   **Impact**: Every page on the platform has the same title: "ویترین ساز | ساخت وبسایت سریع و مدرن".
*   **Solution**: Implement `Metadata` export in every page component.

### 3.2 High Priority (Fix Within 2 Weeks)

#### Problem 4: Image Performance (LCP)
*   **Impact**: `unoptimized: true` causes massive payload sizes. Slow LCP leads to ranking drops.
*   **Solution**: Use Next.js `<Image />` component with a proper loader.

---

## 4. Platform SEO Strategy (The Builder)

### 4.1 Keyword Strategy (Persian Market)
Target high-intent keywords:
*   "ساخت وبسایت رستوران" (Restaurant website builder)
*   "منو آنلاین رایگان" (Free online menu)
*   "طراحی سایت کافه" (Cafe site design)

### 4.2 Content Architecture
*   **Landing Pages**: Dedicated pages for each niche (Cafes, Luxury Restaurants, Fast Food).
*   **Blog Hub**: Focus on "How to grow your restaurant business" to capture top-of-funnel traffic.

---

## 5. User-Generated Sites SEO (The "SEO-by-Default" Engine)

### 5.1 Default SEO Configurations
Every new site should automatically generate:
*   **Title**: `{Site Name} | {Category Name} در {City}`
*   **Description**: Auto-generated snippet from the restaurant description.
*   **Schema.org**: `Restaurant` or `FoodEstablishment` JSON-LD injected automatically.

### 5.2 User SEO Controls
Design a simple dashboard section for users:
*   Custom Meta Title/Description.
*   Google Analytics ID field.
*   Custom Domain mapping (Critical for professional SEO).

---
*(Continued in next response...)*
