import { useUpdateLovolStatus } from "@/app/(dashboard)/admin/lovol/hooks/use-update-lovol-status";
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
import { LovolRegistrant } from "@/types/lovol";

interface ModalRejectedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registrantData: LovolRegistrant;
  userId: string;
}

export default function ModalRejected({
  open,
  onOpenChange,
  registrantData,
  userId,
}: ModalRejectedProps) {
  const { updateToRejected, isPendingRejected } = useUpdateLovolStatus();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            <Typography
              variant="h5"
              weight="medium"
              className="text-default-800 uppercase"
            >
              ARE YOU SURE ?
            </Typography>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Typography variant="t" weight="medium" className="text-gray-500">
              Name
            </Typography>
            <Typography variant="t" weight="semibold" className="text-black">
              {registrantData.name}
            </Typography>
          </div>
          <DialogDescription>
            <Typography variant="t" weight="medium" className="text-black">
              Are you sure want to reject to continue the registration process
              from <span className="font-bold">{registrantData.name}</span> ?
            </Typography>
          </DialogDescription>
        </div>
        <DialogFooter className="sm:justify-center gap-4">
          <Button
            variant="success"
            className="w-32 bg-[#5C7F69] hover:bg-[#4a6654]"
            onClick={() => {
              updateToRejected(userId, {
                onSuccess: () => onOpenChange(false),
              });
            }}
            disabled={isPendingRejected}
          >
            {isPendingRejected ? "Loading..." : "Yes"}
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
