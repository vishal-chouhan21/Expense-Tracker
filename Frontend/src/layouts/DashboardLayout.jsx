import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="pt-16 md:pl-64 bg-[#0b0b0b] min-h-screen text-white">
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
