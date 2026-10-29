"use client";

import Typography from "@/components/typography";
import Layout from "@/layouts/Layout";

export default function PrivacyPolicyPage() {
  return (
    <Layout withNavbar withFooter>
      <div className="min-h-screen bg-[#263D44] flex flex-col pt-32 pb-24 px-6 lg:px-16">
        <div className="container mx-auto">
          {/* Header Section */}
          <div className="flex justify-start mb-12">
            <div className="bg-[#DB4E6E] px-8 py-2 inline-block">
              <Typography
                variant="h1"
                font="Melodrame"
                className="text-4xl lg:text-5xl text-white italic"
              >
                Privacy Policy
              </Typography>
            </div>
          </div>

          <div className="space-y-8 text-white max-w-4xl">
            <Typography variant="p" className="leading-relaxed text-gray-300">
              Effective Date: May 12, 2024
            </Typography>

            <div>
              <Typography
                variant="h5"
                font="Melodrame"
                className="text-[#DB4E6E] mb-3"
              >
                1. Introduction
              </Typography>
              <Typography variant="p" className="leading-relaxed text-gray-200">
                Welcome to Petrolida 2026. We are committed to protecting your
                personal information and your right to privacy. If you have any
                questions or concerns about this privacy notice or our practices
                with regard to your personal information, please contact us.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h5"
                font="Melodrame"
                className="text-[#DB4E6E] mb-3"
              >
                2. Information We Collect
              </Typography>
              <Typography variant="p" className="leading-relaxed text-gray-200">
                We collect personal information that you voluntarily provide to
                us when you register on the website, express an interest in
                obtaining information about us or our products and services,
                when you participate in activities on the website, or otherwise
                when you contact us.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h5"
                font="Melodrame"
                className="text-[#DB4E6E] mb-3"
              >
                3. How We Use Your Information
              </Typography>
              <Typography variant="p" className="leading-relaxed text-gray-200">
                We use personal information collected via our website for a
                variety of business purposes described below. We process your
                personal information for these purposes in reliance on our
                legitimate business interests, in order to enter into or perform
                a contract with you, with your consent, and/or for compliance
                with our legal obligations.
              </Typography>
            </div>

            <div>
              <Typography
                variant="h5"
                font="Melodrame"
                className="text-[#DB4E6E] mb-3"
              >
                4. Contact Us
              </Typography>
              <Typography variant="p" className="leading-relaxed text-gray-200">
                If you have questions or comments about this policy, you may
                email us or contact us by post at:
                <br />
                <span className="font-bold text-white">
                  Institut Teknologi Sepuluh Nopember
                </span>
                <br />
                Jl. Teknik Kimia Keputih, Sukolilo, Surabaya Jawa Timur 60111
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
