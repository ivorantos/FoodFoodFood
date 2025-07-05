import { AppBar, Toolbar, Switch, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const TopBar = () => {
//   const { mode, toggleTheme } = useTheme(); // Tema claro/oscuro (aunque no esté implementado aún)

  return (
    <AppBar position="fixed" >
      <Toolbar>

        {/* Toggle tema claro/oscuro */}
        {/* <Switch checked={mode === 'dark'} onChange={toggleTheme} /> */}
         <Switch  />

        {/* Botones de navegación */}
        <Box >
          <Button
            component={Link}
            to="/recipes"
            color="inherit"
          >
            Recetas
          </Button>

          <Button
            component={Link}
            to="/planner"
            color="inherit"
          >
            Planificador
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
