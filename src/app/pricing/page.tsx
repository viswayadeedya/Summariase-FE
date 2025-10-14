"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PricingPlan } from "@/components/features/pricing-plan";
import { PRICING_PLANS } from "@/lib/constants";
import { getTokenFromStorage, validateToken } from "@/lib/tokenUtils";
import type { TokenType } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TokenInput } from "@/components/features/token-input";

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<TokenType>("free");
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  // Check for existing token on page load
  useEffect(() => {
    const token = getTokenFromStorage();
    if (token) {
      const { isValid, tokenType } = validateToken(token);
      if (isValid) {
        setCurrentPlan(tokenType);
      }
    }
  }, []);

  // Handle plan selection
  const handleSelectPlan = (plan: (typeof PRICING_PLANS)[0]) => {
    console.log(plan);
    if (plan.id === "free") {
      // Already on free plan
      return;
    }

    if (plan.id === currentPlan) {
      toast.info("You are already subscribed to this plan");
      return;
    }

    // For demo, we'll just open a new window to an example checkout page
    // In a real app, this would redirect to Lemon Squeezy checkout with the correct product ID
    const checkoutUrl = `https://summariase.lemonsqueezy.com/buy/${
      plan.productId
    }?checkout[custom][userId]=${localStorage.getItem("summaraize_uid") || ""}`;
    window.open(checkoutUrl, "_blank");
  };

  // Handle token activation success
  const handleTokenSuccess = () => {
    const token = getTokenFromStorage();
    if (token) {
      const { tokenType } = validateToken(token);
      setCurrentPlan(tokenType);
    }
    setTokenDialogOpen(false);
    toast.success("Pro features unlocked!");
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
                  Pricing Plans
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the perfect plan for your summarization needs
                </p>

                {currentPlan !== "free" && (
                  <div className="inline-block px-4 py-2 mt-4 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    You are on the{" "}
                    {currentPlan === "one-time"
                      ? "One-Time Purchase"
                      : currentPlan === "monthly"
                      ? "Monthly"
                      : "Yearly"}{" "}
                    plan
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {PRICING_PLANS.map((plan) => (
                <PricingPlan
                  key={plan.id}
                  plan={plan}
                  onSelect={handleSelectPlan}
                  isCurrentPlan={plan.id === currentPlan}
                />
              ))}
            </div>

            {currentPlan === "free" && (
              <div className="mt-12 text-center">
                <h3 className="text-lg font-medium mb-4">
                  Already have a token?
                </h3>
                <button
                  onClick={() => setTokenDialogOpen(true)}
                  className="inline-flex items-center justify-center h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Enter your token
                </button>
              </div>
            )}
            {currentPlan !== "free" && (
              <div className="flex justify-center items-center mt-12">
                <a
                  href="https://app.lemonsqueezy.com/my-orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:underline-offset-4"
                >
                  Manage Your Subscription &rarr;
                </a>
              </div>
            )}

            <div className="mt-16 border-t pt-8">
              <h3 className="text-lg font-medium mb-4">
                Frequently Asked Questions
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">
                    How does the token system work?
                  </h4>
                  <p className="text-muted-foreground">
                    After purchase, you'll receive a unique token via email.
                    Enter this token in the app to unlock Pro features. No
                    account or login required!
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    What's the difference between plans?
                  </h4>
                  <p className="text-muted-foreground">
                    All Pro plans include Notion export and batch summarization.
                    Monthly and yearly plans also include custom formats and
                    priority processing.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Do one-time tokens expire?</h4>
                  <p className="text-muted-foreground">
                    No, one-time purchase tokens never expire. You'll get 30
                    summaries per month forever.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">
                    Can I use the same token on multiple devices?
                  </h4>
                  <p className="text-muted-foreground">
                    Yes, your token works across all your devices. Just enter it
                    in the app on each device.
                  </p>
                </div>
              </div>
            </div>
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
    </div>
  );
}
