import path from "node:path";

import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";

const TEMPLATE = "public/assets/root-and-reels-ticket.png";
const FONT = "assets/fonts/LiberationSans-Bold.ttf";
/** Scaled for 6000×2559 template (was 1600×682 → ×3.75). */
const BOX = { x: 4519, y: 90, w: 735, h: 158, r: 30, size: 64 } as const;

export class TicketRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TicketRenderError";
  }
}

export async function renderRootsReelsTicket(serialNumber: string) {
  const cwd = process.cwd();
  const fontPath = path.join(cwd, FONT);
  const templatePath = path.join(cwd, TEMPLATE);

  if (!GlobalFonts.has("Ticket")) {
    try {
      GlobalFonts.registerFromPath(fontPath, "Ticket");
    } catch (error) {
      throw new TicketRenderError(
        `Could not load ticket font at ${fontPath}: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
    }
    if (!GlobalFonts.has("Ticket")) {
      throw new TicketRenderError(`Could not load ticket font at ${fontPath}`);
    }
  }

  let image;
  try {
    image = await loadImage(templatePath);
  } catch {
    throw new TicketRenderError(`Could not load ticket template at ${templatePath}`);
  }

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const label = `SR. NO. ${serialNumber.trim() || "RR2-001"}`;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(BOX.x, BOX.y, BOX.w, BOX.h, BOX.r);
  ctx.fill();

  ctx.fillStyle = "#1B3644";
  ctx.font = `bold ${BOX.size}px Ticket`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, BOX.x + BOX.w / 2, BOX.y + BOX.h / 2);

  return canvas.toBuffer("image/jpeg", 92);
}
