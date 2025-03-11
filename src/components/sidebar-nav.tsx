import { LayoutGrid, MessageSquare, Settings, Users2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import TodoSvg from "./todo-svg";
import Link from "next/link";
const navigation = [
  {
    title: "Home",
    icon: LayoutGrid,
    href: "/app/dashboard",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Tasks",
    icon: TodoSvg,
    href: "/tasks",
  },
  {
    title: "Members",
    icon: Users2,
    href: "/members",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

const SidebarNav = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="mt-2 space-y-2">
          {navigation.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href="/app/dashboard" className="flex gap-4">
                <SidebarMenuButton
                  tooltip={item.title}
                  className="group text-muted-foreground"
                >
                  <item.icon className="h-5 w-5" strokeOpacity={1.5} />
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default SidebarNav;
