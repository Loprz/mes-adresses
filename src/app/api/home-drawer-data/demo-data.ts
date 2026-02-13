import type { NewsType } from "@/lib/mattermost/type";
import type { EventType } from "@/lib/bal-admin/type";
import {
  EventTypeTagEnum,
  EventTypeTypeEnum,
} from "@/lib/bal-admin/type";

/** US demo news (NAD, Census, Overture) – used when env vars are unset and static /demo/ is not available (e.g. Railway). */
export const demoNews: NewsType[] = [
  {
    id: "nad-storymap",
    message:
      "**Getting to know the National Address Database (NAD)** – Explore the NAD program, data quality, and how state and local agencies use it in this [interactive StoryMap](https://storymaps.arcgis.com/stories/9490f773f65d4c6aa8b79facc528a661).",
    date: "2026-01-27T12:00:00.000Z",
  },
  {
    id: "census-academy-webinars",
    message:
      "**Census Academy – Upcoming webinars** – Live classes on NAICS & QWI, ACS PUMS, margins of error, and more. [View upcoming webinars](https://www.census.gov/data/academy/webinars/upcoming.html) and register.",
    date: "2026-01-27T09:00:00.000Z",
  },
  {
    id: "census-api-update",
    message:
      "**Census Bureau API** – Request a [free API key](https://api.census.gov/data/key_signup.html) for higher limits. Discovery and data releases at [api.census.gov](https://api.census.gov/data.html).",
    date: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "overture-maps",
    message:
      "**Overture Maps Foundation** – Places and buildings APIs in production. Open, community-built base map data for the Americas and worldwide. [overturemaps.org](https://overturemaps.org/).",
    date: "2026-01-10T14:00:00.000Z",
  },
];

/** US demo events (Census Academy webinars) – used when env vars are unset and static /demo/ is not available. */
export const demoEvents: EventType[] = [
  {
    id: "census-naics-qwi-feb2026",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    title: "Unlocking NAICS 5- and 6-Digit Details in the QWI Data Set",
    subtitle: "Census Academy Webinar",
    description:
      "Diving deeper with 5- and 6-digit NAICS with the Quarterly Workforce Indicators data set.",
    type: EventTypeTypeEnum.FORMATION,
    target: "Data users and analysts",
    date: "2026-02-18",
    tags: [EventTypeTagEnum.TECHNIQUE],
    isOnlineOnly: true,
    isSubscriptionClosed: false,
    startHour: "14:00",
    endHour: "15:00",
    href: "https://www.census.gov/data/academy/webinars/upcoming.html",
  },
  {
    id: "census-pums-feb2026",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    title: "Introduction to the ACS Public Use Microdata Sample (PUMS) Files",
    subtitle: "Census Academy Webinar",
    description:
      "We will share the powerful MDAT tool with a live demonstration.",
    type: EventTypeTypeEnum.FORMATION,
    target: "Researchers and data users",
    date: "2026-02-25",
    tags: [EventTypeTagEnum.TECHNIQUE],
    isOnlineOnly: true,
    isSubscriptionClosed: false,
    startHour: "14:00",
    endHour: "15:00",
    href: "https://www.census.gov/data/academy/webinars/upcoming.html",
  },
  {
    id: "census-acs-moe-mar2026",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    title: "Using American Community Survey Estimates and Margins of Error",
    subtitle: "Census Academy Webinar",
    description:
      "Explore the importance of margins of error (MOE) that are provided for every American Community Survey (ACS) estimate.",
    type: EventTypeTypeEnum.FORMATION,
    target: "Data users and analysts",
    date: "2026-03-11",
    tags: [EventTypeTagEnum.TECHNIQUE],
    isOnlineOnly: true,
    isSubscriptionClosed: false,
    startHour: "14:00",
    endHour: "15:00",
    href: "https://www.census.gov/data/academy/webinars/upcoming.html",
  },
  {
    id: "census-qwi-small-state-mar2026",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    title: "The Strengths of QWI and Administrative Data in a Small State",
    subtitle: "Census Academy Webinar",
    description:
      "Advantages that QWI and administrative data generally have compared to survey-based estimates in a small state context.",
    type: EventTypeTypeEnum.FORMATION,
    target: "State and local data users",
    date: "2026-03-18",
    tags: [EventTypeTagEnum.TECHNIQUE],
    isOnlineOnly: true,
    isSubscriptionClosed: false,
    startHour: "14:00",
    endHour: "15:00",
    href: "https://www.census.gov/data/academy/webinars/upcoming.html",
  },
];
