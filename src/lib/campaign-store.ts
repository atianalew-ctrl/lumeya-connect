// Simple in-memory store for campaign collaboration workflow
// Will be replaced with database when Lovable Cloud is enabled

export interface Application {
  id: string;
  opportunityId: number;
  opportunityTitle: string;
  brand: string;
  creatorId: number;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  portfolioLink: string;
  message: string;
  status: "pending" | "accepted" | "declined";
  submittedAt: string;
}

export interface ContentSubmission {
  id: string;
  fileName: string;
  caption: string;
  status: "pending" | "approved" | "revision";
  comment?: string;
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "brand" | "creator";
  senderName: string;
  text: string;
  timestamp: string;
}

export type PaymentStatus = "awaiting" | "secured" | "released";

export interface PaymentInfo {
  budget: number;
  platformFeePercent: number;
  platformFee: number;
  creatorPayout: number;
  status: PaymentStatus;
  fundedAt?: string;
  releasedAt?: string;
}

export interface Campaign {
  id: string;
  opportunityTitle: string;
  brand: string;
  creatorName: string;
  creatorAvatar: string;
  deadline: string;
  deliverables: string[];
  status: "active" | "completed";
  submissions: ContentSubmission[];
  messages: ChatMessage[];
  payment: PaymentInfo;
}

// In-memory state
let applications: Application[] = [];
let campaigns: Campaign[] = [];

// Seed some demo applications
const seedApplications = (): Application[] => [
  {
    id: "app-1",
    opportunityId: 1,
    opportunityTitle: "UGC Creator for Skincare Brand",
    brand: "GlowCo",
    creatorId: 1,
    creatorName: "Mia Chen",
    creatorRole: "UGC Creator",
    creatorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mia",
    portfolioLink: "https://miachen.creator.co",
    message: "I'd love to work on this! I have 3+ years of skincare UGC experience and have worked with similar brands.",
    status: "pending",
    submittedAt: new Date().toISOString(),
  },
  {
    id: "app-2",
    opportunityId: 1,
    opportunityTitle: "UGC Creator for Skincare Brand",
    brand: "GlowCo",
    creatorId: 7,
    creatorName: "Sakura Tanaka",
    creatorRole: "Influencer",
    creatorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sakura",
    portfolioLink: "https://sakura.beauty",
    message: "My audience is 80% women aged 20-35 who are passionate about skincare. Perfect match for GlowCo!",
    status: "pending",
    submittedAt: new Date().toISOString(),
  },
  {
    id: "app-3",
    opportunityId: 2,
    opportunityTitle: "Product Photographer Needed",
    brand: "Brew & Co.",
    creatorId: 2,
    creatorName: "Jordan Blake",
    creatorRole: "Photographer",
    creatorAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan",
    portfolioLink: "https://jordanblake.photo",
    message: "Product photography is my specialty. I've shot for multiple food and beverage brands in NYC.",
    status: "pending",
    submittedAt: new Date().toISOString(),
  },
];

let seeded = false;

function ensureSeeded() {
  if (!seeded) {
    applications = seedApplications();
    seeded = true;
  }
}

// Applications
export function getApplications(): Application[] {
  ensureSeeded();
  return [...applications];
}

export function getApplicationsByOpportunity(oppId: number): Application[] {
  ensureSeeded();
  return applications.filter((a) => a.opportunityId === oppId);
}

export function addApplication(app: Omit<Application, "id" | "status" | "submittedAt">): Application {
  ensureSeeded();
  const newApp: Application = {
    ...app,
    id: `app-${Date.now()}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  applications.push(newApp);
  return newApp;
}

export function updateApplicationStatus(appId: string, status: "accepted" | "declined") {
  ensureSeeded();
  const app = applications.find((a) => a.id === appId);
  if (app) {
    app.status = status;
    if (status === "accepted") {
      createCampaignFromApplication(app);
    }
  }
}

// Campaigns
function createCampaignFromApplication(app: Application) {
  const budget = 800; // Default budget, would come from opportunity in real app
  const platformFeePercent = 20;
  const platformFee = budget * (platformFeePercent / 100);
  const creatorPayout = budget - platformFee;

  const campaign: Campaign = {
    id: `camp-${Date.now()}`,
    opportunityTitle: app.opportunityTitle,
    brand: app.brand,
    creatorName: app.creatorName,
    creatorAvatar: app.creatorAvatar,
    deadline: "Apr 1, 2026",
    deliverables: [
      "5 short-form videos (30–60s each)",
      "Vertical format for TikTok & Reels",
      "Raw footage files",
      "2 rounds of revisions",
    ],
    status: "active",
    submissions: [],
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: "brand",
        senderName: app.brand,
        text: `Welcome ${app.creatorName}! Excited to work with you on this project. Please fund the campaign to get started!`,
        timestamp: new Date().toISOString(),
      },
    ],
    payment: {
      budget,
      platformFeePercent,
      platformFee,
      creatorPayout,
      status: "awaiting",
    },
  };
  campaigns.push(campaign);
}

export function getCampaigns(): Campaign[] {
  return [...campaigns];
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns.find((c) => c.id === id);
}

export function addChatMessage(campaignId: string, msg: Omit<ChatMessage, "id" | "timestamp">) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (campaign) {
    campaign.messages.push({
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }
}

export function addSubmission(campaignId: string, sub: { fileName: string; caption: string }) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (campaign) {
    campaign.submissions.push({
      id: `sub-${Date.now()}`,
      ...sub,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });
  }
}

export function reviewSubmission(campaignId: string, subId: string, action: "approved" | "revision", comment?: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (campaign) {
    const sub = campaign.submissions.find((s) => s.id === subId);
    if (sub) {
      sub.status = action;
      sub.comment = comment;
    }
    // Check if all approved → mark campaign complete & release payment
    if (campaign.submissions.length > 0 && campaign.submissions.every((s) => s.status === "approved")) {
      campaign.status = "completed";
      if (campaign.payment.status === "secured") {
        campaign.payment.status = "released";
        campaign.payment.releasedAt = new Date().toISOString();
      }
    }
  }
}

export function fundCampaign(campaignId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (campaign && campaign.payment.status === "awaiting") {
    campaign.payment.status = "secured";
    campaign.payment.fundedAt = new Date().toISOString();
  }
}
