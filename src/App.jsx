import NavBar from "./components/navbar.jsx"
import LoginPage from "./components/loginPage.jsx"
import AboutUsPage from "./components/about-us.jsx"
import { Routes,Route } from "react-router-dom";

const App = () => {

  return (
    <>
      <NavBar/>
          <Routes>
            <Route exact path="/" element={<LoginPage/>}></Route>
            <Route exact path="/Login" element={<LoginPage/>}></Route>
            <Route exact path="/About-Us" element={<AboutUsPage/>}></Route>
          </Routes>
    </>
  )
}

export default App
