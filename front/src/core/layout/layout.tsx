import { Box } from '@mui/material';
import TopBar from './topBar';

interface LayoutProps {
    children?: React.ReactNode; // Esto es necesario para que se reconozca 'children'
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar />
      <main style={{ flexGrow: 1, overflow: 'auto' }}>
        {children}
      </main>
    </Box>
  );
};

export default Layout;
