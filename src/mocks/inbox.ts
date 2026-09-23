export type MailAccount = {
  id: string;
  provider: string;
  address: string;
  colour: string;
  status: "Connected" | "Attention";
};
export type Message = {
  id: string;
  account: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  folder: string;
  category: string;
  body: string;
  attachment?: string;
};

export const initialAccounts: MailAccount[] = [
  {
    id: "google",
    provider: "Google Workspace",
    address: "care@harbourcare.com.au",
    colour: "#4285f4",
    status: "Connected",
  },
  {
    id: "outlook",
    provider: "Microsoft 365",
    address: "accounts@harbourcare.com.au",
    colour: "#1473e6",
    status: "Connected",
  },
  {
    id: "zoho",
    provider: "Zoho Mail",
    address: "people@harbourcare.com.au",
    colour: "#e94b4b",
    status: "Connected",
  },
];
export const initialMessages: Message[] = [
  {
    id: "m1",
    account: "google",
    from: "Maya Singh",
    email: "maya@coordination.org.au",
    subject: "Updated support schedule — Ethan Carter",
    preview:
      "I’ve attached the updated schedule of supports following our review…",
    time: "9:42 am",
    unread: true,
    starred: true,
    folder: "Inbox",
    category: "Participant",
    attachment: "Schedule of Supports — Aug 2026.pdf",
    body: "I’ve attached the updated schedule of supports following our review with Ethan and his family. The new schedule reflects his preference for community activities on Tuesday afternoons. Please review the changes before next week’s roster is published.",
  },
  {
    id: "m2",
    account: "outlook",
    from: "Plan Partners",
    email: "remittance@planpartners.com.au",
    subject: "Remittance advice #RA-88421",
    preview: "Payment of $3,184.25 has been processed for the attached claims…",
    time: "8:16 am",
    unread: true,
    starred: false,
    folder: "Inbox",
    category: "Finance",
    attachment: "RA-88421.pdf",
    body: "Payment of $3,184.25 has been processed. The remittance advice is attached and includes the matched participant claim references.",
  },
  {
    id: "m3",
    account: "zoho",
    from: "Oliver Moore",
    email: "oliver.moore@example.com",
    subject: "Onboarding documents completed",
    preview:
      "I have uploaded my screening check, super choice and tax declaration…",
    time: "Yesterday",
    unread: false,
    starred: false,
    folder: "Inbox",
    category: "People",
    body: "I have completed the onboarding portal and uploaded my screening check, super choice form and tax declaration. Please let me know if anything else is required.",
  },
  {
    id: "m4",
    account: "google",
    from: "NDIS Commission",
    email: "notifications@ndiscommission.gov.au",
    subject: "Provider portal maintenance completed",
    preview:
      "The scheduled provider portal maintenance has now been completed…",
    time: "Yesterday",
    unread: false,
    starred: false,
    folder: "Inbox",
    category: "Compliance",
    body: "The scheduled provider portal maintenance has now been completed. Services are available and providers can resume normal portal activity.",
  },
  {
    id: "m5",
    account: "outlook",
    from: "Grace Martin",
    email: "grace.martin@example.com",
    subject: "Thursday support time",
    preview: "Would it be possible to start a little later this Thursday?",
    time: "30 Jul",
    unread: false,
    starred: true,
    folder: "Follow up",
    category: "Participant",
    body: "Would it be possible to start a little later this Thursday? A 10:30 am start would work better for my appointment schedule.",
  },
  {
    id: "m6",
    account: "zoho",
    from: "Provider.ai Team",
    email: "hello@provider.ai",
    subject: "Draft: worker onboarding reminder",
    preview: "Reminder to complete your remaining onboarding documents…",
    time: "29 Jul",
    unread: false,
    starred: false,
    folder: "Drafts",
    category: "People",
    body: "Reminder to complete your remaining onboarding documents before your proposed commencement date.",
  },
];

export const createMockImapAccount = (colour: string): MailAccount => ({
  id: "imap",
  provider: "IMAP / SMTP",
  address: "admin@provider.org.au",
  colour,
  status: "Connected",
});
