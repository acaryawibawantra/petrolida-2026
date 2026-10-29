"use client";

import { useGetLovolRegistrant } from "@/app/(dashboard)/admin/lovol/hooks/use-get-lovol-registrant";
import Typography from "@/components/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalAccepted from "../_components/modal-accepted";
import ModalInterviewed from "../_components/modal-interviewed";
import ModalRejected from "../_components/modal-rejected";

const RegistrantDetailPage = ({
  params,
}: {
  params: Promise<{ user_id: string }>;
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const { user_id } = React.use(params);
  const router = useRouter();
  const userId = user_id;

  const { data: registrantData, isLoading } = useGetLovolRegistrant(userId);

  const [acceptDialog, setAcceptDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [interviewDialog, setInterviewDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!registrantData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Registrant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-[48px]">
        <div className="flex flex-col gap-[48px]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center "
            >
              <ArrowLeft className="text-gray-700" />
            </button>
            <div className="flex items-center gap-1">
              <Typography variant="l" weight="bold" className="text-[#7A7A7A]">
                Dashboard / LOVOL Registrant /
              </Typography>
              <Typography variant="l" weight="bold" className="text-[#357182]">
                Details
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Typography variant="h3" weight="bold" className="text-gray-900">
              Registrant Details
            </Typography>
            <div className="flex items-center gap-3">
              <Link
                href={`https://wa.me/${registrantData.phone_number
                  .replace(/^0/, "62")
                  .replace(/\D/g, "")}`}
                target="_blank"
                className="px-5 py-2 border border-[#357182] text-[#357182] rounded-md text-sm font-helvetica font-medium"
              >
                Contact Registrant
              </Link>

              <button
                onClick={() => setAcceptDialog(true)}
                className="px-5 py-2 bg-[#5C7F69] text-white rounded-md text-sm font-helvetica font-medium"
              >
                Accepted
              </button>

              <ModalAccepted
                open={acceptDialog}
                onOpenChange={setAcceptDialog}
                registrantData={registrantData}
                userId={userId}
              />

              <button
                onClick={() => setInterviewDialog(true)}
                className="px-5 py-2 bg-[#78A0AB] text-white rounded-md text-sm font-helvetica font-medium"
              >
                Interviewed
              </button>

              <ModalInterviewed
                open={interviewDialog}
                onOpenChange={setInterviewDialog}
                registrantData={registrantData}
                userId={userId}
              />

              <button
                onClick={() => setRejectDialog(true)}
                className="px-5 py-2 bg-[#BC425D] text-white rounded-md text-sm font-helvetica font-medium"
              >
                Rejected
              </button>

              <ModalRejected
                open={rejectDialog}
                onOpenChange={setRejectDialog}
                registrantData={registrantData}
                userId={userId}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-6">
          <div className="flex gap-[24px] justify-between ">
            <div className="flex items-start gap-[24px]">
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  Name
                </Typography>
                <Typography variant="p" className="text-black">
                  Student ID
                </Typography>
                <Typography variant="p" className="text-black">
                  WhatsApp Number
                </Typography>
              </div>
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  {registrantData.name}
                </Typography>
                <Typography variant="p" className="text-black">
                  {registrantData.student_id}
                </Typography>
                <Typography variant="p" className="text-black">
                  {registrantData.phone_number}
                </Typography>
              </div>
            </div>
            <div className="flex items-start gap-[24px]">
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  Batch
                </Typography>
                <Typography variant="p" className="text-black">
                  Major
                </Typography>
              </div>
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  {registrantData.batch}
                </Typography>
                <Typography variant="p" className="text-black">
                  {registrantData.major}
                </Typography>
              </div>
            </div>
            <div className="flex items-start gap-[24px]">
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  Line ID
                </Typography>
                <Typography variant="p" className="text-black">
                  Email
                </Typography>
              </div>
              <div className="flex flex-col items-start gap-[24px]">
                <Typography variant="p" className="text-black">
                  {registrantData.line_id}
                </Typography>
                <Typography variant="p" className="text-black">
                  {registrantData.email}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-[125px] h-[44px] px-5 py-2 text-sm font-helvetica font-medium rounded-md transition-colors ${
                activeTab === "general"
                  ? "bg-[#357182] text-white"
                  : "bg-[#EFEFEF] text-[#231F20]"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("skill")}
              className={`w-[125px] h-[44px]px-5 py-2 text-sm font-helvetica font-medium rounded-md transition-colors ${
                activeTab === "skill"
                  ? "bg-[#357182] text-white"
                  : "bg-[#EFEFEF] text-[#231F20]"
              }`}
            >
              Skill
            </button>
            <button
              onClick={() => setActiveTab("document")}
              className={`w-[125px] h-[44px] px-5 py-2 text-sm font-helvetica font-medium rounded-md transition-colors ${
                activeTab === "document"
                  ? "bg-[#357182] text-white"
                  : "bg-[#EFEFEF] text-[#231F20]"
              }`}
            >
              Document
            </button>
          </div>
          <div className="rounded-[16px] bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-6">
            {activeTab === "general" && (
              <div className="flex flex-col gap-[40px]">
                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Where do you get information about PETROUDIA ?
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {registrantData.information_form}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Please tell us what do you know about PETROUDIA ?
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      className="text-gray-900 leading-relaxed"
                    >
                      {registrantData.about_petrolida}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Your Primary Division
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {registrantData.primary_division}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Your motivation choose Primary Division
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      className="text-gray-900 leading-relaxed"
                    >
                      {registrantData.primary_motivation}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Your Secondary Division
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      weight="semibold"
                      className="text-gray-900"
                    >
                      {registrantData.secondary_division}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-[24px]">
                  <div className="w-96">
                    <Typography variant="bt" className="text-gray-600">
                      Your motivation choose Secondary Division
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography
                      variant="bt"
                      className="text-gray-900 leading-relaxed"
                    >
                      {registrantData.secondary_motivation}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "skill" && (
              <div className="flex  items-start gap-[40px] self-stretch">
                <div className="w-[40%] flex items-start gap-[40px]">
                  <div className="flex flex-col items-start gap-[24px]">
                    <Typography variant="p" className="text-black">
                      English Proficiency
                    </Typography>
                    <Typography variant="p" className="text-black">
                      Communication Skill
                    </Typography>
                    <Typography variant="p" className="text-black">
                      Fast Response
                    </Typography>
                  </div>
                  <div className="flex flex-col items-start gap-[24px]">
                    <Typography variant="p" className="text-black">
                      {registrantData.english_proficiency}
                    </Typography>
                    <Typography variant="p" className="text-black">
                      {registrantData.communication_skill}
                    </Typography>
                    <Typography variant="p" className="text-black">
                      {registrantData.fast_response}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-start gap-[40px]">
                  <div className="flex flex-col items-start gap-[24px]">
                    <Typography variant="p" className="text-black">
                      Time Management
                    </Typography>
                    <Typography variant="p" className="text-black">
                      Transferred to another division
                    </Typography>
                    <Typography variant="p" className="text-black">
                      Plans for Practical Work?
                    </Typography>
                  </div>
                  <div className="flex flex-col items-start gap-[24px]">
                    <Typography variant="p" className="text-black">
                      {registrantData.time_management}
                    </Typography>
                    <Typography variant="p" className="text-black">
                      {registrantData.transfer_to_other_division ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="p" className="text-black">
                      {registrantData.practical_work}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "document" && (
              <div className="flex p-[24px] items-start gap-[40px] self-stretch">
                <div className="flex flex-col items-start gap-[32px] w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div>
                      <Typography
                        variant="bt"
                        weight="medium"
                        className="text-gray-900 mb-4"
                      >
                        Curriculum Vitae (CV)
                      </Typography>
                      {registrantData.cv_asset ? (
                        <Link
                          href={registrantData.cv_asset}
                          target="_blank"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#357182] rounded-md text-sm font-helvetica font-normal text-[#357182] bg-white hover:bg-[#357182] hover:text-white transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          View document
                        </Link>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-helvetica font-normal text-gray-400 bg-gray-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                          No document uploaded
                        </div>
                      )}
                    </div>

                    <div>
                      <Typography
                        variant="bt"
                        weight="medium"
                        className="text-gray-900 mb-4"
                      >
                        Proof of Followed Official Instagram
                      </Typography>
                      {registrantData.follow_prof_asset ? (
                        <Link
                          href={registrantData.follow_prof_asset}
                          target="__blank"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#357182] rounded-md text-sm font-helvetica font-normal text-[#357182] bg-white hover:bg-[#357182] hover:text-white transition-colors duration-150"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          View document
                        </Link>
                      ) : (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-helvetica font-normal text-gray-400 bg-gray-50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                          No document uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrantDetailPage;
