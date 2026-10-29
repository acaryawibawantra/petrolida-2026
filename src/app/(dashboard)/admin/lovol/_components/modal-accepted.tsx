import {
  useGetDivisions,
  useUpdateLovolStatus,
} from "@/app/(dashboard)/admin/lovol/hooks/use-update-lovol-status";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LovolRegistrant } from "@/types/lovol";
import { useState } from "react";

interface ModalAcceptedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrantData: LovolRegistrant;
  userId: string;
  className?: string;
}

export default function ModalAccepted({
  open,
  onOpenChange,
  registrantData,
  userId,
}: ModalAcceptedProps) {
  const [subdivID, setSubdivID] = useState("");
  const { updateToAccepted, isPendingAccepted } = useUpdateLovolStatus();
  const { data: divisionList, isLoading: isLoadingDivisions } =
    useGetDivisions();
  const SUBDIVISIONS = divisionList?.data;

  const handleAccepted = () => {
    updateToAccepted(
      { id: userId, accepted_division_id: subdivID },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const getDivisionName = (id: string) => {
    return SUBDIVISIONS?.find((s) => s.id === id)?.name;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <Typography
              variant="h5"
              weight="medium"
              className="text-default-800 uppercase"
            >
              DIVISION PLACEMENT
            </Typography>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Typography variant="t" weight="medium" className="text-gray-500">
              Name
            </Typography>
            <Typography variant="t" weight="semibold" className="text-black">
              {registrantData.name}
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="p" className="text-gray-500">
                Primary:
              </Typography>
              <Typography variant="p" weight="semibold" className="text-black">
                {registrantData.primary_division}
              </Typography>
            </div>
            <div>
              <Typography variant="p" className="text-gray-500">
                Secondary:
              </Typography>
              <Typography variant="p" weight="semibold" className="text-black">
                {registrantData.secondary_division}
              </Typography>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="p" weight="semibold" className="text-gray-900">
              Accepted in Division <span className="text-red-500">*</span>
            </Typography>
            <Select value={subdivID} onValueChange={setSubdivID}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue
                  placeholder={
                    isLoadingDivisions
                      ? "Loading divisions..."
                      : "Select an option"
                  }
                />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {SUBDIVISIONS?.map((division) => (
                  <SelectItem
                    key={division.id}
                    value={division.id}
                    className="cursor-pointer"
                  >
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogDescription className="text-center mt-4">
            <Typography variant="t" weight="medium" className="text-black">
              Are you sure want to accepted with{" "}
              <span className="font-bold">{registrantData.name}</span> to the{" "}
              <span className="font-bold">
                {subdivID ? getDivisionName(subdivID) : "DIVISION"}
              </span>{" "}
              ?
            </Typography>
          </DialogDescription>
        </div>

        <DialogFooter className="sm:justify-center gap-4 mt-6">
          <Button
            variant="success"
            className="w-32 bg-[#5C7F69] hover:bg-[#4a6654]"
            onClick={handleAccepted}
            disabled={isPendingAccepted || !subdivID}
          >
            {isPendingAccepted ? "Loading..." : "Accepted"}
          </Button>
          <DialogClose asChild>
            <Button
              variant="danger"
              className="w-32 bg-[#BC425D] hover:bg-[#a0384f]"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
