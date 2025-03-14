import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";
import React, { ReactElement } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { NextPageWithLayout } from "~/pages/_app";
import AppPageLayout from "..";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

// const tasks = {
//   todo: [
//     {
//       id: 1,
//       title: "Design new landing page",
//       priority: "High",
//       assignee: "john",
//       dueDate: "2023-03-15",
//     },
//     {
//       id: 2,
//       title: "Fix navigation bug",
//       priority: "Medium",
//       assignee: "sarah",
//       dueDate: "2023-03-12",
//     },
//     {
//       id: 3,
//       title: "Update user documentation",
//       priority: "Medium",
//       assignee: "alex",
//       dueDate: "2023-03-18",
//     },
//     {
//       id: 4,
//       title: "Create email templates",
//       priority: "Low",
//       assignee: "emma",
//       dueDate: "2023-03-20",
//     },
//     {
//       id: 5,
//       title: "Research competitors",
//       priority: "Medium",
//       assignee: "john",
//       dueDate: "2023-03-25",
//     },
//     {
//       id: 6,
//       title: "Prepare quarterly report",
//       priority: "High",
//       assignee: "current",
//       dueDate: "2023-03-10",
//     },
//   ],
//   inProgress: [
//     {
//       id: 7,
//       title: "Implement authentication",
//       priority: "High",
//       assignee: "sarah",
//       dueDate: "2023-03-14",
//     },
//     {
//       id: 8,
//       title: "Optimize database queries",
//       priority: "Medium",
//       assignee: "alex",
//       dueDate: "2023-03-16",
//     },
//     {
//       id: 9,
//       title: "Create onboarding flow",
//       priority: "Medium",
//       assignee: "current",
//       dueDate: "2023-03-11",
//     },
//     {
//       id: 10,
//       title: "Redesign dashboard UI",
//       priority: "Medium",
//       assignee: "emma",
//       dueDate: "2023-03-19",
//     },
//     {
//       id: 11,
//       title: "Integrate payment gateway",
//       priority: "High",
//       assignee: "john",
//       dueDate: "2023-03-22",
//     },
//     {
//       id: 12,
//       title: "Test mobile responsiveness",
//       priority: "Low",
//       assignee: "current",
//       dueDate: "2023-03-13",
//     },
//     {
//       id: 13,
//       title: "File test5",
//       priority: "Medium",
//       assignee: "sarah",
//       dueDate: "2023-03-17",
//     },
//   ],
//   done: [
//     {
//       id: 14,
//       title: "New task",
//       priority: "Medium",
//       assignee: "current",
//       files: 2,
//       dueDate: "2023-03-05",
//     },
//     {
//       id: 15,
//       title: "Deploy website update",
//       priority: "High",
//       assignee: "alex",
//       dueDate: "2023-03-02",
//     },
//     {
//       id: 16,
//       title: "Create API documentation",
//       priority: "Medium",
//       assignee: "emma",
//       dueDate: "2023-03-01",
//     },
//     {
//       id: 17,
//       title: "Test file",
//       priority: "Low",
//       assignee: "current",
//       dueDate: "2023-03-03",
//     },
//     {
//       id: 18,
//       title: "Update privacy policy",
//       priority: "Medium",
//       assignee: "john",
//       dueDate: "2023-03-04",
//     },
//   ],
// };

// Sample data for projects
// const projects = [{ id: 1, name: "another newtask", active: true }];

// Analytics data
const analyticsData = {
  taskCompletion: 68,
  tasksCompleted: 23,
  tasksInProgress: 7,
  tasksPending: 6,
  overdueTasks: 2,
  weeklyProgress: [
    { day: "Mon", completed: 4 },
    { day: "Tue", completed: 7 },
    { day: "Wed", completed: 5 },
    { day: "Thu", completed: 6 },
    { day: "Fri", completed: 4 },
    { day: "Sat", completed: 2 },
    { day: "Sun", completed: 1 },
  ],
  taskDistribution: {
    high: 35,
    medium: 45,
    low: 20,
  },
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

const Dashboard: NextPageWithLayout = () => {
  const session = useSession();
  let { data: tasks } = api.task.getAllTask.useQuery();

  if (!tasks) {
    tasks = [];
  }

  const assignedToUser = tasks.filter((task) => {
    return task.assignedTo.some((task) => task.id === session.data?.user?.id);
  });





  // Format date to relative time (e.g., "2 days left")
  const getRelativeTime = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days left`;
    }
  };
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here&apos;s an overview of your tasks and progress.
        </p>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tasks Completed</p>
                <h3 className="text-2xl font-bold">
                  {analyticsData.tasksCompleted}
                </h3>
                <div className="flex items-center mt-1 text-green-600 text-xs">
                  <ArrowUpRight size={14} className="mr-1" />
                  <span>12% from last week</span>
                </div>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tasks In Progress</p>
                <h3 className="text-2xl font-bold">
                  {analyticsData.tasksInProgress}
                </h3>
                <div className="flex items-center mt-1 text-yellow-600 text-xs">
                  <ArrowUpRight size={14} className="mr-1" />
                  <span>5% from last week</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-2 rounded-md">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tasks Pending</p>
                <h3 className="text-2xl font-bold">
                  {analyticsData.tasksPending}
                </h3>
                <div className="flex items-center mt-1 text-blue-600 text-xs">
                  <ArrowDownRight size={14} className="mr-1" />
                  <span>3% from last week</span>
                </div>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <Clock className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overdue Tasks</p>
                <h3 className="text-2xl font-bold">
                  {analyticsData.overdueTasks}
                </h3>
                <div className="flex items-center mt-1 text-red-600 text-xs">
                  <ArrowDownRight size={14} className="mr-1" />
                  <span>2% from last week</span>
                </div>
              </div>
              <div className="bg-red-100 p-2 rounded-md">
                <AlertCircle className="text-red-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Weekly Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={analyticsData.weeklyProgress}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="completed"
                  fill="var(--color-desktop)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={{
                high: {
                  label: "High Priority",
                  color: "hsl(var(--chart-1))",
                },
                medium: {
                  label: "Medium Priority",
                  color: "hsl(var(--chart-2))",
                },
                low: {
                  label: "Low Priority",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="mt-6"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "High",
                        value: analyticsData.taskDistribution.high,
                      },
                      {
                        name: "Medium",
                        value: analyticsData.taskDistribution.medium,
                      },
                      {
                        name: "Low",
                        value: analyticsData.taskDistribution.low,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell key="high" fill="#d65757" />
                    <Cell key="medium" fill="#e0cf3e" />
                    <Cell key="low" fill="#61c52b" />
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex items-center w-full justify-between gap-2 flex-col">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span>High ({analyticsData.taskDistribution.high})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span>Medium {analyticsData.taskDistribution.medium}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span>Low {analyticsData.taskDistribution.low}</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tasks that need attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {tasks.slice(0, 4).map((task) => {
                return (
                  <div
                    key={task.id}
                    className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center mt-1">
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(task.priority)} text-xs font-normal px-2 py-0.5 mr-2`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(task.deadline?.toDateString() || "")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {assignedToUser.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant="outline"
                        className={`${getPriorityColor(task.priority)} text-xs font-normal px-2 py-0.5 mr-2`}
                      >
                        {task.priority}
                      </Badge>
                      <span
                        className={`text-xs ${
                          getRelativeTime(
                            task.deadline?.toDateString() ||
                              new Date().toDateString()
                          ).includes("overdue")
                            ? "text-red-500"
                            : getRelativeTime(
                                  task.deadline?.toDateString() ||
                                    new Date().toDateString()
                                ) === "Due today"
                              ? "text-orange-500"
                              : "text-gray-500"
                        }`}
                      >
                        {getRelativeTime(
                          task.deadline?.toDateString() ||
                            new Date().toDateString()
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {task.deadline && new Date(task.deadline) < new Date() ? (
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 mr-2"
                      >
                        Overdue
                      </Badge>
                    ) : null}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Postpone
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <AppPageLayout>{page}</AppPageLayout>;
};
