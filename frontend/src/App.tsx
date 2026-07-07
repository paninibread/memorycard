import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";

function App() {

  return (
    <BrowserRouter>
    <header>
      <div>
        <h1>memorycard</h1>
      </div>
    </header>
  <Routes> 
    <Route path="/" element={<Home />} />
    <Route path="/games/:id" element={<GameDetails />} />
  </Routes>

  </BrowserRouter>

  );
}

export default App;