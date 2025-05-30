// import { useState, useEffect } from 'react';
// import Header from '../Lecturer/Headerpop';
// import Sidebar from '../Lecturer/Sidebarpop';
// import MobileMenu from "../Lecturer/MobileMenu";
// import LecturerDashboardContent from '../Lecturer/LecturerDashboardContent';

// export default function LecturerDashboard() {
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth <= 991);
//         };

//         window.addEventListener('resize', handleResize);
//         handleResize();

//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     return (
//         <div className="flex flex-col h-screen">
//             <div className="flex flex-col h-screen">
//                 <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
//                 <div className="flex flex-1 overflow-scroll rounded-lg shadow-md bg-white 
//                                 max-md:flex-col">
//                     {!isMobile && <Sidebar />}
//                     {isMobile && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />}
//                     <LecturerDashboardContent />
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import Header from '../Lecturer/Headerpop';
import Sidebar from '../Lecturer/Sidebarpop';
import MobileMenu from "../Lecturer/MobileMenu";
import LecturerDashboardContent from '../Lecturer/LecturerDashboardContent';
import { SidebarProvider2 } from '../Lecturer/SidebarContext2'; // Adjust path as needed

export default function LecturerDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <SidebarProvider2>
      <div className="flex flex-col h-screen">
        <Header toggleMobileMenu={toggleMobileMenu} isMobile={isMobile} />
        <div className="flex flex-1 overflow-scroll rounded-lg shadow-md bg-white max-md:flex-col">
          {!isMobile && <Sidebar />}
          {isMobile && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />}
          <LecturerDashboardContent />
        </div>
      </div>
    </SidebarProvider2>
  );
}
