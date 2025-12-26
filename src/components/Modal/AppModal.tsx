import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FC } from "react";

interface AppModal {
  buttonName: string;
  children: React.ReactNode;
  modalTitle: string;
  modalDesc: string;
  onClick: () => void;
}
const AppModal: FC<AppModal> = ({
  modalTitle,
  buttonName,
  modalDesc,
  children,
  onClick,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonName}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDesc}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onClick}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
