'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [activeTab, setActiveTab] = useState('suggested');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Someone replied to your post",
      time: "2m ago",
      read: false
    },
    {
      id: 2,
      text: "Your post received 100 upvotes",
      time: "1h ago",
      read: false
    },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-14 items-center px-4">
        <div className="w-[200px] flex items-center h-full">
          <span className="text-xl font-bold h-[80%]"><img src="/logo.png" alt="" className='h-full' /></span>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'suggested' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('suggested')}
              className="text-sm"
            >
              Suggested
            </Button>
            <Button
              variant={activeTab === 'following' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('following')}
              className="text-sm"
            >
              Following
            </Button>
            <Button
              variant={activeTab === 'popular' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('popular')}
              className="text-sm hidden md:inline-flex"
            >
              Popular
            </Button>
          </div>
        </div>

        <div className="w-[200px] flex items-center justify-end space-x-2">
          <SignedOut >
            <div className='px-3 py-2 w-fit h-fit bg-white text-black rounded-lg'>
              <SignInButton />
            </div>
            {/* <SignUpButton /> */}
          </SignedOut>
          <SignedIn>
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none mb-3">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "flex items-start justify-between p-2 rounded-md",
                          !notification.read && "bg-muted"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="space-y-1">
                          <p className="text-sm">{notification.text}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <UserButton
              userProfileProps={{
                additionalOAuthScopes: {
                  google: [
                    "https://www.googleapis.com/auth/fitness.activity.read",
                    "https://www.googleapis.com/auth/fitness.blood_glucose.read",
                    "https://www.googleapis.com/auth/fitness.blood_pressure.read",
                    "https://www.googleapis.com/auth/fitness.body.read",
                    "https://www.googleapis.com/auth/fitness.heart_rate.read",
                    "https://www.googleapis.com/auth/fitness.body_temperature.read",
                    "https://www.googleapis.com/auth/fitness.location.read",
                    "https://www.googleapis.com/auth/fitness.nutrition.read",
                    "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
                    "https://www.googleapis.com/auth/fitness.sleep.read"
                  ],
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
