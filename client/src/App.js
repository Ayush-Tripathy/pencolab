import { useContext } from 'react';
import './App.css';
import { RoomContext } from './contexts/RoomContext';
import { SocketProvider } from './contexts/SocketContext';
import CreateRoom from './pages/CreateRoom';
import Editor from './pages/Editor';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinRoom from './pages/JoinRoom';

function App() {
  const { connectedRoom, creatorName } = useContext(RoomContext);
  return (

    <SocketProvider roomCode={connectedRoom} creatorName={creatorName}>
      <div className="App">
        <Router basename='/'>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/canvas' element={<Editor />} />
            <Route path='/create' element={<CreateRoom />} />
            <Route path='/join' element={<JoinRoom />} />
            <Route path='/:roomcode' element={<JoinRoom />} />
          </Routes>
        </Router>
      </div>
    </SocketProvider>
  );
}

export default App;
