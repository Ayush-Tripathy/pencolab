import './App.css';
import Editor from './pages/Editor';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/canvas' element={<Editor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
