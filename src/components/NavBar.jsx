import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎮</span>
          <span className="logo-text">GameTracker</span>
        </Link>

        {/* MENÚ DE NAVEGACIÓN */}
        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
            >
              📚 Biblioteca
            </Link>
          </li>
          <li>
            <Link
              to="/reviews"
              className={`navbar-link ${location.pathname === "/reviews" ? "active" : ""}`}
            >
              ⭐ Reseñas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
