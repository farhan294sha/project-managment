import { EmojiClickData } from "emoji-picker-react";
import { FormEvent, useState } from "react";
import { cn } from "~/lib/utils";
import PickEmoji from "./Emoji";
import { Loader2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "~/hooks/use-toast";
import { TRPCClientError } from "@trpc/client";

interface CommentFormProps {
  onSubmit: (comment: string) => Promise<void>;
  isSubmitting?: boolean;
}

const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      await onSubmit(comment);
      setComment(""); // Clear input after successful submission
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast({
          title: "Failed to create Comment",
          description: error.message,
        });
        return
      }
    }
  };

  const handleEmojiChange = (emojiData: EmojiClickData) => {
    setComment((prevComment) => prevComment + emojiData.emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 pr-10",
            "bg-zinc-50 dark:bg-zinc-800/50",
            "border border-zinc-200 dark:border-zinc-700/50",
            "rounded-xl",
            "text-sm text-zinc-900 dark:text-zinc-100",
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/20",
            "transition-all duration-200"
          )}
        />
        <PickEmoji
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2",
            "p-1.5 rounded-lg",
            "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50",
            "transition-colors duration-200"
          )}
          onChange={handleEmojiChange}
        />
      </div>
      <Button
        type="submit"
        className={cn("p-2.5 rounded-xl")}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};

export default CommentForm;
