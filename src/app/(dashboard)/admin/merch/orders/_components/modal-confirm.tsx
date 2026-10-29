"use client";

import Button from "@/components/buttons/button";
import Typography from "@/components/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import React from "react";

interface ModalEditStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    customerName: string;
    itemName: string;
    currentStatus: string;
  };
  onSave: (newStatus: string) => void;
}

export default function ModalEditStatus({
  open,
  onOpenChange,
  data,
  onSave,
}: ModalEditStatusProps) {
  const [status, setStatus] = React.useState(data.currentStatus);

  React.useEffect(() => {
    setStatus(data.currentStatus);
  }, [data.currentStatus]);

  const handleSave = () => {
    onSave(status);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white p-8 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-xl font-bold text-black uppercase">
            Edit Order Status
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs text-center">
            Make changes to the order status here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-32">
                <Typography variant="t" className="text-gray-500">
                  Name
                </Typography>
              </div>
              <Typography variant="t" weight="medium" className="text-black">
                {data.customerName}
              </Typography>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-32">
                <Typography variant="t" className="text-gray-500">
                  Item Name
                </Typography>
              </div>
              <Typography variant="t" weight="medium" className="text-black">
                {data.itemName}
              </Typography>
            </div>
          </div>

          <div className="space-y-2">
            <Typography variant="t" className="text-black">
              Status <span className="text-red-500">*</span>
            </Typography>
            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-200 capitalize">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button
              onClick={handleSave}
              variant="secondary"
              className="w-[100px]"
            >
              Save
            </Button>
            <Button
              variant="danger"
              onClick={() => onOpenChange(false)}
              className="w-[100px]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
