import Routes from '@common/defs/routes';
import { CRUD_ACTION, NavGroup } from '@common/defs/types';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import Namespaces from '@common/defs/namespaces';
import {
  Group,
  Search as SearchIcon,
  Add as AddIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

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
