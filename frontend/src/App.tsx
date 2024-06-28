import { Route, Routes } from 'react-router-dom';
import './App.css';
import LobbyScreen from './components/screens/LobbyScreen';
import RoomScreen from './components/screens/RoomScreen';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LobbyScreen />} />
        <Route path='/room/:roomId' element={<RoomScreen />} />
      </Routes>
    </div>
  );
}

export default App;
