import type { PricingPlan, SummaryFormat } from "./types";

// Application metadata
export const APP_NAME = "SummarAIse";
export const APP_DESCRIPTION =
  "SummarAIse turns long YouTube videos into powerful, skimmable insights — in seconds.";
export const APP_URL = "https://summaraize.app";

// App Configuration
export const MAX_FREE_SUMMARIES_PER_DAY = 3;
export const MAX_BATCH_URLS = 5;

// Format Options
export const SUMMARY_FORMATS: Record<
  SummaryFormat,
  { label: string; description: string; proOnly: boolean }
> = {
  standard: {
    label: "Standard",
    description: "A comprehensive summary covering the key points",
    proOnly: false,
  },
  tldr: {
    label: "TL;DR",
    description: "A super-concise overview of the main points",
    proOnly: true,
  },
  qa: {
    label: "Q&A",
    description: "Key questions and their answers from the video",
    proOnly: true,
  },
  points: {
    label: "Bullet Points",
    description: "Main takeaways as bullet points",
    proOnly: true,
  },
};

// Pricing Plans
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: [
      "AI Summary (GPT-3.5)",
      "Copy to Clipboard",
      "Save as .txt",
      `${MAX_FREE_SUMMARIES_PER_DAY} summaries per day`,
      "No account required",
    ],
    buttonText: "Current Plan",
    productId: "",
    tokenType: "free",
    img: "/sum-free.png",
  },
  {
    id: "one-time",
    name: "One-Time Purchase",
    price: "$7",
    features: [
      "30 summaries/month",
      "Notion Export",
      "Batch Summarization (5 links)",
      "Never expires",
      "No account needed",
    ],
    buttonText: "Buy Now",
    productId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_ONE_TIME_PRODUCT_ID || "",
    tokenType: "one-time",
    img: "/sum-ome-time.png",
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$5/mo",
    features: [
      "100 summaries/month",
      "Notion Export",
      "Batch Summarization",
      "Custom Formats (Q&A, TL;DR)",
      "Priority Processing",
    ],
    buttonText: "Subscribe",
    productId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MONTHLY_PRODUCT_ID || "",
    tokenType: "monthly",
    popular: true,
    img: "/sum-monthly.png",
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$39/yr",
    features: [
      "300 summaries/month",
      "Notion Export",
      "Batch Summarization",
      "Custom Formats (Q&A, TL;DR)",
      "Priority Processing",
      "Save $21/year",
    ],
    buttonText: "Subscribe",
    productId: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_YEARLY_PRODUCT_ID || "",
    tokenType: "yearly",
    img: "/sum-yearly.png",
  },
];

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  TOKEN: "summaraize_token",
  THEME: "summaraize_theme",
  RECENT_SUMMARIES: "summaraize_recent_summaries",
};
