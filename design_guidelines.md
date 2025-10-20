# SmartShop App - Design Guidelines

## Design Approach

**Selected Approach**: Reference-Based (E-commerce Focus)
Drawing inspiration from modern e-commerce leaders: Shopify's clean product displays, Amazon's efficient checkout flow, and Instacart's list management, combined with contemporary SaaS dashboard aesthetics for user management.

**Core Principles**:
- Conversion-optimized: Clear CTAs, streamlined checkout, minimal friction
- Trust-building: Professional polish, clear pricing, secure payment indicators
- Efficiency-first: Quick access to common actions, smart defaults, batch operations

---

## Color Palette

### Light Mode
- **Primary Brand**: 220 85% 50% (vibrant blue - trust and reliability)
- **Primary Hover**: 220 85% 45%
- **Secondary**: 150 60% 45% (success green for confirmations)
- **Background**: 0 0% 98%
- **Surface**: 0 0% 100%
- **Border**: 220 15% 90%
- **Text Primary**: 220 20% 15%
- **Text Secondary**: 220 10% 50%

### Dark Mode
- **Primary Brand**: 220 80% 55%
- **Primary Hover**: 220 80% 60%
- **Secondary**: 150 55% 50%
- **Background**: 220 15% 10%
- **Surface**: 220 15% 14%
- **Border**: 220 15% 25%
- **Text Primary**: 220 10% 95%
- **Text Secondary**: 220 8% 65%

### Accent Colors
- **Warning/Cart Badge**: 35 95% 55% (vibrant orange)
- **Error**: 0 75% 55%
- **Success**: 150 60% 45%
- **Info**: 200 85% 50%

---

## Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - headings, UI elements, buttons
- Secondary: 'Inter' - body text, descriptions
- Monospace: 'JetBrains Mono' - order numbers, pricing, codes

**Scale**:
- Hero/H1: text-5xl font-bold (48px)
- H2: text-3xl font-bold (30px)
- H3: text-2xl font-semibold (24px)
- H4: text-xl font-semibold (20px)
- Body Large: text-lg (18px)
- Body: text-base (16px)
- Small: text-sm (14px)
- Tiny: text-xs (12px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 24**
- Component padding: p-4, p-6, p-8
- Section gaps: gap-4, gap-6, gap-8
- Margins: m-2, m-4, m-6, m-8
- Container max-width: max-w-7xl for main content

**Grid System**:
- Product grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- List management: Single column with max-w-3xl
- Checkout: Two-column layout (cart summary + payment form)

---

## Component Library

### Navigation
**Top Navigation Bar**: Fixed, glass-morphism effect with backdrop-blur, contains logo, search, cart badge (with item count), user avatar/menu
**Mobile Navigation**: Bottom tab bar with icons for Home, Lists, Orders, Profile

### Product Cards
- Product image (4:3 ratio, object-cover)
- Title (text-base font-semibold, line-clamp-2)
- Price (text-lg font-bold)
- Stock indicator (text-sm, color-coded)
- Add to cart button (primary, full-width on mobile)
- Quick view icon (eye icon, top-right corner on hover)

### Shopping Lists
**List Card**: Rounded container with list name, item count, last updated timestamp, edit/delete actions
**List Items**: Checkbox for completion, product image thumbnail, name, quantity + unit, inline edit capability, link to product if available

### Cart Interface
**Cart Drawer/Sidebar**: Slide-in from right, shows all cart items with thumbnails, quantities (with +/- controls), subtotal, checkout CTA
**Cart Badge**: Pill-shaped, positioned top-right of cart icon, shows item count

### Checkout Flow
**Multi-step Indicator**: Horizontal stepper showing: Cart Review → Shipping Info → Payment → Confirmation
**Payment Form**: Stripe embedded, credit card fields with icons, save payment method checkbox, order summary sidebar with itemized list

### Dashboard Sections
**Profile Card**: Avatar upload, name, email, Facebook link status, edit button
**Stats Grid**: Total orders, active lists, saved products (cards with icons and numbers)
**Recent Orders**: Table with order number, date, status badge, total, view details button
**Quick Actions**: Create list, browse products, view cart (prominent cards)

### AI Recommendations
**Section Header**: "Recommended for You" with lightbulb icon
**Carousel**: Horizontal scroll of product cards with "Based on your orders" subtext
**Trending Section**: Grid layout with flame icon, "Trending Now" header

### Order Details
**Order Summary Card**: Order number (monospace), date, status badge (color-coded: pending=orange, completed=green, failed=red)
**Items List**: Product image, name, quantity, price per item, subtotal
**Payment Info**: Payment method last 4 digits, amount, status
**Receipt Button**: Download PDF or email receipt CTA

### Forms
**Input Fields**: Rounded borders, focus ring in primary color, labels above inputs, helper text below
**Buttons**: Primary (filled, primary color), Secondary (outline), Danger (red for delete actions)
**Validation**: Inline error messages in red below fields, success checkmarks for valid entries

### FAQ Page
**Search Bar**: Prominent at top with search icon, placeholder "Search for answers..."
**Accordion Items**: Question as header (text-lg font-semibold), expandable answer content, chevron icon
**Chatbot Placeholder**: Floating button bottom-right, "Ask AI Assistant" text

### Email Templates (for Resend/SendGrid)
**Verification Email**: Logo, welcome message, 6-digit code in large font, expiration time
**Order Confirmation**: Header with order number, itemized list with images, payment summary, thank you message, support contact
**Receipt**: Professional invoice layout, company details, order details table, payment breakdown, footer with terms

---

## Images

### Hero Section
**Homepage Hero**: Large 16:9 hero image showing diverse products/groceries in modern shopping setting, overlaid with headline "Smart Shopping Made Simple" and search bar, semi-transparent dark gradient overlay for text readability

### Product Images
**Placeholder Strategy**: Use consistent placeholder dimensions (400x300px) with subtle gradients and product category icons until real images are uploaded
**Product Pages**: Multiple images (main + thumbnails), zoom on hover/click

### Dashboard
**Empty States**: Friendly illustrations for empty lists, no orders, etc. (simple line art style)

### Marketing Elements
**Trust Badges**: Small icons for secure payment, fast delivery, money-back guarantee (bottom of checkout page)

---

## Interactions & States

**Hover States**: Subtle scale transform (scale-105), shadow increase
**Loading States**: Skeleton loaders for product grids, spinner for form submissions
**Success Animations**: Checkmark animation after payment success, confetti for first order
**Cart Updates**: Slide-in notification toast when item added
**Error Handling**: Red borders on invalid fields, modal alerts for critical errors

**Animations**: Minimal and purposeful only - cart badge bounce on add, smooth page transitions, accordion expand/collapse

---

## Responsive Strategy

**Mobile (< 768px)**: Single column layouts, bottom navigation, full-width CTAs, simplified product cards
**Tablet (768px - 1024px)**: 2-column grids, condensed navigation
**Desktop (> 1024px)**: Full multi-column layouts, hover interactions, sidebar navigation for dashboard

---

## Accessibility

- Dark mode toggle in user menu
- All form inputs with proper labels and ARIA attributes
- Keyboard navigation for all interactive elements
- Color contrast ratio minimum 4.5:1
- Focus indicators on all clickable elements
- Screen reader friendly product descriptions and status messages