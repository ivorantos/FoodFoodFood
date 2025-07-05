import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RecipesPage from '../routes/recipesPage';
import PlannerPage from '../routes/plannerPage';
import Layout from './layout/layout';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;