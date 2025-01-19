"use client";

import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Bell, Calendar, MessageCircle } from "lucide-react";

export default function SearchHeader() {
  return (
    <div className="flex w-full items-center justify-between bg-white px-2 py-2">
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search for anything..."
          className="w-full bg-secondary pl-10"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="group hover:text-primary"
        >
          <Calendar className="h-5 w-5 text-muted-foreground group-hover:text-primary/90" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-medium">Anima Agrawal</p>
            <p className="text-xs text-muted-foreground">U.P, India</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatar.jpg" alt="Profile picture" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
