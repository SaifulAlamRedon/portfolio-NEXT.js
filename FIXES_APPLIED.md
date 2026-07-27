# What was fixed (audit against portfolio-REST-API)

This document summarizes every bug found by comparing this frontend against the
actual NestJS backend (portfolio-REST-API) controllers, services, DTOs and
entities — plus the admin dashboard that was added.

## 🔴 Critical — requires a backend change (not included in this zip)

**`GET /settings` and `GET /users/profile` are both locked behind `JwtAuthGuard`
+ `@Roles('admin')`.** That means the public site has no endpoint it can call
to get site name / bio / contact email / social links — every visitor would
get a 401. This is a backend bug, not a frontend one, so it must be fixed in
your **portfolio-REST-API** repo, not here.

**Fix** — in `src/settings/settings.controller.ts`:

```ts
import { Public } from '../common/decorators/public.decorator'; // add this import

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()          // add this line
  @Get()
  find() {            // remove @Roles('admin') from this one handler only
    return this.settingsService.getSettings();
  }

  // ...every other handler (update, uploadLogo, etc.) stays exactly as it is,
  // still @Roles('admin') and still admin-only.
```

Only the single `GET` handler needs to change. Everything else (updating
settings, uploading logo/favicon, etc.) should stay admin-only, and it
already is.

Once you deploy that change, `useSettings()` in this frontend will work for
anonymous visitors, and the Hero / About / Footer / Contact / Resume pages
will show real data instead of failing silently.

`/users/profile` can stay fully admin-only — the frontend no longer relies on
it for public pages (see below).

## 🟠 Frontend bugs fixed

1. **Every list/detail endpoint response was read wrong.** The backend wraps
   every response as `{ success, message, data }`, but the old services did
   `const { data } = await apiClient.get(...)` and used that `data` directly
   as if it were the array/object itself. In reality `data` was the wrapper,
   so every `.map()` in the app would have crashed with "X.map is not a
   function" at runtime. Fixed with a shared `unwrap()` helper in
   `services/axios.ts`, used by every service.

2. **`/projects/categories` and `/projects/technologies` don't exist** on the
   backend — the old filter UI called them anyway (guaranteed 404s).
   Categories/technologies are now derived client-side from the already-
   fetched project list (`deriveCategories` / `deriveTechnologies` in
   `project.service.ts`).

3. **Analytics tracking calls would 400.** The backend's `ValidationPipe` uses
   `forbidNonWhitelisted: true`, and `CreateAnalyticsDto` only accepts
   `{ event?, source?, userId? }`. The old code sent `visitorId`, `browser`,
   `referrer`, `pageUrl`, `projectId` — none of which exist on the DTO, so
   every analytics call would fail with 400 Bad Request. Payloads are now
   shaped to match the real DTO.

4. **Field-name / shape mismatches** between the frontend's `types/index.ts`
   and the backend's actual TypeORM entities — the frontend types looked
   hand-written against a different, never-implemented schema. Full list:

   | Entity | Frontend had | Backend actually returns |
   |---|---|---|
   | Project | `thumbnailUrl`, `isFeatured`, `isPublished` (bool), `category: string`, `technologies: string[]` | `coverImage`, `featured`, `status` (string), `category: {id,name}`, `technologies: {id,name}[]` |
   | Skill | `level`, `iconUrl` | `percentage`, `icon` |
   | Experience | `isCurrent`, `logoUrl`, `location`, `technologies: string[]` | `currentlyWorking`, no logo/location fields, `technologies: {id,name}[]` |
   | Education | `field`, `startDate`/`endDate` (strings), `isCurrent`, `gpa`, `logoUrl` | `fieldOfStudy`, `startYear`/`endYear` (numbers), no currently-studying flag, no gpa, no logo |
   | Certificate | `imageUrl`, `expiryDate`, `description` | `image`, no expiry date, no description |
   | Testimonial | `content`, `avatarUrl`, `position`, `isApproved` | `message`, `photo`, `designation`, `approved` |
   | Settings | `siteDescription`, `contactPhone`, `footerText`, `themeConfig`, nested `socialLinks` | `aboutMe`, `phone`, no footer text field, `themeColor` (string), flat `github`/`linkedIn`/`facebook`/`twitter` |
   | User | `firstName`/`lastName`, `avatarUrl`, nested `socialLinks` | `fullName`, `avatar`, flat `github`/`linkedin`/`portfolio` |

   Every component that rendered these fields (`project-card`, `skill-card`,
   `certificate-card`, `experience-timeline`, `testimonials-section`,
   `about-content`, `education-content`, `experience-content`,
   `projects-content`, `project-detail`, `hero`, `footer`, `contact-content`,
   `resume-content`) has been updated to match the real shape.

5. **`/auth/login`, `/auth/me`, `/auth/refresh` are NOT wrapped** the same way
   as everything else — they return their payload directly. `auth.service.ts`
   correctly skips `unwrap()` for these, with a comment explaining why.

## ✅ Verified

- `npx tsc --noEmit` — no type errors
- `npx next build` — succeeds, all 23 routes build cleanly, no warnings except
  one pre-existing, unrelated Next.js font-loading notice

## 🆕 Admin dashboard added

New routes under `/admin` (not present before):

- `/admin/login` — email + password login (uses your existing `/auth/login`)
- `/admin` — overview with counts and quick links
- `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit` — full CRUD
- `/admin/skills`, `/admin/experience`, `/admin/education`, `/admin/certificates` — inline list + create/edit/delete
- `/admin/testimonials` — approve / reject pending, delete approved
- `/admin/messages` — read/unread contact messages, reply via mailto, delete
- `/admin/settings` — edit the site-wide Settings record

All protected by `AdminGuard` (`components/admin/admin-guard.tsx`), which
calls `GET /auth/me` on load and redirects to `/admin/login` if the token is
missing/invalid or the user isn't role `admin`.

**Note:** file uploads (logo, favicon, resume, certificate images, project
images) are handled as plain URL text fields in the admin forms rather than
direct file upload widgets, to keep scope reasonable — paste a hosted URL
(e.g. from Cloudinary, S3, or your `settings/logo` upload endpoint used some
other way) into those fields for now.
