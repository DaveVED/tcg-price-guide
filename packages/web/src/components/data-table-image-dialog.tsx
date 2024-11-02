import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export interface DataTableImageDialogProps {
  imageUri: string;
  cardName: string;
}

export const DataTableImageDialog: React.FC<DataTableImageDialogProps> = ({
  imageUri,
  cardName,
}) => {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={imageUri}
          alt={`${cardName} image`}
          className="w-10 h-15 object-cover cursor-pointer"
          onClick={() => setSelectedImage(imageUri)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-4">
          <img
            src={selectedImage || "/placeholder.svg?height=300&width=200"}
            alt={`${cardName} full image`}
            className="w-full h-auto object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
