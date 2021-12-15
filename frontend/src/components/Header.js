import { NavLink } from "react-router-dom";

const items = [
  { name: "Home", to: "/" },
  { name: "login", to: "/login" },
  { name: "signup", to: "/signup" },
];
// H4B 1N6
const Header = () => {
  return (
    <nav className="bg-white w-full h-16 flex items-center">
      <div className="container">
        <ul className="flex items-center justify-center space-x-3">
          {items.map((item) => {
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={(navData) =>
                    navData.isActive ? "text-primary" : ""
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
