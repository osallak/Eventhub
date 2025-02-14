import {
  Add as AddIcon,
  Event as EventIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface NavGroup {
  id: string;
  text: string;
  icon: React.ReactNode;
  link: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  icon: React.ReactNode;
}

export const menuItems: NavGroup[] = [
  {
    id: 'discover',
    text: 'Discover Events',
    icon: <SearchIcon />,
    link: '/events',
  },
  {
    id: 'create',
    text: 'Create Event',
    icon: <AddIcon />,
    link: '/events/create',
  },
];

export const profileMenuItems: MenuItem[] = [
  {
    id: 'upcoming',
    title: 'Upcoming Events',
    url: '/events/upcoming',
    icon: <EventIcon />,
  },
  {
    id: 'history',
    title: 'History',
    url: '/events/history',
    icon: <HistoryIcon />,
  },
  {
    id: 'settings',
    title: 'Settings',
    url: '/settings',
    icon: <SettingsIcon />,
  },
  {
    id: 'logout',
    title: 'Logout',
    url: '/logout',
    icon: <LogoutIcon />,
  },
];
