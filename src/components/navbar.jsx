import { Link } from "react-router-dom";
const NavBar = () => {
  return(
    <nav className="navbar">
      <Link to ="/">Home</Link>
      <Link to = "/Login">Login</Link>
      <Link to="/About-Us">About Us</Link>
      <Link to="/Play">Play Now</Link>
    </nav>
  )
};

export default NavBar
