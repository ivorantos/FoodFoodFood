import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RecipesPage from '../routes/recipesPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/recipes" />} />
        <Route path="/recipes" element={<RecipesPage />} />
        {/* <Route path="/planner" element={<PlannerPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;