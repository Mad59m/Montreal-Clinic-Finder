import Header from "../components/Header";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="px-4">{children}</main>
    </div>
  );
};

export default Layout;
