import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export const SidebarDataP = [
  {
    title: 'Main',
    icon: <HomeIcon />,
    link: '/ProfesorMain',
  },
  {
    title: 'Asignaturas',
    icon: <PersonAddIcon />,
    link: '/Asignaturas',
  },  
  {
    title: 'Ver Reclamos',
    icon: <NotificationsActiveIcon />,
    link: '/LeerReclamos',
  },
];
