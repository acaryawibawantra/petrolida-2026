import { Download, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";

import { DetailResponse } from "@/hooks/use-oprec-staff";

export default function Document({ data }: { data: DetailResponse }) {
  const { data: detail } = data;

  const documentItems = [
    {
      title: "Required Documents",
      description: "Drive folder containing all required documents",
      link: detail.required_document_link,
      icon: FileText,
      available: !!detail.required_document_link,
    },
    {
      title: "Portfolio",
      description: "Portfolio document (PDF)",
      link: detail.portfolio_asset_link,
      icon: Download,
      available: !!detail.portfolio_asset_link,
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h3" weight="semibold" className="text-default-900">
        Documents & Assets
      </Typography>

      <div className="grid gap-6 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] md:grid-cols-2">
        {documentItems.map((item, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border border-default-200 p-6"
          >
            <div className="flex items-start space-x-3">
              <item.icon className="mt-1 h-5 w-5 text-default-600" />
              <div className="flex-1">
                <Typography
                  variant="p"
                  weight="semibold"
                  className="text-default-900"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="p"
                  className="mt-1 text-sm text-default-600"
                >
                  {item.description}
                </Typography>
              </div>
            </div>

            {item.available ? (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-blue-600 hover:text-blue-700"
                  leftIcon={ExternalLink}
                  leftIconClassName="h-4 w-4"
                >
                  View Document
                </Button>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-default-400"
                disabled
              >
                No document provided
              </Button>
            )}
          </div>
        ))}
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="rounded-lg bg-gray-50 p-4">
          <Typography
            variant="p"
            className="mb-2 text-xs font-mono text-gray-600"
          >
            Debug - Document URLs:
          </Typography>
          <div className="space-y-1 text-xs">
            <div>Required: {detail.required_document_link || "N/A"}</div>
            <div>Portfolio: {detail.portfolio_asset_link || "N/A"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
