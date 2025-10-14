# SummarAIze

SummarAIze lets you paste any YouTube link and get a clean, AI-generated summary in seconds — no login, no distractions.

## 🎯 What The App Does

Paste a YouTube video link → Get a clean AI-generated summary.

- ✅ No signups
- ✅ Faceless UX
- ✅ Lightning-fast GPT summaries
- ✅ Optional Notion export & batch mode
- ✅ Pro token unlock for advanced features

## 🧰 Core Features

| Feature                     | Free Access        |
| --------------------------- | ------------------ |
| 🔗 Paste YouTube URL        | ✅ Yes             |
| 🧠 AI Summary (GPT-3.5)     | ✅ Yes             |
| 📋 Copy to Clipboard / .txt | ✅ Yes             |
| 🔢 Daily Limit              | 🚫 3 summaries/day |
| 👤 No account required      | ✅ Yes             |

## 🚀 Pro Features (Token-Based Access)

| Feature                          | One-Time ($7) | Monthly ($5/mo) | Yearly ($39/yr) |
| -------------------------------- | ------------- | --------------- | --------------- |
| 🔓 Summary Limit                 | 30/month      | 100/month       | 300/month       |
| 📤 Notion Export                 | ✅            | ✅              | ✅              |
| 📦 Batch Summarization (5 links) | ✅            | ✅              | ✅              |
| 🧠 Custom Formats (Q&A, TL;DR)   | ❌            | ✅              | ✅              |
| ⚡ Priority Processing           | ❌            | ✅              | ✅              |

## 💳 Payment System: How It Works

Token-based paywall using Lemon Squeezy:

### ✅ One-Time Token Purchase

- Users pay $7 once
- Receive a Pro Token via email
- Unlock 30 summaries/month and key features
- Token stored in localStorage (no login)

### ✅ Monthly or Yearly Subscriptions

- Lemon Squeezy handles recurring billing
- Users receive subscription-based tokens (SMAIZE*M*, SMAIZE*Y*)
- System tracks usage, feature access, and renewal

## 🔐 Behind the Scenes:

- ✅ Secure token generation via crypto
- ✅ Webhook integration with Lemon Squeezy
- ✅ Summary count tracked server-side
- ✅ Warning alerts at 75% usage
- ✅ Upgrade prompts when limits are hit
- ✅ Auto-email on purchase with token + instructions

## 🧪 Developer Smart Stuff

- ⚙️ Next.js frontend + API Routes
- 📤 GPT-3.5 via OpenAI API
- 📋 Notion export via Notion API
- 💳 Payments via Lemon Squeezy
- 🎨 Dark minimal UI with faceless brand aesthetic

## Demo Limitations

This demonstration version has some limitations:

- **YouTube transcripts**: In a real implementation, you would integrate with a proper YouTube transcript API. The demo uses simulated transcripts.
- **API keys**: You would need to provide your own OpenAI, Notion, and Lemon Squeezy API keys.
- **User tracking**: The demo uses localStorage for token storage. A production app would track usage on the server.
- **Payment integration**: The checkout flow links to example URLs. In production, you would integrate with Lemon Squeezy's API.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your-openai-api-key
   NOTION_API_KEY=your-notion-api-key
   NOTION_DATABASE_ID=your-notion-database-id
   LEMON_SQUEEZY_API_KEY=your-lemon-squeezy-api-key
   LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret
   LEMON_SQUEEZY_STORE_ID=your-store-id
   LEMON_SQUEEZY_ONE_TIME_PRODUCT_ID=your-one-time-product-id
   LEMON_SQUEEZY_MONTHLY_PRODUCT_ID=your-monthly-product-id
   LEMON_SQUEEZY_YEARLY_PRODUCT_ID=your-yearly-product-id
   ```
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
