# Home drawer demo data (US – NAD / Census / Overture)

Static JSON files for the **News** and **Upcoming events** tabs in the home drawer when running a US-focused demo.

## Usage

In Railway (or any env), set:

- **`HOME_DRAWER_NEWS_URL`** = `https://<your-app-domain>/demo/home-drawer-news.json`
- **`HOME_DRAWER_EVENTS_URL`** = `https://<your-app-domain>/demo/home-drawer-events.json`

Replace `<your-app-domain>` with your frontend’s public URL (e.g. `mes-adresses-production.up.railway.app`).

If these variables are not set, the app uses the default sources (Mattermost for news, bal-admin for events).

## Files

| File | Description |
|------|-------------|
| `home-drawer-news.json` | Array of `{ id, message, date }`. Placeholder items for NAD, Census Bureau, and Overture. |
| `home-drawer-events.json` | Array of events (same shape as bal-admin events). Placeholder workshops/calls for Census, Overture, and NAD. |

You can edit these files or point the env vars at your own JSON endpoints (e.g. APIs or proxies for Census, Overture, or NAD).
