"use client";
import { useState } from "react";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDivision } from "@/hooks/use-master-data";
import {
  DetailResponse,
  useAcceptedIterview,
  useInterviewed,
  useRejectedInterview,
} from "@/hooks/use-oprec-staff";

export default function RegistrantDetails({ data }: { data: DetailResponse }) {
  const { data: detail } = data;
  const [subdivID, setSubdivID] = useState("");
  const [acceptDialog, setAcceptDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  const { divisionList: SUBDIVISIONS } = useGetDivision();

  const { handleInterviewed } = useInterviewed(detail.id);
  const { handleAccepted } = useAcceptedIterview(detail.id, subdivID);
  const { handleRejected } = useRejectedInterview(detail.id);

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start">
        <Typography variant="h2" weight="medium">
          Registrant Staff Details
        </Typography>

        <div className="space-x-3">
          <Dialog open={acceptDialog} onOpenChange={setAcceptDialog}>
            <DialogTrigger>
              <Button
                variant={detail.status !== "rejected" ? "success" : "disabled"}
                disabled={
                  detail.status === "accepted" || detail.status === "rejected"
                }
                size="sm"
              >
                Accept
              </Button>
            </DialogTrigger>
            <DialogContent className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-medium text-default-800">
                  Name: <span className="text-default-900">{detail.name}</span>
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base font-medium text-default-900">
                {detail.status === "pending" ? (
                  <span>
                    Are you sure you want to{" "}
                    <span className="text-success-500">proceed</span> with{" "}
                    {detail.name} to the interview stage?
                  </span>
                ) : (
                  <>
                    Accept in division:
                    <Select onValueChange={setSubdivID} defaultValue={subdivID}>
                      <SelectTrigger className="mt-2 cursor-pointer">
                        <SelectValue placeholder="Select a division" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBDIVISIONS?.map((division) => (
                          <SelectGroup key={division.id}>
                            <SelectLabel>{division.division}</SelectLabel>
                            {division.subdivisions.map((subdivision) => (
                              <SelectItem
                                key={subdivision.id}
                                value={subdivision.id}
                                className="cursor-pointer"
                              >
                                {subdivision.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </DialogDescription>

              <DialogFooter>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    try {
                      detail.status === "pending"
                        ? handleInterviewed()
                        : handleAccepted();
                    } finally {
                      setAcceptDialog(false);
                    }
                  }}
                >
                  Yes
                </Button>
                <DialogClose asChild>
                  <Button variant="danger" size="sm" className="w-fit">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
            <DialogTrigger>
              <Button
                variant={detail.status !== "accepted" ? "danger" : "disabled"}
                disabled={
                  detail.status === "accepted" || detail.status === "rejected"
                }
                size="sm"
              >
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-medium text-default-800">
                  Name: <span className="text-default-900">{detail.name}</span>
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="text-base font-medium text-default-900">
                Are you sure you want to{" "}
                <span className="text-danger-500">reject</span> {detail.name}?
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    try {
                      handleRejected();
                    } finally {
                      setRejectDialog(false);
                    }
                  }}
                >
                  Yes
                </Button>
                <DialogClose asChild>
                  <Button variant="danger" size="sm" className="w-fit">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-5 rounded-xl px-8 py-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)] lg:grid-cols-2 xl:grid-cols-3">
        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Name
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className="break-words text-default-900"
            >
              {detail.name}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Batch
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className="break-words text-default-900"
            >
              {detail.batch}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Student ID
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className="break-words text-default-900"
            >
              {detail.student_id}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Department
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className="break-words text-default-900"
            >
              {detail.department}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Email
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className="break-words text-default-900"
            >
              {detail.email}
            </Typography>
          </div>
        </div>

        <div className="flex justify-between xl:space-x-3">
          <Typography
            variant="p"
            weight="medium"
            className="w-[40%] break-words text-default-800"
          >
            Status
          </Typography>
          <div className="w-[60%]">
            <Typography
              variant="p"
              weight="medium"
              className={`break-words capitalize ${
                detail.status === "accepted"
                  ? "text-success-500"
                  : detail.status === "rejected"
                    ? "text-danger-500"
                    : detail.status === "interviewed"
                      ? "text-warning-500"
                      : "text-default-500"
              }`}
            >
              {detail.status}
            </Typography>
          </div>
        </div>

        {detail.accepted_division && (
          <div className="flex justify-between xl:space-x-3">
            <Typography
              variant="p"
              weight="medium"
              className="w-[40%] break-words text-default-800"
            >
              Accepted Division
            </Typography>
            <div className="w-[60%]">
              <Typography
                variant="p"
                weight="medium"
                className="break-words text-success-600"
              >
                {detail.accepted_division}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
