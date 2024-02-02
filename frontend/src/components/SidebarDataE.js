import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export const SidebarDataE = [
  {
    title: 'Main',
    icon: <HomeIcon />,
    link: '/EstudianteMain',
  },
  {
    title: 'Editar',
    icon: <PersonAddIcon />,
    link: '/Editar',
  },
  {
    title: 'Reporte Evaluaciones',
    icon: <SearchIcon />,
    link: '/ReporteEvaluaciones',
  },
  {
    title: 'Ver Reclamos',
    icon: <NotificationsActiveIcon />,
    link: '/MisReclamos',
  },
];
