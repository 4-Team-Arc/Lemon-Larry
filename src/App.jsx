import NavBar from "./components/navbar.jsx"
import RegisterLogin from "./components/loginPage.jsx"
import AboutUsPage from "./components/about-us.jsx"
import { Routes,Route } from "react-router-dom";
import GameScene from '../scripts/game.jsx';
import Leaderboard from "./components/leaderboard.jsx";

const App = () => {

  return (
    <>
      <NavBar/>
          <Routes>
            <Route exact path="/" element={<h1>insert content here for home page</h1>}></Route>
            <Route exact path="/Login" element={<RegisterLogin/>}></Route>
            <Route exact path="/Play" element={<GameScene />}></Route>
            <Route exact path="/About-Us" element={<AboutUsPage/>}></Route>
            <Route exact path="/Leaderboard" element={<Leaderboard/>}></Route>
          </Routes>
    </>
  )
}

export default App
