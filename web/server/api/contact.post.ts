import { createClient } from "@sanity/client";

type TemplateKey = "bookSession" | "generalInquiry" | "custom";
type SubjectType = "book-session" | "general-inquiry" | "user-input";

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  subjectType?: SubjectType | TemplateKey | string;
  message?: string;
}

interface ResponseTemplate {
  title: string;
  message: string;
}

interface ContactPageSettings {
  formEndpoint: string;
  template: ResponseTemplate;
}

const DEFAULT_RESPONSE_TEMPLATES: Record<TemplateKey, ResponseTemplate> = {
  bookSession: {
    title: "Session Request Received",
    message:
      "Thanks for reaching out about booking a session. We received your request and will follow up shortly.",
  },
  generalInquiry: {
    title: "Inquiry Received",
    message:
      "Thank you for your message. We received your inquiry and will get back to you soon.",
  },
  custom: {
    title: "Message Received",
    message:
      "Thanks for contacting us. Your message was sent successfully and we will respond as soon as possible.",
  },
};

const DEFAULT_FORM_ENDPOINT = "https://getform.io/f/a17a2715-d7ee-4ac4-8fcb-12f1eed43b2c";

const SUBJECT_TYPE_TO_TEMPLATE: Record<string, TemplateKey> = {
  "book-session": "bookSession",
  "general-inquiry": "generalInquiry",
  "user-input": "custom",
  bookSession: "bookSession",
  generalInquiry: "generalInquiry",
  custom: "custom",
};

const SUBJECT_TYPE_LABEL: Record<string, string> = {
  "book-session": "Book a Session",
  "general-inquiry": "General Inquiry",
  "user-input": "User input",
  bookSession: "Book a Session",
  generalInquiry: "General Inquiry",
  custom: "User input",
};

function sanitizeText(value: string | undefined, maxLength: number) {
  return (value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sanitizeMultilineText(value: string | undefined, maxLength: number) {
  return (value || "").trim().slice(0, maxLength);
}

function getTemplateKey(subjectType: string | undefined): TemplateKey {
  return SUBJECT_TYPE_TO_TEMPLATE[subjectType || ""] || "custom";
}

async function fetchContactPageSettingsFromSanity(
  projectId: string,
  dataset: string,
  apiToken: string | undefined,
  key: TemplateKey
): Promise<ContactPageSettings> {
  if (!projectId || projectId === "your-project-id" || !dataset) {
    return {
      formEndpoint: DEFAULT_FORM_ENDPOINT,
      template: DEFAULT_RESPONSE_TEMPLATES[key],
    };
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: apiToken || undefined,
      perspective: "published",
    });

    const query = `*[_type == "contactPage"][0]{
      formEndpoint,
      responseTemplates {
        bookSession { title, message },
        generalInquiry { title, message },
        custom { title, message }
      }
    }`;
    const data = await client.fetch<{
      formEndpoint?: string;
      responseTemplates?: Record<string, ResponseTemplate>;
    }>(query);
    const fromSanity = data?.responseTemplates?.[key];
    return {
      formEndpoint: data?.formEndpoint || DEFAULT_FORM_ENDPOINT,
      template: {
        title: fromSanity?.title || DEFAULT_RESPONSE_TEMPLATES[key].title,
        message: fromSanity?.message || DEFAULT_RESPONSE_TEMPLATES[key].message,
      },
    };
  } catch (error) {
    console.error("Failed to fetch contact response template from Sanity", error);
    return {
      formEndpoint: DEFAULT_FORM_ENDPOINT,
      template: DEFAULT_RESPONSE_TEMPLATES[key],
    };
  }
}

async function sendResendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string[];
    subject: string;
    text: string;
    reply_to?: string;
  }
) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error (${response.status}): ${errorText}`);
  }
}

async function forwardToFormEndpoint(formEndpoint: string, payload: Record<string, string>) {
  const response = await fetch(formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Form endpoint error (${response.status}): ${errorText}`);
  }
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const body = await readBody<ContactRequestBody>(event);

  const name = sanitizeText(body?.name, 120);
  const email = sanitizeText(body?.email, 254);
  const subject = sanitizeText(body?.subject, 180);
  const message = sanitizeMultilineText(body?.message, 5000);
  const subjectType = sanitizeText(body?.subjectType, 64);

  if (!name || !email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required form fields.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Please provide a valid email address.",
    });
  }

  const resendApiKey = (runtimeConfig.resendApiKey as string) || "";
  const notifyToEmail = runtimeConfig.contactNotificationEmail as string;
  const fromEmail = runtimeConfig.contactFromEmail as string;
  const replyToEmail = runtimeConfig.contactReplyToEmail as string;

  const templateKey = getTemplateKey(subjectType);
  const subjectLabel = SUBJECT_TYPE_LABEL[subjectType] || "Custom";
  const contactPageSettings = await fetchContactPageSettingsFromSanity(
    runtimeConfig.public.sanityProjectId as string,
    runtimeConfig.public.sanityDataset as string,
    runtimeConfig.sanityApiToken as string,
    templateKey
  );
  const responseTemplate = contactPageSettings.template;
  const fallbackPayload = {
    name,
    email,
    subject,
    subjectType: subjectLabel,
    message,
  };

  // Fallback mode: forward to existing endpoint to avoid breaking form submissions.
  if (!resendApiKey || !notifyToEmail || !fromEmail) {
    try {
      await forwardToFormEndpoint(contactPageSettings.formEndpoint, fallbackPayload);
      return {
        ok: true,
        subjectType: templateKey,
        delivery: "form-endpoint-fallback",
      };
    } catch (error) {
      console.error("Contact fallback delivery failed", error);
      throw createError({
        statusCode: 502,
        statusMessage:
          "Contact delivery is not configured. Add RESEND_API_KEY, CONTACT_NOTIFICATION_EMAIL, and CONTACT_FROM_EMAIL.",
      });
    }
  }

  const internalSubject = `New contact form submission: ${subject}`;
  const internalText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject Type: ${subjectLabel}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const userSubject = responseTemplate.title;
  const userText = [
    `Hi ${name},`,
    "",
    responseTemplate.message,
    "",
    `Subject: ${subject}`,
    "",
    "Message received:",
    message,
    "",
    "MelShotya Photography",
  ].join("\n");

  try {
    await sendResendEmail(resendApiKey, {
      from: fromEmail,
      to: [notifyToEmail],
      subject: internalSubject,
      text: internalText,
      reply_to: email,
    });

    await sendResendEmail(resendApiKey, {
      from: fromEmail,
      to: [email],
      subject: userSubject,
      text: userText,
      reply_to: replyToEmail || notifyToEmail,
    });
  } catch (error) {
    console.error("Contact email delivery failed", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Unable to send email right now. Please try again shortly.",
    });
  }

  return {
    ok: true,
    subjectType: templateKey,
  };
});
