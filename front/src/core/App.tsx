import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RecipesPage from '../routes/recipesPage';
import PlannerPage from '../routes/plannerPage';
import Layout from './layout/layout';
import {PlannerProvider} from "../widgets/Planner/plannerContext";

function App() {
    return (
        <PlannerProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Navigate to="/recipes" />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/planner" element={<PlannerPage />} />
                    </Routes>
                </Layout>
            </Router>
        </PlannerProvider>
    );
}

export default App;