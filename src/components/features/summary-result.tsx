import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  NotebookPenIcon,
  ShareIcon,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

interface SummaryItem {
  summary: string;
  videoInfo: {
    title: string;
    duration: string;
    thumbnailUrl: string;
    url: string;
    channelName?: string;
  };
}

interface SummaryResultProps {
  result: { summary?: string; videoInfo?: any; summaries?: SummaryItem[] };
  onExportToNotion?: (index?: number) => void;
  canExportToNotion: boolean;
}

export function SummaryResult({
  result,
  onExportToNotion,
  canExportToNotion,
}: SummaryResultProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isBatch = Array.isArray(result.summaries);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Copy failed.");
    }
  };

  const handleDownload = (summary: string, title: string) => {
    const blob = new Blob([summary], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_summary.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const summaries =
    isBatch && result.summaries
      ? result.summaries
      : [{ summary: result.summary, videoInfo: result.videoInfo }];

  return (
    <div className="space-y-6">
      {summaries.map((item, index) => (
        <Card key={index} className="w-full max-w-3xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative h-[120px] w-full md:w-[200px] rounded-md overflow-hidden">
                  <Image
                    src={item.videoInfo.thumbnailUrl}
                    alt={item.videoInfo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {item.videoInfo.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.videoInfo.channelName}
                  </p>
                  <a
                    href={item.videoInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                  Summary
                </span>
              </div>

              <div className="mt-4 bg-muted/50 rounded-lg p-4">
                <pre className="whitespace-pre-line">{item.summary}</pre>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap justify-between gap-2 px-6 pb-6">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(item.summary ?? "", index)}
              >
                {copiedIndex === index ? (
                  <CheckIcon className="h-4 w-4 mr-2" />
                ) : (
                  <CopyIcon className="h-4 w-4 mr-2" />
                )}
                {copiedIndex === index ? "Copied" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleDownload(
                    item.summary ?? "",
                    item.videoInfo.title ?? "video"
                  )
                }
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
              {canExportToNotion && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onExportToNotion?.(index)}
                >
                  <NotebookPenIcon className="h-4 w-4 mr-2" />
                  Export to Notion
                </Button>
              )}
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                navigator.share?.({
                  title: item.videoInfo.title,
                  text: item.summary,
                })
              }
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
