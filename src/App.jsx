import NavBar from "./components/navbar.jsx"
import LoginPage from "./components/loginPage.jsx"
import AboutUsPage from "./components/about-us.jsx"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

const App = () => {

  return (
    <>
      <NavBar/>
        <Router>
          <Routes>
            <Route exact path="/" element={<LoginPage/>}></Route>
            <Route exact path="/Login" element={<LoginPage/>}></Route>
            <Route exact path="/About-Us" element={<AboutUsPage/>}></Route>
          </Routes>
        </Router>
    </>
  )
}

export default App
