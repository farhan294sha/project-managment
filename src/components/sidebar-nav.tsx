import { LayoutGrid, MessageSquare, Settings, Users2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import TodoSvg from "./todo-svg";
const navigation = [
  {
    title: "Home",
    icon: LayoutGrid,
    href: "/",
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
              <SidebarMenuButton
                tooltip={item.title}
                className="group text-muted-foreground"
              >
                <a href={item.href} className="flex gap-4">
                  <item.icon className="h-5 w-5" strokeOpacity={1.5} />
                  <span className="font-medium">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
export default SidebarNav;
