import fs from "node:fs";
import path from "node:path";

import PDFDocument from "pdfkit";

import {
  AGE_GROUPS,
  ATTENDEE_TYPES,
  COMING_WITH_OPTIONS,
  HEARD_FROM_OPTIONS,
  INTEREST_OPTIONS,
  type AdminRegistration,
} from "@/types/registration";
import {
  SURVEY_NICHES,
  SURVEY_PLATFORMS,
  type SurveyApplication,
} from "@/types/survey";

type FieldRow = { label: string; value: string };

function labelFromOptions(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
) {
  if (!value) return "—";
  return options.find((item) => item.value === value)?.label ?? value;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAmountPaise(amountPaise: number, currency: string) {
  const amount = amountPaise / 100;
  return `${currency} ${amount.toFixed(2)}`;
}

function text(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function drawHeader(
  doc: PDFKit.PDFDocument,
  title: string,
  subtitle: string,
  downloadedAt: string,
) {
  const logoPath = path.join(process.cwd(), "public/assets/brand-logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 32, { width: 42, height: 42 });
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("#11110f")
    .text("Jhashree Productions", 96, 36, { continued: false });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#6c665e")
    .text("Roots & Reels Season 2 · Organizer export", 96, 56);

  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor("#11110f")
    .text(title, 40, 92);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#4e4943")
    .text(subtitle, 40, 116)
    .text(`Downloaded: ${downloadedAt}`, 40, 132);

  doc
    .moveTo(40, 152)
    .lineTo(doc.page.width - 40, 152)
    .strokeColor("#c45a3a")
    .lineWidth(1.5)
    .stroke();

  doc.y = 168;
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > doc.page.height - 48) {
    doc.addPage();
    doc.y = 40;
  }
}

function drawSectionTitle(doc: PDFKit.PDFDocument, title: string) {
  ensureSpace(doc, 36);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#c45a3a")
    .text(title, 40, doc.y);
  doc.moveDown(0.4);
}

function drawRecordCard(
  doc: PDFKit.PDFDocument,
  heading: string,
  fields: FieldRow[],
) {
  const contentWidth = doc.page.width - 80;
  const colWidth = contentWidth / 2 - 12;

  ensureSpace(doc, 40);
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#11110f")
    .text(heading, 40, doc.y, { width: contentWidth });
  doc.moveDown(0.35);

  for (let i = 0; i < fields.length; i += 2) {
    const left = fields[i];
    const right = fields[i + 1];
    ensureSpace(doc, 40);

    const rowTop = doc.y;
    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .fillColor("#9d341f")
      .text(left.label.toUpperCase(), 40, rowTop, { width: colWidth });
    const leftBottom = doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#24221f")
      .text(left.value, 40, rowTop + 11, { width: colWidth }).y;

    let rightBottom = rowTop;
    if (right) {
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .fillColor("#9d341f")
        .text(right.label.toUpperCase(), 40 + colWidth + 16, rowTop, {
          width: colWidth,
        });
      rightBottom = doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#24221f")
        .text(right.value, 40 + colWidth + 16, rowTop + 11, {
          width: colWidth,
        }).y;
    }

    doc.y = Math.max(leftBottom, rightBottom) + 8;
  }

  doc
    .moveTo(40, doc.y)
    .lineTo(doc.page.width - 40, doc.y)
    .strokeColor("#e5ddd0")
    .lineWidth(0.6)
    .stroke();
  doc.moveDown(0.7);
}

function surveyFields(app: SurveyApplication): FieldRow[] {
  const niche =
    app.primaryNiche === "other" && app.primaryNicheOther
      ? app.primaryNicheOther
      : labelFromOptions(SURVEY_NICHES, app.primaryNiche);

  return [
    { label: "Full name", value: text(app.fullName) },
    { label: "Contact number", value: text(app.contactNumber) },
    { label: "Email", value: text(app.email) },
    { label: "Status", value: text(app.status) },
    { label: "Primary niche", value: niche },
    {
      label: "Primary platform",
      value: labelFromOptions(SURVEY_PLATFORMS, app.primaryPlatform),
    },
    { label: "Instagram handle", value: text(app.instagramHandle) },
    { label: "Instagram followers", value: text(app.instagramFollowers) },
    { label: "YouTube channel", value: text(app.youtubeChannel) },
    { label: "YouTube subscribers", value: text(app.youtubeSubscribers) },
    { label: "Facebook page", value: text(app.facebookPage) },
    { label: "Has sponsored work", value: text(app.hasSponsoredWork) },
    { label: "Sample promo links", value: text(app.samplePromoLinks) },
    { label: "Submitted at", value: formatDate(app.createdAt) },
    { label: "What makes content unique", value: text(app.contentUnique) },
    { label: "How brands benefit", value: text(app.brandBenefit) },
    {
      label: "Brand integration style",
      value: text(app.brandIntegrationStyle),
    },
    { label: "Why participate", value: text(app.whyParticipate) },
  ];
}

function registrationFields(reg: AdminRegistration): FieldRow[] {
  const interests = reg.interests
    .map((value) => labelFromOptions(INTEREST_OPTIONS, value))
    .join(", ");

  const attendeeType =
    reg.attendeeType === "other" && reg.attendeeTypeOther
      ? reg.attendeeTypeOther
      : labelFromOptions(ATTENDEE_TYPES, reg.attendeeType);

  const heardFrom =
    reg.heardFrom === "other" && reg.heardFromOther
      ? reg.heardFromOther
      : labelFromOptions(HEARD_FROM_OPTIONS, reg.heardFrom);

  const ticketCodes = [reg.registrationCode, reg.registrationCodeGuest]
    .filter(Boolean)
    .join(" · ");

  return [
    { label: "Full name", value: text(reg.fullName) },
    { label: "Status", value: text(reg.status) },
    { label: "Contact number", value: text(reg.contactNumber) },
    { label: "Email", value: text(reg.email) },
    { label: "Ticket codes", value: text(ticketCodes || null) },
    { label: "Passes count", value: text(reg.passesCount) },
    {
      label: "Promo",
      value:
        reg.promo === "bogo_first_50" ? "BUY 1 GET 1 FREE" : text(reg.promo),
    },
    { label: "BOGO slot", value: text(reg.bogoSlot) },
    {
      label: "Amount paid",
      value: formatAmountPaise(reg.amountPaise, reg.currency),
    },
    { label: "Razorpay payment ID", value: text(reg.razorpayPaymentId) },
    { label: "Paid at", value: formatDate(reg.paidAt) },
    {
      label: "Age group",
      value: labelFromOptions(AGE_GROUPS, reg.ageGroup),
    },
    { label: "City", value: text(reg.city) },
    { label: "District", value: text(reg.district) },
    { label: "State", value: text(reg.state) },
    { label: "Attendee type", value: attendeeType },
    {
      label: "Coming with",
      value: labelFromOptions(COMING_WITH_OPTIONS, reg.comingWith),
    },
    { label: "Heard from", value: heardFrom },
    { label: "Interests", value: text(interests || null) },
    { label: "Created at", value: formatDate(reg.createdAt) },
  ];
}

async function renderPdf(
  build: (doc: PDFKit.PDFDocument) => void,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    info: {
      Title: "Jhashree Productions Export",
      Author: "Jhashree Productions",
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  build(doc);
  doc.end();
  return done;
}

export async function buildSurveyApplicationsPdf(
  applications: SurveyApplication[],
) {
  const downloadedAt = formatDate(new Date().toISOString());

  return renderPdf((doc) => {
    drawHeader(
      doc,
      "Survey Applications",
      `${applications.length} creator application${applications.length === 1 ? "" : "s"}`,
      downloadedAt,
    );

    if (applications.length === 0) {
      doc.font("Helvetica").fontSize(11).text("No survey applications found.");
      return;
    }

    applications.forEach((app, index) => {
      drawRecordCard(
        doc,
        `${index + 1}. ${app.fullName}`,
        surveyFields(app),
      );
    });
  });
}

export async function buildRegistrationsPdf(
  registrations: AdminRegistration[],
) {
  const downloadedAt = formatDate(new Date().toISOString());
  const paid = registrations.filter((item) => item.status === "paid");
  const pending = registrations.filter((item) => item.status === "pending");
  const other = registrations.filter(
    (item) => item.status !== "paid" && item.status !== "pending",
  );

  return renderPdf((doc) => {
    drawHeader(
      doc,
      "Event Registrations",
      `Paid: ${paid.length} · Pending: ${pending.length} · Other: ${other.length} · Total: ${registrations.length}`,
      downloadedAt,
    );

    if (registrations.length === 0) {
      doc.font("Helvetica").fontSize(11).text("No registrations found.");
      return;
    }

    if (paid.length > 0) {
      drawSectionTitle(doc, `Paid registrations (${paid.length})`);
      paid.forEach((reg, index) => {
        drawRecordCard(
          doc,
          `${index + 1}. ${reg.fullName}`,
          registrationFields(reg),
        );
      });
    }

    if (pending.length > 0) {
      drawSectionTitle(doc, `Pending registrations (${pending.length})`);
      pending.forEach((reg, index) => {
        drawRecordCard(
          doc,
          `${index + 1}. ${reg.fullName}`,
          registrationFields(reg),
        );
      });
    }

    if (other.length > 0) {
      drawSectionTitle(doc, `Other statuses (${other.length})`);
      other.forEach((reg, index) => {
        drawRecordCard(
          doc,
          `${index + 1}. ${reg.fullName}`,
          registrationFields(reg),
        );
      });
    }
  });
}
