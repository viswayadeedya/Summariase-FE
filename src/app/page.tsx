"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { YouTubeInput } from "@/components/features/youtube-input";
import { SummaryResult } from "@/components/features/summary-result";
import type { SummaryFormat, SummaryResponse } from "@/lib/types";
import { toast } from "sonner";
import { FormatSelector } from "@/components/features/format-selector";
import { getOrCreateUserId, getTokenFromStorage } from "@/lib/tokenUtils";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenInput } from "@/components/features/token-input";
import { ResendTokenInput } from "@/components/features/resendTokenInput";
import { validateToken } from "@/lib/tokenUtils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useTokenStore } from "@/store/useStoreToken";
import { YouTubeBatchInput } from "@/components/features/youtube-batch";

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResponse | null>(
    null
  );
  const [format, setFormat] = useState<SummaryFormat>("standard");
  const [isProUser, setIsProUser] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [isExportingToNotion, setIsExportingToNotion] = useState(false);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [tokenName, setTokenName] = useState("free");
  const [limit, setLimit] = useState(0);
  const [maxLimiit, setMaxLimit] = useState(0);
  const [activeToken, setActiveToken] = useState("free");
  const { setHasToken } = useTokenStore();

  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      const { isValid, tokenType } = validateToken(token);
      setIsProUser(isValid && tokenType !== "free");
      setTokenName(tokenType);
      setActiveToken(tokenType);
      if (isValid && tokenType !== "free") handleFetchQuota(token);
    }
  }, []);

  const handleFetchQuota = async (token: string) => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/token/quota",
        {
          token,
        }
      );

      if (response.data.success) {
        const { used, max } = response.data.quota;
        toast.success(`You have used ${used} out of ${max} summaries.`);
        setLimit(used);
        setMaxLimit(max);
      } else {
        toast.error("Failed to fetch quota.");
      }
    } catch (error) {
      console.error("❌ Error fetching quota:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || "Failed to fetch quota";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Handle YouTube URL submission
  const handleSubmit = async (url: string) => {
    setIsProcessing(true);
    setSummaryResult(null);

    try {
      const token = getTokenFromStorage();
      const userId = getOrCreateUserId();

      console.log(format);
      const response = await axios.post("http://localhost:5050/api/summarize", {
        videoUrl: url,
        format,
        userToken: token,
        userId,
      });
      setSummaryResult(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorMessage =
          error.response.data?.error || "Failed to generate summary";

        if (status === 403) {
          // Permission error - likely Pro feature with free account
          toast.error("This feature requires a Pro account");
          setTokenDialogOpen(true);
        } else if (status === 429) {
          // Rate limit error
          toast.error(
            "Daily limit reached. Upgrade to Pro for more summaries."
          );
          setTokenDialogOpen(true);
        } else {
          // Other errors
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchSubmit = async (urls: string[]) => {
    setIsProcessing(true);
    setSummaryResult(null);

    try {
      const token = getTokenFromStorage();
      const userId = getOrCreateUserId();

      const response = await axios.post(
        "http://localhost:5050/api/summarize/batch",
        {
          videoUrls: urls,
          format,
          userToken: token,
          userId,
        }
      );

      setSummaryResult(response.data); // Expecting `summaries: [...]`
    } catch (error) {
      console.error("Batch summary error:", error);
      toast.error("Failed to summarize videos. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Notion export
  const handleExportToNotion = async () => {
    if (!summaryResult) return;

    setIsExportingToNotion(true);

    try {
      const token = getTokenFromStorage();

      const response = await axios.post("http://localhost:5050/api/notion", {
        videoInfo: summaryResult.videoInfo,
        summary: summaryResult.summary,
        token,
        userId: localStorage.getItem("summaraize_uid") || "",
      });
      console.log(response);
      if (response.data.success) {
        toast.success("Successfully exported to Notion!");

        // Open the Notion page in a new tab if URL is available
        if (response.data.pageUrl) {
          window.open(response.data.pageUrl, "_blank");
        }
      } else {
        throw new Error(response.data.error || "Failed to export to Notion");
      }
    } catch (error) {
      console.error("Error exporting to Notion:", error);

      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data?.error || "Failed to export to Notion";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsExportingToNotion(false);
    }
  };

  // Handle token activation success
  const handleTokenSuccess = () => {
    const token = getTokenFromStorage() || "free";
    const { tokenType } = validateToken(token);
    setTokenName(tokenType);
    setActiveToken(tokenType);
    setIsProUser(true);
    setHasToken(true);
    setTokenDialogOpen(false);
    handleFetchQuota(token);
    toast.success("Pro features unlocked!");
  };

  const handleresendToken = () => {
    setResendDialogOpen(false);
    toast.success("Token successfully sent to your email");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  <div className="flex items-center justify-center">
                    {APP_NAME}
                    {activeToken === "one-time" && (
                      <Image
                        className="rounded-xl"
                        src="/sum-ome-time.png"
                        alt="Pro Logo"
                        width={40}
                        height={40}
                      />
                    )}
                    {activeToken === "monthly" && (
                      <Image
                        className="rounded-xl"
                        src="/sum-monthly.png"
                        alt="Pro Logo"
                        width={40}
                        height={40}
                      />
                    )}
                    {activeToken === "yearly" && (
                      <Image
                        className="rounded-xl"
                        src="/sum-yearly.png"
                        alt="Pro Logo"
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  {APP_DESCRIPTION}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 space-y-10">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold tracking-tight">
                  {summaryResult ? "Your Summary" : "Get Started"}
                </h2>

                <FormatSelector
                  selectedFormat={format}
                  onChange={setFormat}
                  isPro={isProUser}
                  disabled={isProcessing}
                />
              </div>

              {isProUser && !summaryResult && (
                <div className="flex items-center justify-center gap-2">
                  <label className="text-sm text-muted-foreground font-medium">
                    Batch Mode:
                  </label>
                  <input
                    type="checkbox"
                    checked={isBatchMode}
                    onChange={(e) => setIsBatchMode(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                </div>
              )}

              {!summaryResult && (
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-3xl">
                    {isBatchMode ? (
                      <YouTubeBatchInput
                        onSubmit={handleBatchSubmit}
                        isProcessing={isProcessing}
                      />
                    ) : (
                      <YouTubeInput
                        onSubmit={handleSubmit}
                        isProcessing={isProcessing}
                      />
                    )}
                  </div>
                </div>
              )}

              {summaryResult && (
                <SummaryResult
                  result={summaryResult}
                  onExportToNotion={handleExportToNotion}
                  canExportToNotion={isProUser}
                />
              )}

              {summaryResult && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      setSummaryResult(null);
                      setFormat("standard");
                    }}
                    className="text-sm font-medium underline hover:text-primary"
                  >
                    Summarize another video
                  </button>
                </div>
              )}
            </div>

            {!isProUser && !summaryResult && (
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get more summaries per day, batch processing, Notion export,
                  and more!
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTokenDialogOpen(true)}
                    className="text-sm font-medium underline hover:text-primary"
                  >
                    Already have a token?
                  </button>
                  <Link
                    href="/pricing"
                    className="text-sm font-medium underline hover:text-primary ml-4"
                  >
                    View pricing plans
                  </Link>
                  <button
                    onClick={() => setResendDialogOpen(true)}
                    className="text-sm font-medium underline hover:text-primary  ml-4"
                  >
                    Forget Token? Click here to resend it.
                  </button>
                </div>
              </div>
            )}

            {isProUser && (
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="inline-block px-4 py-2 mt-4 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  You are on the{" "}
                  {tokenName === "one-time"
                    ? "One-Time Purchase"
                    : tokenName === "monthly"
                    ? "Monthly"
                    : "Yearly"}{" "}
                  plan. {limit} / {maxLimiit} summaries used.
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Token dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your Pro token</DialogTitle>
          </DialogHeader>
          <TokenInput onSuccess={handleTokenSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Resend your Pro token?</DialogTitle>
          </DialogHeader>
          <ResendTokenInput onSuccess={handleresendToken} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
