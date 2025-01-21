import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";

const UserInfo = () => {
  const { data: session } = useSession();
  return (
    <div className="flex items-center gap-3 pl-2">
      <div className="text-right">
        <p className="text-sm font-medium">{session?.user?.name}</p>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={session?.user?.image ?? undefined}
          alt="Profile picture"
        />
        <AvatarFallback>{session?.user?.name}</AvatarFallback>
      </Avatar>
    </div>
  );
};
export default UserInfo;
