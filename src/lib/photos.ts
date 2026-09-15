/**
 * Locked preview-v3.1 Unsplash photo IDs (work context only).
 * Served from images.unsplash.com through next/image (optimizer on our origin).
 * Direct CDN URLs remain as the source; we do not rehost the files.
 */
export const UNSPLASH_HOST = "images.unsplash.com";

export const PHOTOS = {
  officeTall: {
    id: "photo-1497366216548-37526070297c",
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&h=1200&q=80",
    width: 450,
    height: 600,
  },
  warehouse: {
    id: "photo-1586528116311-ad8dd3c8310d",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&h=500&q=80",
    width: 350,
    height: 250,
  },
  workshop: {
    id: "photo-1504917595217-d4dc5ebe6122",
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&h=500&q=80",
    width: 350,
    height: 250,
  },
  teamMeeting: {
    id: "photo-1521737711867-e3b97375f902",
    src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&h=700&q=80",
    width: 450,
    height: 350,
  },
  officeWide: {
    id: "photo-1497366811353-6870744d04b2",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&h=700&q=80",
    width: 1600,
    height: 700,
  },
  officePortrait: {
    id: "photo-1497366811353-6870744d04b2",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&h=1100&q=80",
    width: 450,
    height: 560,
  },
  cityTower: {
    id: "photo-1486406146926-c627a92ad1ab",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&h=500&q=80",
    width: 350,
    height: 250,
  },
  // photo-1467260200982-5ba258642c12 404s on Unsplash; shot-c uses the workshop ID.
  cityStreet: {
    id: "photo-1504917595217-d4dc5ebe6122",
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&h=500&q=80",
    width: 350,
    height: 250,
  },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function listingPhotoForCategory(category: string) {
  switch (category) {
    case "logistics":
    case "driver":
      return PHOTOS.warehouse;
    case "manufacturing":
    case "trades":
    case "construction":
    case "facility":
      return PHOTOS.workshop;
    case "hospitality":
    case "healthcare":
      return PHOTOS.teamMeeting;
    default:
      return PHOTOS.officeWide;
  }
}
