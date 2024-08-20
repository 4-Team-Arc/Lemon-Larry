import { Link,Routes,Route } from "react-router-dom";
import LoginPage from "./loginPage";
import AboutUsPage from "./about-us";
import App from "../App";
const NavBar = () => {
  return(
    <>
    <nav className="navbar">
      <Link to ="/">Home</Link>
      <Link to = "/Login">Login</Link>
      <Link to="/About-Us">About Us</Link>

      <Routes>
        <Route path="/" element = {<App/>}/>
        <Route path="/Login" element = {<LoginPage/>}/>
        <Route path="/About-Us" element = {<AboutUsPage/>}/>


      </Routes>


    </nav>

    </>
  )
};

export default NavBar