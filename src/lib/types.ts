export type TokenType = "free" | "one-time" | "monthly" | "yearly";

export type YouTubeVideoInfo = {
  title: string;
  channelName: string;
  videoId: string;
  url: string;
  thumbnailUrl: string;
  publishedAt?: string;
  duration?: string;
};

export type SummaryFormat = "standard" | "tldr" | "qa" | "points";

export type BatchSummaryRequest = {
  videoUrls: string[];
  format?: SummaryFormat;
  token: string;
};

export type SummaryResponse = {
  videoInfo: YouTubeVideoInfo;
  summary: string;
  format: SummaryFormat;
  tokensUsed?: number;
  error?: string;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  productId: string;
  popular?: boolean;
  tokenType: TokenType;
  img: string;
};
