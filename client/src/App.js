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
            <Route exact path='/' element={<LandingPage />} />
            <Route exact path='/canvas' element={<Editor />} />
            <Route exact path='/create' element={<CreateRoom />} />
            <Route exact path='/join' element={<JoinRoom />} />
            <Route path='/s/:roomcode' element={<JoinRoom />} />
          </Routes>
        </Router>
      </div>
    </SocketProvider>
  );
}

export default App;
