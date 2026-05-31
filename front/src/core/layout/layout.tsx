import TopBar from './topbar/topBar';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <TopBar />
        <main style={{flexGrow: 1, overflow: 'auto', padding: '0 48px', boxSizing: 'border-box'}}>            {children}
        </main>
    </div>
);

export default Layout;