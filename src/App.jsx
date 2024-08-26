import NavBar from "./components/navbar.jsx"
import LoginPage from "./components/loginPage.jsx"
import AboutUsPage from "./components/about-us.jsx"
import { Routes,Route } from "react-router-dom";

const App = () => {

  return (
    <>
      <NavBar/>
          <Routes>
            <Route exact path="/" element={<h1>insert content here for home page</h1>}></Route>
            <Route exact path="/Login" element={<LoginPage/>}></Route>
            <Route exact path="/Play" element={<GameScene />}></Route>
            <Route exact path="/About-Us" element={<AboutUsPage/>}></Route>
          </Routes>
    </>
  )
}

export default App
