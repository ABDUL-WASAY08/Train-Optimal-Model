# FYP Project Setup Notes (AI Memory)

## Project Structure
```
fyp/
├── Backend/
│   ├── .env                          # All secrets (Cloudinary, GitHub, MongoDB)
│   ├── app.js                        # Express server entry point
│   ├── package.json                  # Dependencies
│   └── src/
│       ├── api/
│       │   └── cloudinary.js         # Cloudinary v2 config
│       ├── controller/
│       │   ├── AuthController.js     # GitHub OAuth logic + role assignment
│       │   ├── AccountController.js  # Account update logic
│       │   ├── ImageController.js    # Certificate upload/delete/get
│       │   └── getPublicPortfolioByUsername.js
│       ├── middleware/
│       │   ├── isAuthenticate.js     # ensureAuthenticated middleware
│       │   ├── multer.js             # Multer memory storage + file filter
│       │   └── passportMiddleware.js # GitHub Passport strategy
│       ├── model/
│       │   ├── database.js           # MongoDB connection
│       │   ├── user.js               # User schema (githubId, role, skills, etc.)
│       │   └── userData.js           # Certificate schema
│       └── route/
│           ├── AccountRoute.js       # /api/account/*
│           ├── AuthRoute.js          # /api/auth/*
│           ├── ImageRoute.js         # /api/user/* (certificates)
│           └── portfolioRoute.js     # /api/user/portfolio/*
└── frontend/
    └── src/
        ├── Screen/AuthScreen.jsx     # Login with role selection
        ├── zustand/useAuthStore.js   # Auth state management
        └── App.jsx                   # Routes + role-based navigation
```

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/github?role=developer` | No | Initiates GitHub OAuth |
| GET | `/github/callback` | No | GitHub OAuth callback |
| GET | `/me` | Yes | Get logged-in user profile |
| POST | `/logout` | Yes | Logout + destroy session |
| DELETE | `/delete-account` | Yes | Permanently delete the logged-in user + their certificates |

### Account Routes (`/api/account`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/update` | Yes | Update account details |
| PUT | `/update-dob` | Yes | Update date of birth |

### Certificate/Image Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | Yes | Upload certificate image (multipart/form-data, field: `image`) |
| GET | `/` | Yes | Get all certificates of logged-in user |
| DELETE | `/:id` | Yes | Delete certificate by ID (also deletes from Cloudinary) |

### Portfolio Routes (`/api/user`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/getprofile` | Yes | Get own portfolio URL |
| GET | `/portfolio/:username` | No | Get public portfolio by username (includes `certificates`) |

## Cloudinary Config
- **Cloud Name:** veusokcm
- **Folder:** `fyp_certificates`
- **Allowed formats:** JPEG, JPG, PNG, WEBP
- **Max file size:** 5MB

## Certificate Schema (userData.js)
```javascript
{
  userId: ObjectId (ref: "User"),
  certificateUrl: String,    // Cloudinary secure_url
  certificateName: String,   // e.g., "AWS Solutions Architect"
  companyName: String,       // e.g., "Amazon Web Services"
  role: String,              // optional
  description: String,       // optional
  issueDate: String,         // e.g., "2025-01-15"
  publicId: String,          // Cloudinary public_id (for deletion)
  timestamps: true           // createdAt, updatedAt
}
```

## User Schema Roles
- `developer` (default) - GitHub login
- `client` - GitHub login with role selection
- `admin` - Manual DB assignment only

## How GitHub Login + Role Works
1. Frontend sends `?role=developer` or `?role=client` in URL
2. Backend saves role in `req.session.signupRole` before GitHub redirect
3. After GitHub auth, `githubCallback` reads session role
4. Role is overwritten in DB via `findByIdAndUpdate`
5. User redirected to role-specific dashboard

## Dependencies Installed
- `cloudinary` v2.11.0 - Image upload to Cloudinary
- `multer` - Multipart form-data parsing (memory storage)
- `express-session` - Session management for Passport
- `passport` + `passport-github2` - GitHub OAuth
- `mongoose` - MongoDB ODM
- `axios` - HTTP client (GitHub API calls)

## Notes
- Route `/api/user` is shared by `portfolioRoute.js` and `ImageRoute.js`
- Multer uses memory storage (buffer) - no temp files on disk
- Cloudinary upload uses data URI (base64) from buffer
- `ensureAuthenticated` middleware protects all certificate routes
- Frontend must send `multipart/form-data` with field name `image`

---

# Certificates

Complete end-to-end workflow for the certificate feature: upload, list, delete,
and render on both the public portfolio and the logged-in account view.

## 1. Backend

### Model — `Backend/src/model/userData.js`
Certificates live in their own `Certificate` collection, **not** on the `User`
document. Each document is scoped by `userId`, so one user can never read or
delete another user's certificate.

```javascript
{
  userId:         ObjectId (ref: "User", required),
  certificateUrl: String,     // Cloudinary secure_url (required)
  certificateName:String,     // required
  companyName:    String,     // required
  role:           String,     // optional
  description:    String,     // optional
  issueDate:      String,     // optional, free-form e.g. "2025-01-15"
  publicId:       String,     // Cloudinary public_id, required (used to destroy)
  createdAt / updatedAt       // timestamps: true
}
```

### Routes — `Backend/src/route/ImageRoute.js`
Mounted in `app.js` on the same prefix as the portfolio router: `app.use("/api/user", imageRoute)`.

| Method | Endpoint | Middleware | Controller | Purpose |
|--------|----------|------------|------------|---------|
| POST | `/api/user/upload` | `ensureAuthenticated` → `upload.single("image")` | `uploadCertificate` | Create a certificate |
| GET | `/api/user/` | `ensureAuthenticated` | `getCertificates` | List my certificates (newest first) |
| DELETE | `/api/user/:id` | `ensureAuthenticated` | `deleteCertificate` | Delete a certificate + its Cloudinary asset |

### Middleware — `Backend/src/middleware/multer.js`
- `multer.memoryStorage()` → file arrives as `req.file.buffer`, no temp file on disk.
- `fileFilter` allows only `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.
- `limits.fileSize` = **5 MB**. Anything larger is rejected before Cloudinary.

### Controller — `Backend/src/controller/ImageController.js`
`uploadCertificate` flow:
1. Reject if `!req.user` → `401`.
2. Reject if no `req.file` → `400`.
3. Require `certificateName` **and** `companyName` → `400` if missing.
4. Convert buffer to a base64 data URI: `data:<mimetype>;base64,<b64>`.
5. `cloudinary.uploader.upload(dataURI, { folder: "fyp_certificates", resource_type: "image" })`.
6. `Certificate.create({ userId: req.user._id, certificateUrl: result.secure_url, publicId: result.public_id, ... })`.
7. Respond `201` with the created document in `data`.

`getCertificates` flow:
- `Certificate.find({ userId: req.user._id }).sort({ createdAt: -1 })` → `200` with `data` array.

`deleteCertificate` flow:
- `Certificate.findOne({ _id: id, userId: req.user._id })` — the `userId` in the
  filter is the ownership check, so a user cannot delete someone else's file by
  guessing an ID → `404` if no match.
- `cloudinary.uploader.destroy(certificate.publicId)` removes the image.
- `Certificate.findByIdAndDelete(id)` removes the record.
- Respond `200`.

### Public portfolio — `Backend/src/controller/getPublicPortfolioByUsername.js`
`GetPublicPortfolio` (`GET /api/user/portfolio/:username`, **no auth**) looks the
user up by username, then attaches their certificates to the response:

```javascript
const certificates = await Certificate.find({ userId: user._id })
  .select("-publicId -__v")
  .sort({ createdAt: -1 });

res.json({ data: { ...user.toObject(), accessToken: undefined, githubId: undefined, certificates } });
```

- `publicId` is stripped because it is an internal Cloudinary handle that lets
  anyone who holds it destroy the asset.
- `accessToken` / `githubId` are stripped because this is an **unauthenticated**
  endpoint — previously the full user document, including the GitHub OAuth
  access token, was returned to any visitor.
- Username is matched with `^...$` case-insensitive, and the value is passed
  through `escapeRegex()` so usernames containing regex metacharacters cannot
  break the query.

## 2. Frontend — Zustand store

All certificate network access lives in `frontend/src/zustand/useUtilityStore.js`
so any screen can read/delete without duplicating axios calls.

**State**
```javascript
certificates: [],          // array of certificate documents
certificatesLoading: false,
certificateError: null,
```

### `uploadCertificates(certificate)`
Takes a plain object and builds the `FormData` itself — the field name must be
`image` to match `upload.single("image")` on the server.
```javascript
const formData = new FormData();
formData.append("image", certificate.image);
formData.append("certificateName", certificate.certificateName || "");
formData.append("companyName", certificate.companyName || "");
formData.append("role", certificate.role || "");
formData.append("description", certificate.description || "");
formData.append("issueDate", certificate.issueDate || "");

const response = await api.post("/user/upload", formData);
```
On success the new certificate is **prepended** to state so the UI updates
without a refetch. Do **not** set `Content-Type` manually — axios must set the
multipart boundary itself.

### `getCertificates()`
```javascript
const response = await api.get("/user/");
set({ certificates: response.data.data || [], certificatesLoading: false });
```
Returns `{ success, certificates }`. Sets `certificatesLoading` true for the
duration so callers can render a skeleton/placeholder.

### `deleteCertificates(certificateId)`
```javascript
const response = await api.delete(`/user/${certificateId}`);
set((state) => ({ certificates: state.certificates.filter(i => i._id !== certificateId) }));
```
Optimistically filters the row out of state; no refetch needed.

Every one of the three returns `{ success: true, ... }` or
`{ success: false, error }` and pushes the message into `error` /
`certificateError` — **none of them throw**, so callers must check `res.success`
before reading `res.certificates` or `res.certificate`.

## 3. Frontend — `Setting.jsx` (upload / delete UI)

A standalone collapsible section, separate from the existing "Account details"
`EDIT` toggle.

- Header row: title "Certificates" + a button labelled **`Certificates`**
  (swaps to **`CLOSE`** while open) that calls `handleToggleCertificates()`.
- First open triggers a lazy `loadCertificates()` → `getCertificates()` so the
  list is only fetched when the user actually looks at it.
- **Upload form** (`handleUploadCertificate`):
  - Client-side guards before any request: file must be `image/*`, must be
    `< 5MB`, `certificateName` and `companyName` must be non-empty.
  - `URL.createObjectURL(file)` gives a live image preview; `resetCertificateForm`
    calls `URL.revokeObjectURL` to avoid leaking the blob.
  - Submits through `uploadCertificates()`, toasts the result, clears the form.
- **Grid of uploaded certificates**: image thumbnail (links out to the full-size
  Cloudinary asset), name, company, role, issue date, description, and a
  `Trash2` delete button.
- `deletingId` tracks the row being deleted so only that card shows a spinner
  instead of blanking the whole grid.

## 4. Frontend — `Accounts.jsx` (logged-in view)

`Accounts` is used both as the `/account` route and as the `Portfolio` tab inside
`MainScreen`. It reads the same store, so no extra fetching logic:

```javascript
const { certificates, certificatesLoading, getCertificates } = useUtilityStore();

useEffect(() => {
  if (user) getCertificates();
}, [user, getCertificates]);
```

Renders a `Certificates` section with a `BadgeCheck` icon, two-column card grid,
image thumbnail, metadata, and a "View" link. Three states: list (when
`certificates.length > 0`), "Loading certificates..." (while
`certificatesLoading`), and nothing at all when the user has none.

## 5. Frontend — `publicPortfolio.jsx` (public view)

Certificates arrive already embedded in the portfolio payload, so this screen
needs no extra request — it reads `user.certificates` from
`GET /api/user/portfolio/:username`.

Rendered only when `certificates.length > 0`, between *Selected Work* and
*Education*, in the same hairline/typographic style as the rest of the page
(no rounded cards, `#0a0a0a` background, 1px `#161616` grid gaps).

A `Certificates` link is also added to the sticky header nav, gated on
`certificates.length > 0` like the other nav items.

### Section numbering
Section numbers used to be hardcoded (`"01"`…`"05"`) with a one-off ternary for
*Selected Work*, which broke whenever a section was empty. They are now derived
from a `visibleSections` array so numbering stays correct no matter which
sections render:

```javascript
const visibleSections = [];
if (skillsCount > 0) visibleSections.push("skills");
if (langCount > 0) visibleSections.push("languages");
if (repos.length > 0) visibleSections.push("work");
if (certificates.length > 0) visibleSections.push("certificates");
if (user?.education?.length > 0) visibleSections.push("education");
if (user?.workExperience?.length > 0) visibleSections.push("experience");

const sectionIndex = (key) => String(visibleSections.indexOf(key) + 1).padStart(2, "0");
```

## 6. Route bug — `/user/portfolio/:username` not opening `publicPortfolio.jsx`

**Symptom:** opening the share link rendered the dashboard (or the 404 page)
instead of `PublicPortfolio`.

**Route definition was never the problem** — `frontend/src/App.jsx` always had
`<Route path="/user/portfolio/:username" element={<PublicPortfolio />} />`.
Two things in `AppRoutes` were hijacking it:

1. **The role-redirect effect fired on every route.** The `useEffect` that sends
   a logged-in user to their dashboard had no notion of "which page am I on",
   so as soon as `fetchProfile()` resolved it called
   `navigate('/dashboard', { replace: true })` and threw the visitor off the
   public portfolio. A logged-in developer opening their own share link always
   landed back on the dashboard — the portfolio mounted for a frame, then got
   replaced.

2. **The whole route tree was gated behind the auth loading skeleton.**
   `if (loading) return <AccountSkelton />` blocked *every* route, including
   public ones, so an unauthenticated visitor sat on an account skeleton until
   `/auth/me` failed, instead of rendering the portfolio.

**Fix:** `PUBLIC_ROUTE_PREFIXES` + `isPublicRoute(pathname)` guard both the
redirect effect and the global skeleton.

```javascript
const PUBLIC_ROUTE_PREFIXES = ['/', '/authorization', '/user/portfolio'];

function isPublicRoute(pathname) {
  const path = pathname.toLowerCase();
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

const onPublicRoute = isPublicRoute(location.pathname);

useEffect(() => {
  if (onPublicRoute) return;
  if (loading || !user) return;
  const roleRoutes = {
    client: '/client-dashboard',
    admin: '/admin-dashboard',
    developer: '/dashboard',
  };
  const target = roleRoutes[user.role];
  if (target && location.pathname !== target) navigate(target, { replace: true });
}, [loading, user, navigate, onPublicRoute, location.pathname]);

if (loading && !onPublicRoute) return <AccountSkelton />;
```

The `location.pathname !== target` check also stops the effect from pushing a
second, redundant `navigate` on the dashboard itself. `/` being public is safe
because `githubCallback` in `AuthController.js` already redirects straight to the
role dashboard after OAuth.

### Second cause of broken share links — username drift
`AuthController.processGithubProfile` saved
`portfolioUrl: user/portfolio/${profile.username}` using the **GitHub**
username, but `GetPublicPortfolio` looks the user up by the **custom** username
they can change in Settings. Renaming yourself in Settings silently invalidated
every previously shared link, and `GetportfolioUrl` kept returning the stale
GitHub-based path.

`GetportfolioUrl` now derives the path from the current username:
```javascript
const portfolioURL = user.username ? `user/portfolio/${user.username}` : user.portfolioUrl;
```

## 7. Quick reference — request summary

| Action | Store function | HTTP call | Auth |
|--------|----------------|-----------|------|
| Upload | `uploadCertificates({ image, certificateName, companyName, role, description, issueDate })` | `POST /api/user/upload` (multipart, field `image`) | Yes |
| List (mine) | `getCertificates()` | `GET /api/user/` | Yes |
| List (public) | — inline in `publicPortfolio.jsx` | `GET /api/user/portfolio/:username` | No |
| Delete | `deleteCertificates(id)` | `DELETE /api/user/:id` | Yes |

## 8. Gotchas
- Multer field name **must** be `image`, and `api.post` must be given a raw
  `FormData` instance. Setting `Content-Type: multipart/form-data` by hand
  breaks the request because the boundary is missing.
- `certificateName` and `companyName` are the only server-enforced fields.
- `issueDate` is stored as a **String**, not a `Date` — send `YYYY-MM-DD` and
  render it as-is.
- The public endpoint returns the whole user document minus `accessToken` /
  `githubId`. If you add new sensitive fields to `user.js`, strip them there too.
- `imageRoute` and `portfolioRoute` share the `/api/user` prefix; `portfolioRoute`
  is registered first, so it wins for `/portfolio/:username` and `/getprofile`.

---

# Delete Account

Irreversible self-service account deletion, wired to the **Delete Account** button
in the "Danger Zone" of `frontend/src/Screen/Setting.jsx`.

| Method | Endpoint | Middleware | Controller |
|--------|----------|------------|------------|
| DELETE | `/api/auth/delete-account` | `ensureAuthenticated` | `deleteAccount` |

## 1. Backend — `Backend/src/controller/AuthController.js`

`deleteAccount(req, res)` lives next to `logout` because it reuses the same
session teardown, and it is registered on the **auth** router (not the account
router) since it destroys the authenticated identity itself.

```javascript
const deleteAccount = async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, ... });

  const userId = req.user._id;

  // 1. pull every certificate and destroy its cloudinary asset
  const certificates = await Certificate.find({ userId }).select("publicId");
  await Promise.all(certificates.map(async (certificate) => {
    try {
      await cloudinary.uploader.destroy(certificate.publicId);
    } catch (cloudError) {
      console.error(`Failed to destroy cloudinary asset ...`, cloudError.message);
    }
  }));

  // 2. drop the documents
  await Certificate.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  // 3. destroy the session so the browser cannot keep using the old cookie
  req.logout((logoutErr) => { ... req.session.destroy((sessionErr) => {
    res.clearCookie("connect.sid", { path: "/", httpOnly: true, ... });
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  })});
};
```

Ordering notes:
- **Cloudinary first, then Mongo.** Each `destroy` is wrapped in its own
  `try/catch` inside `Promise.all` so one failing asset cannot abort the
  remaining deletions — otherwise a single Cloudinary error would leave the
  account half-deleted and the user still logged in.
- `deleteMany({ userId })` instead of per-document deletes: certificates have no
  dependent records.
- The user id comes from `req.user._id` (Passport), **never** from
  `req.body`/`req.params`, so a user can only ever delete their own account.
- The `clearCookie` options are byte-identical to `logout` — a mismatch on
  `path`/`sameSite`/`secure` leaves the old `connect.sid` cookie in the browser.
- `req.logout` + `req.session.destroy` is mandatory here: the user document is
  already gone, so a surviving session would fail on the next `ensureAuthenticated`
  lookup instead of logging them out cleanly.

## 2. Route — `Backend/src/route/AuthRoute.js`

```javascript
const { githubCallback, getProfile, logout, deleteAccount } = require("../controller/AuthController");

router.delete("/delete-account", ensureAuthenticated, deleteAccount);
```

The router is mounted at `/api/auth` in `app.js`, so the full path is
`DELETE /api/auth/delete-account`. `DELETE` is already in the CORS `methods`
allow-list, and no new middleware is needed.

## 3. Frontend — `frontend/src/zustand/useAuthStore.js`

The call lives in the **auth** store (not `useUtilityStore`) because the
response also logs the user out:

```javascript
deleteAccount: async () => {
  set({ loading: true, error: null });
  try {
    const response = await api.delete("/auth/delete-account");
    set({ user: null, isAuthenticated: false, loading: false, error: null });
    return { success: true, message: response.data?.message || "Account deleted successfully" };
  } catch (err) {
    set({ loading: false });
    return { success: false, error: err.response?.data?.message || "Failed to delete account" };
  }
},
```

It **returns** `{ success, error }` instead of throwing, matching `logout` and
`updateAccountDetails` — callers must check `res.success`. Note it sets
`loading: false` on both paths; leaving it `true` would strand the whole app on
`AccountSkelton` (`App.jsx` returns the skeleton whenever `loading && !onPublicRoute`).

## 4. Frontend — `frontend/src/Screen/Setting.jsx`

The Danger Zone card is a two-step confirm, because a single stray click must
never destroy a profile:

- First click on **Delete Account** only sets `confirmDeleteAccount = true`; the
  row is swapped for **Cancel** + **Yes, Delete Account** and a red
  "this cannot be undone" warning is revealed.
- **Cancel** (or a successful delete) resets `confirmDeleteAccount`.
- **Yes, Delete Account** calls `handleDeleteAccount()`, which shows a
  `Loader2` spinner via `deletingAccount` and disables both buttons, so a
  double-click cannot fire two deletes.
- On success it toasts the server message and does
  `navigate('/Authorization', { replace: true })`. Belt-and-braces: the store
  already nulled `user`, so `ProtectedMiddleware` would redirect on its own —
  the explicit `replace: true` avoids leaving the dead account in history.
- On failure it clears both flags and toasts `res.error`, so the card returns to
  its default state and the user can retry.

## 5. Flow summary

1. `Setting.jsx` → **Delete Account** → inline confirm → **Yes, Delete Account**.
2. `useAuthStore.deleteAccount()` → `DELETE /api/auth/delete-account`.
3. `ensureAuthenticated` resolves `req.user` from the session cookie.
4. `deleteAccount` destroys each certificate's Cloudinary asset, then
   `Certificate.deleteMany` + `User.findByIdAndDelete`.
5. Session is destroyed and `connect.sid` cleared; `200 { success: true }`.
6. Store clears `user`/`isAuthenticated`; UI navigates to `/Authorization`.

## 6. Gotchas
- The endpoint is **not idempotent from the client's view**: a second call
  returns `401` because the session no longer exists, even though the first call
  already succeeded. Never retry it automatically.
- Re-logging in with the same GitHub account **recreates** the user from
  `processGithubProfile` (a fresh `User.create`), and the old certificates are
  gone — deletion is not a soft-delete/restore flow.
- The shared portfolio URL (`/api/user/portfolio/:username`) starts 404ing
  immediately after deletion because `GetPublicPortfolio` can no longer find the
  user.
- Any new per-user collection added later must be cleaned up inside
  `deleteAccount`, or it will be orphaned in Mongo.

