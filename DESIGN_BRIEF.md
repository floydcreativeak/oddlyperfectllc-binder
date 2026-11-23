# Design Brief: Oddly Perfect LLC. Direction A: "The Binder"

> **One file, everything in it.** Save this as `DESIGN_BRIEF.md` in an empty project folder. It is the single source of truth for the build and replaces the separate shared and direction files. Then paste the starter prompt from Part 4 into Claude Code.

**Contents:** Part 1 Shared Foundation, Part 2 Business Content (from the Planning Packet), Part 3 Visual Direction (The Binder), Part 4 Starter Prompt.

---

## Part 1: Shared Foundation

### 1. Basics
- **Business:** Oddly Perfect LLC. A PR management firm that tailors each client's experience to fit their needs perfectly.
- **Domain:** oddlyperfectllc.com (custom domain on GitHub Pages, via `public/CNAME`).
- **Local market:** Serves the central Kenai Peninsula, Alaska (Soldotna, Kenai, Nikiski, Sterling and Kasilof) in person, and remote clients elsewhere. Use local business structured data (JSON-LD) and mention the service area naturally in copy. No street address is published unless the client adds one.
- **Site type:** Business/service brochure site, hybrid structure (long home page plus dedicated pages).
- **Pages:** Home, About, Services, Reviews, Pricing, plus legal pages: Privacy Policy, Terms, Accessibility Statement.
- **Home page section order:** 1 Hero, 2 Services, 3 Pricing, 4 Contact, 5 About, 6 Reviews, 7 FAQ, then a big playful footer.
- **Repo:** `oddlyperfectllc`, private. (Note: GitHub Pages from a private repo needs a paid GitHub plan. Confirm before the first deploy.)

### 2. Audience and goals
- **Visitors:** Ages 25-60. Business owners, politicians, entrepreneurs. They arrive from Facebook ads, Chamber of Commerce and referrals. Mobile and desktop usage is about equal.
- **Number one action:** Call. Click-to-call is the primary button everywhere. Email link is secondary. The friendly on-ramp for the undecided is the **"Complimentary Blind Date With a Marketer"** (a free 30-minute fit consultation), which is booked by phone, so it feeds the same call button.
- **Five-second feeling:** Fun professionalism.
- **What competitors get wrong:** Boring, walls of text, too formal, a corporate HR or law-firm feel. This site must be the opposite: short, scannable, confident, funny.
- **SEO terms to work in naturally:** Social Media Manager, Marketing Manager, Public Relations, PR, Marketing, plus local variants (Kenai Peninsula, Soldotna and Kenai marketing, PR and social media help).

### 3. Voice and copy
- Claude writes all copy. Nothing is lorem ipsum, "TBD" or "Your text here".
- **Voice:** Witty. The site is the embodiment of an extroverted Type A personality with confidence through the roof. Think: organized, a little bossy in a charming way, always three steps ahead, never mean.
- Short sentences. Punchy headings in Title Case. Clever microcopy in buttons, hover states, 404, empty states, form confirmations, footer and loading text.
- Professional underneath the fun: claims stay credible, no invented client names, statistics or awards. Prices, limits and policies come from Part 2 exactly. **Never invent reviews, client names, results or testimonials.** Until real reviews arrive, the Reviews page shows a designed, witty empty state ("Our first fans are still typing...") and any sample notes used while building are flagged `placeholder: true`, are visibly sample content, and are blocked from production by the CI check. Never promise guaranteed results, media coverage or introductions.
- Call-to-action language should be consistent in spirit ("Call Us", "Let's Talk") but varied in wit.

### 4. Navigation
- **Desktop:** Logo left, page links, visible phone number (click-to-call), social icons, light/dark toggle. Blurred-glass background. Hides on scroll down and reappears on scroll up. Active page shown with a small dot.
- **Mobile:** Slim top bar with logo, phone number and theme toggle (hides and shows the same way). **Bottom tab bar** with Home, Services, Pricing, Reviews, About, with a floating Call button docked above it. Blurred glass, safe-area aware, 44px+ touch targets.
- Skip link, visible focus rings, and correct `aria-current` on the active page.

### 5. Shared components
- **Reviews:** A wall of sticky notes with SVG star ratings (stars are never emoji). Source label per review (email, message, Yelp, Facebook, Google). Notes can be nudged or dragged on pointer devices. Keyboard-accessible and readable as a plain list for screen readers.
- **Pricing:** Three monthly partnership tiers with a Flex / Month-to-Month toggle, then one-time projects, event services, published fees, rush tables, Community Rate and a travel and service-area block. All of it is driven by `content/pricing.yml` (see Part 2). The home page shows a compact three-tier version with a link to the full Pricing page. Everything collapses into stacked cards on mobile with no horizontal scroll. Prices are real, so the layout must handle changing numbers and longer lists gracefully.
- **Services router:** A "Which One Are You?" component built from the plain-English router in Part 2, where the visitor's own words point to the right service.
- **House rules:** A friendly, scannable "fine print" section for the No Kickbacks promise, Relationships Not for Sale, Revision Rule, Community Rate and travel. Policies are never a wall of text.
- **Team cards:** Photo, name, title, fun fact. Lift and tilt on hover. Built for a founder-led firm: one card at launch that looks intentional, and more cards add cleanly later. Don't invent bios or names (use client-supplied content only).
- **Gallery:** Masonry, click to enlarge into an accessible lightbox (focus trap, Esc, arrow keys, alt text and captions).
- **Downloads:** A "Quick Pricing Sheet" PDF (the at-a-glance packet page: monthly tiers, projects, events, fees, key policies). Preferred: generate it at build time from `pricing.yml` through a print stylesheet so it can never go stale. A hand-supplied PDF is the fallback.
- **Social link grid:** Large playful tiles driven by `site.yml`.
- **FAQ:** Accessible accordion.
- **Contact:** Click-to-call and email link, plus hours. No form needed (static site).
- **Footer:** Big and playful, with a huge sign-off headline, phone number, hours, socials, legal links, and a tiny easter egg.
- **Announcement bar:** Optional, controlled from `site.yml`.

### 6. Motion rules (all directions)
- Amount: lively and playful, present in every section. Personality: bouncy. Spring-like easing via CSS `linear()`.
- Always-on basics: buttons animate on hover, cards lift and tilt, text reveals line by line or word by word, custom cursor (fine pointers only), brief skippable intro animation (under 1.5 seconds, once per session), playful page transitions (Astro view transitions), sticky storytelling on at least one section.
- Text moving along paths for headers (inspired by getartcraft.com), Three.js interactivity and drag-and-drop for the hero moment.
- **Performance contract:** Must stay fast on slow phones. Target LCP under 2.5s on throttled mid-range Android over slow 4G. Initial JS under about 100 KB gzipped. Three.js, GSAP and heavy islands are lazy-loaded after first paint and only on capable devices. Everyone else gets a lightweight CSS/SVG version of the same moment.
- **`prefers-reduced-motion`:** Replaces movement with simple fades or no animation, disables the intro, custom cursor effects, tilt, parallax and Three.js, and never removes content.

### 7. Content, editing and technical
- **Editor:** Somewhat comfortable with technology. Uses **Pages CMS** (friendly web forms). Changes rarely: reviews, hours, announcements, prices, photos, services.
- **All text, photos, reviews, prices and hours live in `/content`.** Never hard-coded in markup. Zod schemas in `content.config.ts` so a typo is a clear build error.
- **Design tokens** (colors, fonts, spacing, radii, shadows, motion timing) live in one commented `src/styles/tokens.css`, light and dark sets.
- **Stack:** Astro (static) with React islands, vanilla CSS with tokens, GSAP (free) for text-on-path and reveals, Three.js (lazy) for the hero, Astro view transitions.
- **Images:** Optimized at build time (AVIF/WebP, multiple widths, explicit dimensions, lazy loading). Logo is inline SVG (client will supply files).
- **Photos:** None available yet. Use a series of clearly flagged placeholder images in varied aspect ratios (`placeholder: true` in content) that already match the final studio-and-polished direction. Real photos will be phone shots, so frames and crops must forgive imperfect photos. A CI check blocks production if any placeholder remains.
- **Deploy:** GitHub Actions to GitHub Pages. Custom domain. **Analytics:** Google Analytics (GA4) with a consent banner, documented in the Privacy page.
- **Legal pages:** Privacy, Terms and Accessibility are drafted from the policies in Part 2 and from the site's actual behavior (including Google Analytics). They carry a README flag that an Alaska attorney should review them before launch, and payment, late-fee and cancellation terms are not published until the owner approves (see Part 2, section 2.1).
- **README:** Plain-English guide for a non-developer: how to edit with Pages CMS, how to swap a photo, add a review, change prices, publish, and what to do if something breaks.

### 8. Accessibility
- WCAG 2.1 AA. Contrast checked for both themes and for every sticky-note and accent color pairing. Visible focus on every interactive element. Alt text required in the schema. Semantic landmarks and heading order. Keyboard access for every interaction (including drag-and-drop alternatives). Touch targets 44px+. No information conveyed by color alone. Accessibility statement page.

### 9. Never do
- Stock photos, emoji anywhere except as sticker content (see the sticker-emoji rule below), pop-ups, auto-playing video, all-caps everywhere, non-responsive layouts, neon, pure white (#FFF), pure black (#000), dark gray on black, gradients.

### 9a. Sticker-emoji rule (the one exception to the emoji ban)
- Emoji are allowed **only as sticker artwork**: a die-cut, slightly rotated sticker with a cream outline and soft shadow whose face is an emoji (for example a coffee cup, a megaphone or a 100 badge on a "Fueled By Coffee" sticker).
- They never appear in headings, body copy, buttons, navigation, form or error messages, review text, star ratings, icons, page titles or meta descriptions, and never inline in a sentence. If it isn't visibly a sticker, it isn't allowed.
- Only where stickers already exist in the design, and sparingly: no more than 1-2 emoji stickers per viewport, and most stickers stay hand-drawn so the hand-drawn look leads.
- Render them as bundled SVG or image assets (an open-licensed set such as Noto Emoji, license noted in the README), not as system font glyphs, so they look identical on every device and don't depend on the user's OS. Emoji stickers get the same die-cut treatment as the hand-drawn ones.
- Content-driven: each sticker is defined in `/content` with a `label` (accessible text) and an `emoji` or asset reference. Decorative ones are `aria-hidden`. Meaningful ones have a text alternative, and no information is conveyed by emoji alone.
- Reduced motion, performance and contrast rules apply to emoji stickers like any other sticker.

### 10. Still needed from the client
- Logo files (SVG preferred), real photos, real reviews (with source), hours, phone, email, social URLs, GA4 measurement ID, brochure PDF (or approval to generate one), team bios.

---

## Part 2: Business Content (from the Oddly Perfect Planning Packet)

This is the real offer. The planning packet is a working draft from September 2026, and the owner will tweak prices and wording. So all of this lives in `/content` and is editable in Pages CMS. Numbers, package names, limits and policy terms below must be carried over **exactly**. The wording around them should be rewritten in the site's witty voice. Never promise guaranteed results, media coverage or introductions to anyone.

### 2.1 What to publish and what to keep off the site

| Publish on the site | Keep OFF the site (internal only) |
|---|---|
| Monthly Marketing Partnerships (3 tiers, Flex and month-to-month pricing, what's included) | "Client Fit, Capacity & Financial Guardrails" section, including the fit-check grid, warning signs, capacity points, revenue targets and reserves |
| 12-Month Flex model and Flex benefits | "Working Notes & Decisions" blank pages and all pricing notes |
| One-time projects and event services (with boundaries) | Internal shorthand lines ("Think with me" etc.), capacity notes ("Target 4 Flex clients", "solo ceiling") and any "while solo" language |
| Published fees, rush policy, event rush policy, travel and service area | The suggestion to cap nonprofit relationships |
| Community Rate (nonprofits save 10%) | The KSRM/radio conflict policy and anything naming the owner's other employment |
| No Kickbacks / Relationships Not for Sale / Revision Rule | Legal and tax notes ("review by an Alaska attorney/accountant") |
| Plain-English router ("Customer says... we point them to...") | Internal acceptance test, "Automatic No" list |
| The Complimentary Blind Date (what it is, what it isn't) | The Blind Date interview questions (internal call script) |

**Held back until the owner approves** (put in `content/` as drafts with `draft: true`, not rendered): monthly payment and account policies (invoice dates, grace period, pause rules, 3-month minimum and cancellation terms), the per-project payment schedule table, and the "client delays" policy. The packet says late-fee and cancellation language needs attorney review. The Terms page can link to a "details provided in your agreement" statement until then.

### 2.2 Monthly Marketing Partnerships

| Package | 12-Month Flex | Month-to-Month | Plain-English fit |
|---|---|---|---|
| I Need a Plan | $1,500/mo | $1,750/mo | You can do the work. You need experienced direction. |
| Help Me Get It Done | $2,750/mo | $3,150/mo | You need strategy plus someone helping make sure the work happens. |
| Take Marketing Off My Plate | $4,250/mo | $4,850/mo | You need someone to largely own and coordinate marketing. |

Flex clients can move up or down between service levels. Written notice is due at least 5 calendar days before month-end, and the new tier begins on the first of the next month. Show Flex pricing as the primary price and month-to-month as the secondary price (a toggle or a flip on the card). The middle tier is the default highlight, and the owner can change it in the CMS.

**I Need a Plan.** Best for a business with someone who can handle the day-to-day work but needs experienced help deciding what to do, what to say, where to spend money and what should happen next.
- One main marketing goal at a time
- One 60-minute planning meeting each month
- Rolling 90-day marketing plan
- Marketing calendar
- Campaign ideas and direction
- Advertising and media guidance
- Messaging help
- Community partnership and visibility ideas
- Sponsorship strategy guidance
- Review and feedback on up to 4 client-created marketing items each month
- Help evaluating what is working and what is not
- Recommendations for outside specialists when needed
- *Example:* You need to recruit seasonal employees. We define the audience, message, advertising approach, timeline and what your staff should create. Your team executes, and we make sure they are working from a good plan.

**Help Me Get It Done.** Best for a business that doesn't just need ideas. It needs someone helping make sure the marketing actually happens.
- Two main marketing goals at a time
- Two working/planning meetings each month
- Marketing plan and calendar management
- Campaign development
- Copywriting
- Social media content
- Email and newsletter content
- Radio, print and digital advertising copy
- Press releases when appropriate
- Simple graphics using the existing brand
- Basic website copy updates
- Advertising and media coordination
- Coordination with existing vendors and media representatives
- Community partnership ideas
- Sponsorship strategy
- Simple monthly reporting
- Up to 8 routine finished marketing items per month
- *Routine items include:* social post with simple graphic, customer email, radio script, print/digital ad, press release, basic flyer, simple branded graphic, short website copy update or similar communication.
- *Important:* we use the available production capacity where the business needs it. We don't manufacture content just to fill a quota.

**Take Marketing Off My Plate.** Best for a business with enough marketing happening that somebody needs to own it, but that doesn't necessarily need to hire an in-house marketing director and team.
- Three to four main marketing goals at a time
- More frequent strategy and working meetings
- Annual and quarterly planning
- Marketing budget guidance
- Coordination across advertising channels
- Vendor oversight
- Public relations and business communications
- Community partnership development
- Sponsorship strategy
- Campaign management
- Leadership-level marketing guidance
- Participation in appropriate leadership meetings
- More detailed reporting and recommendations
- Up to 12 routine finished marketing items per month
- Up to 2 larger communications pieces per month
- *Larger pieces include:* substantial newsletter, media package, multi-version advertising campaign, larger promotional piece or comparable assignment.
- *Boundary:* large events, complete rebrands, website development, major publications, extensive professional photo/video and unusually large standalone campaigns remain separate.

### 2.3 The 12-Month Flex Partnership
Tagline: *Commit to us. Not to one package.*
- 12 consecutive months. Move between any of the three monthly service levels.
- Written request at least 5 calendar days before month-end. The new tier begins the first day of the following month.
- No mid-month changes, no prorating, maximum one tier change per month, unused monthly scope doesn't roll over.
- Tier pricing is locked for the contract year.
- Separately contracted projects, events, outside expenses and prior commitments are unaffected by tier changes.

**Flex partner benefits:** waived $750 onboarding fee, locked pricing for the contract year, priority scheduling for available projects and events, 10% off separately contracted professional-service projects.

### 2.4 Community Rate (Nonprofits Save 10%)
Qualified nonprofit organizations automatically receive 10% off professional service fees. No special ask, no private negotiation, no different discount depending on the organization. Discounts don't stack. Third-party expenses are not discounted.

### 2.5 What's not hidden inside monthly retainers
Paid advertising spend; printing and postage; website development/programming; new brand identity or complete rebrand; extensive custom graphic design; professional photography or video; audio production; major publications; specialty software purchased for the client; venue, catering, rentals and entertainment; extensive event planning; substantial travel; other outside vendors and specialty production.

Rule to reflect in the copy: we tell the client *before* work crosses from included monthly service into $225/hour out-of-scope work or a separately priced project.

### 2.6 Plain-English router (great as a "Which One Are You?" component)

| The customer says | We point them to |
|---|---|
| "I can do the work. I just need someone to tell me what makes sense." | I Need a Plan |
| "I know we need marketing, but nobody has time to make it happen." | Help Me Get It Done |
| "Marketing keeps landing back on my desk. I need someone to own it." | Take Marketing Off My Plate |
| "We have one big thing we need people to know about." | Campaign Sprint |
| "We need help with an event, but not a full event-production company." | Choose from event services |
| "I have no idea which one I need." | Complimentary Blind Date With a Marketer |

### 2.7 One-Time Marketing Projects

| Service | Price | When someone needs it | What's included |
|---|---|---|---|
| Marketing Checkup + 90-Day Plan | $2,500 | Tell us what is working, what is not, and what to do next. | Review of current marketing, messaging, advertising and communications, with a prioritized 90-day action plan. |
| Annual Marketing Plan | $3,500 | Build the priorities, calendar and major marketing roadmap for the year. | Priorities, calendar, major campaigns, seasonal opportunities, advertising approach and communications roadmap. |
| Messaging Reset | $3,000 | We know what we do; we just do not explain it very well. | Key messages, audience, business description, talking points and core marketing language. |
| Campaign Sprint | $4,500 | One important thing needs focused promotion for roughly 4-6 weeks. | One focused 4-6 week campaign: concept, audience, messaging, rollout plan, media recommendations and up to 8 campaign communications. |
| PR Announcement | $1,500 | We have news and need help telling people. | Messaging consultation, one polished press release, media contact strategy, distribution guidance and one follow-up cycle. |
| Sponsorship Program | $3,500 | Build a professional sponsorship structure and tools. No sponsor solicitation. | Levels, pricing recommendations, benefits, packet copy, tracking, fulfillment, recognition and renewal tools. |

Fixed-price projects include two reasonable revision rounds unless the scope says otherwise. A completely new direction after approval is new work. Additional revisions are $225/hour with advance approval. We never bill a client to correct our own mistake.

### 2.8 Event Services
Positioning line: *We are a marketing and communications firm that knows how to run a very good event. We are not a full-service event production company.*

| Service | Price | Tagline | What's included |
|---|---|---|---|
| Help Us Plan It | $3,000 | You execute it; we build the roadmap. | Kickoff, event goals/concept, preliminary budget framework, planning timeline, venue/space considerations, vendor-needs checklist, registration/ticketing recommendations, sponsorship-opportunity recommendations, staffing/volunteer planning, marketing roadmap, preliminary schedule, run-of-show framework, final planning meeting and two reasonable revision rounds. |
| Help Us Promote It | $4,500 | You have the logistics; we help get people there. | Event positioning and messaging, promotion timeline, advertising/media recommendations, social plan, email strategy, PR approach when appropriate, sponsor-recognition plan, community-promotion opportunities and up to 8 finished event-marketing pieces. |
| Run Event Day | $2,500 | You planned it; we run the room. | Advance handoff, review of existing plan, final timeline and run-of-show, vendor confirmations, event-day point person, vendor arrival coordination, program/timeline management, troubleshooting and up to 10 consecutive onsite hours. |
| Coordinate the Event | $6,500 | You know what the event is; we make sure the moving pieces come together. | For a defined one-day event with one primary location: kickoff, detailed timeline, budget tracking, up to 6 planning meetings, coordination with up to 10 primary vendors, venue, registration/ticketing, sponsor logistics/fulfillment, signage/material coordination, staffing/volunteer planning, run-of-show, confirmations, event-day lead management, up to 10 onsite hours and post-event wrap-up. |

**Event boundaries (publish as friendly honesty):** no full-service event production, no large multi-day production management, no unlimited vendor management, no sponsor solicitation, no paid access to personal or professional relationships. The client retains responsibility for vendor contracts and major decisions, and outside vendors are paid directly by the client whenever practical. (The line "an event inquiry can be declined if it threatens recurring-client commitments" stays internal.)

**Sponsorship boundary:** we help build a sponsorship program worth saying yes to. We don't sell access to contacts or make sponsor asks on a paying client's behalf. The client owns the relationships; we build the structure and tools.

### 2.9 Published fees

| Item | Fee | Note |
|---|---|---|
| Complimentary Blind Date With a Marketer | $0 | 30-minute fit consultation. No obligation. Not a free strategy session. |
| Out-of-Scope Professional Services | $225/hr | 15-minute increments. Always disclosed and approved before work begins. |
| After-Hours / Weekend Work | $300/hr | One-hour minimum when unscheduled work is specifically requested and accepted. |
| Travel Time Outside Local Area | $125/hr | 30-minute increments, plus the current IRS business mileage rate. |
| Month-to-Month Onboarding | $750 | Waived for 12-month Flex clients. |

*No surprise hourly bills: normal emails, regular calls, scheduled meetings and ordinary communication required to deliver the package are not tracked with a stopwatch.*

**Rush policy, marketing and projects:** within 2 business days +25%; by the next business day +35%; same business day +50%; minimum rush fee $225. Subject to capacity, because paying a rush fee doesn't purchase impossible capacity. No rush fee when the compressed timeline is caused by our own mistake or delay.

**Event rush policy:** booked 30-44 days before the event +15%; 14-29 days +25%; 7-13 days +40%; fewer than 7 days +50% if accepted.

### 2.10 Travel and service area
No added travel fee within **Soldotna, Kenai, Nikiski, Sterling and Kasilof**. Outside those communities, remote meetings are the default. If in-person travel is requested and accepted, travel time is $125/hour in 30-minute increments plus the current IRS standard business mileage rate. Airfare, lodging, rental vehicle and necessary travel expenses are client-paid at actual cost with no markup, and the client may book and pay major travel expenses directly whenever practical.

### 2.11 Values and promises (the best copy material on the site)
- **"No Kickbacks. No Markups. No Funny Business."** If a client needs a photographer, videographer, radio or TV station, web developer, printer, designer, event vendor or other specialist, we help identify options but take no cut. No referral commissions, media commissions, vendor kickbacks, hidden markups or rebates tied to client spending. The client contracts with and pays outside vendors directly whenever practical. Closing line: *We do not make more money when you spend more money. And we like it that way.*
- **"Our Relationships Are Not for Sale."** We may identify types of partners, organizations or opportunities worth pursuing and help a client develop an approach. We don't sell contact lists, promise personal introductions, solicit sponsors, or use private professional relationships simply because a client has retained us.
- **Radio:** the site may say that Oddly Perfect writes radio commercial copy, recommends radio when appropriate and coordinates campaign messaging, and that it doesn't sell airtime or mark up media. Don't mention any specific station, and don't mention the owner's other employment.

### 2.12 Seed FAQ (rewrite in the witty voice, keep the facts)
1. What is a "Complimentary Blind Date With a Marketer"? A 30-minute fit consultation to see if we're right for each other. It's free and no obligation, but it's not a free strategy session.
2. Do I have to commit to a year? No. Month-to-month is available (higher price, $750 onboarding, 3-month minimum), but 12-Month Flex lets you commit to us rather than to one package. *(The 3-month minimum is held-back detail: say only "month-to-month is available" until the owner approves.)*
3. Can I switch packages? Flex clients can move up or down once a month, with written notice at least 5 calendar days before month-end.
4. Do you take commissions or markups? Never.
5. Will you find sponsors for me or introduce me to people? No. We build the sponsorship program and tools, and you own the relationships.
6. Where do you work? In person, with no travel fee, in Soldotna, Kenai, Nikiski, Sterling and Kasilof. Remote everywhere else, with travel billed only if requested and accepted.
7. What if I need it fast? Rush fees apply, subject to capacity.
8. Do nonprofits get a discount? Yes, 10% off professional service fees, automatically.
9. What's not included in a monthly package? See 2.5.
10. Do you run events? We plan, promote, coordinate and run events. We're not a full-service event production company.

### 2.13 Content mapping (guidance for the schemas)
- `content/pricing.yml`: `partnerships[]` (name, flexPrice, monthlyPrice, fitLine, highlight, includes[], example, boundary), `flex` (tagline, rules[], benefits[]), `projects[]`, `events[]`, `fees[]`, `rush` and `eventRush` tables, `communityRate`, `notIncluded[]`, `travel` (localAreas[], terms). Every price is a number plus a display string, so the CMS editor changes one field and every page updates.
- `content/services/*.md`: one entry per partnership, project and event, with a `kind` field (`partnership` | `project` | `event`), a plain-English `fit` line and `includes[]`.
- `content/router.yml`: the six "customer says" lines with their targets.
- `content/values.yml`: kickbacks and relationships promises, plus the radio line.
- `content/faq.yml`: the seed FAQ, with a `draft` flag on anything held back.
- `content/site.yml` gains `serviceArea[]` and a `blindDate` block (title, blurb, duration).

---

## Part 3: Direction A, "The Binder"

### Concept
The site is the clean office from the brief: a well-organized binder on a desk, with index dividers, sticky notes, a whiteboard and a cork board. It's the most literal and tactile direction, so it reads as "a place" within five seconds. Everything feels physical, tidy and confident, and a little bossy about being organized.

### Layout
- Warm manila-paper page. Medium content width, comfortable spacing, very rounded corners, soft shadows.
- **Index-divider tabs** stick out of the right edge on desktop and double as in-page section navigation. Each home section is a "divider": color-block shifts between sections are the colored divider sheets. Mobile uses a compact tab strip at the section edge.
- Plain space inside sections and color-block shifts between them. No hairlines or heavy borders.
- Hero: a whiteboard panel with a huge Title Case headline, a one-line witty subhead, and the phone number as an oversized sticky note that is the main call button. Studio-style photo frames are taped or clipped to the board.
- Pricing: clipped spec sheets (cards) with a binder-ring edge. Contact: a "Post-it station" with Call, Email, Hours.
- Reviews: a **cork board** of tilted sticky notes in pastel colors with pins, star ratings drawn by hand in SVG. Notes can be dragged and re-pinned (with a keyboard alternative).
- Gallery and team: polaroid-style and clipped photo cards, masonry layout.
- Footer: huge and playful, "a bulletin board at closing time", with a giant sign-off headline and tiny sticky notes of fun facts.

### Color (light and dark, user toggle plus system default)
Muted vintage pastels, accent used generously, no gradients. Starter values (verify all contrast pairings):
- **Light:** paper `#F3E9D2`, surface `#FAF3E3`, ink `#2B2A33`, cork `#C9A27A`, accent coral `#D9654F`, notes: butter `#F6DE8D`, rose `#EBB5B0`, sage `#B9CDB0`, sky `#AFCBDD`.
- **Dark ("after hours office"):** bg `#23212E` (aubergine-ink), surface `#2E2B3B`, text `#F0E8D8`. Notes keep their pastel colors with dark ink text, so they glow against the dark.
- Accent coral is for primary buttons, tabs, pins and doodle highlights. Text always uses ink or cream tokens.

### Typography
- **Headings:** a chunky, friendly slab at huge, dramatic sizes in Title Case. Candidates: Zilla Slab (bold), Rokkitt, Bevan. Pick one after a test render.
- **Handwritten accents:** a marker-style face for annotations, margin scribbles and note text. Candidates: Gochi Hand, Caveat Brush, Reenie Beanie.
- **Body:** clean sans at standard size. Candidates: Figtree, DM Sans.
- Fonts must be OFL-licensed, self-hosted, subset, `font-display: swap`. Visual style leads, and type follows to complement it.

### Icons, doodles, imagery
- Hand-drawn SVG icon set with mixed corners (some rounded, some squared strokes). Doodles: paper clips, push pins, tape, arrows, coffee rings, stars, underline swooshes, scribbled "ta-da" bursts.
- Stickers: round badges ("Call Us!", "Fully Booked? Never.", "Tailored") placed with slight rotation. Emoji stickers are allowed here per the sticker-emoji rule in Part 1, styled as stickers stuck to the binder or board, sparingly.
- Photos: studio and polished, no filters or treatments. Placeholders in portrait, square, 4:3 and wide ratios.

### Motion signature
- Notes **slap** onto the board with a bouncy settle as they scroll in. Divider tabs flip like binder pages. Page transitions are a "page flip" or sticky-note peel (view transitions).
- Hover: cards lift and tilt toward the cursor. Buttons squish and spring back.
- Text reveals word by word like a marker writing. At least one headline rides a hand-drawn curved path.
- **Hero Three.js moment:** A small 3D pile of sticky notes the visitor can fling and stack (drag and drop). Capable devices only, lazy-loaded. Fallback: a CSS/SVG tilting stack with drag via pointer events.
- Custom cursor: a marker tip, fine pointers only.
- Sticky storytelling: the About or Services section pins a "whiteboard" while steps are written onto it as the visitor scrolls.
- Intro: a sticky note peels, the logo is "stamped", and it is gone in under 1.5 seconds.

### How the real content looks in this direction
- **Monthly partnerships:** three manila folders with index tabs (I Need a Plan, Help Me Get It Done, Take Marketing Off My Plate), clipped to the board. The Flex / Month-to-Month switch is a sticky note you flip: Flex price big on the front, month-to-month price small on the back. The highlighted tier gets a sticker.
- **One-time projects and event services:** a "project drawer" of file folders. Pick a tab and the spec sheet slides out with the price, the "when someone needs it" line and what's included. Event services sit in a second drawer so the two never get mixed up.
- **Which One Are You?** The six plain-English lines are sticky notes on the cork board. Hover or tap one and a string or arrow pulls to the matching service. The "I have no idea which one I need" note points at a big Blind Date sticky.
- **Blind Date CTA:** a Post-it-style card with a hand-drawn heart doodle (an emoji sticker is allowed here) and the phone number. It's the friendliest call button on the site.
- **House rules / fine print:** a binder page of checklist items. "No Kickbacks. No Markups. No Funny Business." is a rubber-stamp sticker, and "Our Relationships Are Not for Sale" is a tag on a ring. Rush and event-rush tables live in tidy accordions ("The Hurry-Up Fees").
- **Service area:** a pinned map-style sticky listing Soldotna, Kenai, Nikiski, Sterling and Kasilof as pins. Hand-drawn, not a real map embed.
- **Reviews empty state:** an empty corkboard with a lone pin and a witty note, so launch without reviews still looks designed.

### Risks and notes
- The most skeuomorphic direction. Avoid kitsch by keeping textures subtle, layouts strict and the grid clean ("clean office", not "cluttered corkboard").
- Cork and paper textures must be tiny, SVG or CSS based, not large images.
- The pinned-note drag interaction needs a keyboard alternative and a reduced-motion version.

### Acceptance checks
- First screen shows the logo, the headline, the phone number and a Call button without scrolling on a 375px phone.
- Passes axe with zero serious issues in light and dark. Works fully with JS Three.js disabled.
- Lighthouse performance 90+ on mobile.

---


## Part 4: Starter Prompt for Claude Code

Save this entire file as `DESIGN_BRIEF.md` in an empty project folder, then paste the prompt below into a fresh Claude Code session.

```
I'm building a static website for Oddly Perfect LLC, hosted on GitHub Pages. Read DESIGN_BRIEF.md in full before doing anything. It is the single source of truth: Part 1 is the shared foundation, Part 2 is the real business content (prices, services, policies), Part 3 is the chosen visual direction (The Binder). The direction is already chosen, so skip any "propose directions" step.

Hard requirements:
- All text, photos, reviews, prices, and hours live in /content files, never hard-coded in markup. Seed /content from Part 2 using the exact numbers, package names and limits. Rewrite the surrounding wording in the witty voice.
- Do NOT publish anything in the "Keep OFF the site" column of Part 2, section 2.1, and render nothing marked draft/held back. Never invent reviews, client names, results or bios.
- Design tokens (colors, fonts, spacing, radii, motion timing) live in one commented file, src/styles/tokens.css, with light and dark sets.
- Mobile-first and accessible: WCAG AA, visible focus, alt text required in the schema, prefers-reduced-motion respected everywhere.
- Images optimized at build time. Fast on slow phones: lazy-load GSAP and Three.js, and give non-capable devices a lightweight CSS/SVG fallback.
- GitHub Actions deploy to GitHub Pages with a custom domain (public/CNAME).
- Pages CMS config (.pages.yml) so a non-developer can edit everything (prices, services, reviews, hours, announcements, photos) through friendly forms.
- A plain-English README for the non-developer editor.
- No generic template look, no placeholder text, no stock photos, and no emoji except as sticker artwork per the sticker-emoji rule in Part 1. Photos are clearly flagged placeholders (placeholder: true) in varied aspect ratios until real ones arrive. Add a CI check that fails the production build if any placeholder or TODO text remains.

Work in phases, committing after each one with a clear message:
1. Scaffold: Astro (static) + React islands, content collections with Zod schemas (including the pricing, services, router, values and faq schemas from Part 2, section 2.13), folder structure from the brief, tokens.css, base styles, fonts (self-hosted, subset), GitHub Actions workflow, .pages.yml.
2. Shell: layout, glass nav (hide on scroll down, show on scroll up, active dot, phone number visible), mobile bottom tab bar with a floating Call button, theme toggle with no flash, footer, view transitions.
3. Home page: all seven sections in the order given, with real witty copy in /content, the compact three-tier pricing, the Which One Are You? router and the Blind Date call-to-action.
4. Inner pages: About, Services, Reviews (with the designed empty state), Pricing (full: tiers with Flex toggle, projects, events, fees, rush tables, Community Rate, travel and service area, house rules), Privacy, Terms, Accessibility.
5. Motion and delight: text on paths, line/word reveals, tilt and lift hovers, custom cursor (fine pointers only), intro, sticky storytelling, and the hero Three.js moment with its fallback.
6. Hardening: axe and Lighthouse checks in light and dark, keyboard pass, reduced-motion pass, throttled-mobile performance pass, build-time Quick Pricing Sheet PDF, local-business JSON-LD, README, and the content lint.

Stop after Phase 2 and show me screenshots (mobile 375px, desktop 1440px, light and dark) so I can approve the look before you continue. After that, keep going without asking unless something is genuinely blocked or ambiguous. If you need an asset or decision from me (logo, GA4 ID, real reviews, hours, phone, email), use a clearly flagged placeholder and list it in a NEEDS_FROM_CLIENT.md file.

Before writing any code, give me a short plan (stack, folder tree, content schema, font picks with a one-line reason each) and then begin Phase 1.
```
