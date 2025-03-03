import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Bell, Calendar, MessageCircle } from "lucide-react";
import UserInfo from "./header-user-info";
import { signOut } from "next-auth/react";
import { useSearchQuery } from "~/store/search-store";
export default function SearchHeader() {
  const { setData } = useSearchQuery();
  return (
    <div className="flex w-full items-center justify-between px-2 py-2">
      <div className="relative max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search for anything..."
          className="w-full bg-secondary pl-10"
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={() => signOut()}>logout</Button>
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
        <UserInfo />
      </div>
    </div>
  );
}
