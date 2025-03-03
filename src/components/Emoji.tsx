import { SmilePlus } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

interface PickEmojiProps {
  className?: string;
  onChange: (emoji: EmojiClickData) => void;
}

interface PickEmojiProps {
  className?: string;
  onChange: (emoji: EmojiClickData) => void;
}

const PickEmoji = ({ className, onChange }: PickEmojiProps) => {
  const handleEmojiClick = (emoji: EmojiClickData) => {
    onChange(emoji);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          type="button"
          className={cn(className)}
        >
          <SmilePlus className="w-4 h-4 text-zinc-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none shadow-none w-fit">
        <EmojiPicker
          reactionsDefaultOpen={true}
          onEmojiClick={handleEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PickEmoji;
