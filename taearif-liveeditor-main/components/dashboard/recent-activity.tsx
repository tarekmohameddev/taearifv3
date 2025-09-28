import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "JD",
    },
    action: "updated the homepage banner",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "JS",
    },
    action: "added a new product",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "MJ",
    },
    action: "updated the about page",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    user: {
      name: "Sarah Williams",
      avatar: "SW",
    },
    action: "changed the site theme",
    timestamp: "2 days ago",
  },
  {
    id: "5",
    user: {
      name: "John Doe",
      avatar: "JD",
    },
    action: "added a new testimonial",
    timestamp: "3 days ago",
  },
];

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`/placeholder.svg?height=36&width=36&text=${activity.user.avatar}`}
              alt={activity.user.name}
            />
            <AvatarFallback>{activity.user.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name}
            </p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {activity.timestamp}
          </div>
        </div>
      ))}
    </div>
  );
}
