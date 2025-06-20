// import React, { Suspense, useEffect, useState, useCallback, createContext } from 'react';
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Camera, AlertCircle } from 'lucide-react';
// import { socket } from './config/socket';
// import ProctoringPage from './components/ProctoringPage';
// import ExamInterface from './components/ExamInterface '; 
// import ExamPage from './components/ExamPage'; 
// import StudentLogin from './pages/Login';
// import AdminDashboard from './pages/Admin/AdminDashboard';



// const Home = React.lazy(() => import('./components/Home'))
// const Viewer = React.lazy(() => import('./components/Viewer'));

// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean; error: Error | null }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="max-w-4xl mx-auto mt-10 p-6">
//           <div className="bg-red-900/20 rounded-lg shadow-xl p-6 border border-red-500">
//             <div className="flex items-center text-red-500 mb-4">
//               <AlertCircle className="h-6 w-6 mr-2" />
//               <h2 className="text-xl font-semibold">Something went wrong</h2>
//             </div>
//             <p className="text-red-200 mb-4">
//               {this.state.error?.message || 'An unexpected error occurred'}
//             </p>
//             <Link
//               to="/"
//               className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
//               onClick={() => this.setState({ hasError: false, error: null })}
//             >
//               Return Home
//             </Link>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// const LoadingScreen = () => (
//   <div className="flex items-center justify-center min-h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//   </div>
// );

// export const SocketContext = createContext<{
//   isConnected: boolean;
//   reconnect: () => void;
// }>({
//   isConnected: false,
//   reconnect: () => {},
// });

// function App() {
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const handleConnect = () => {
//       console.log('Socket connected');
//       setIsConnected(true);
//     };

//     const handleDisconnect = () => {
//       console.log('Socket disconnected');
//       setIsConnected(false);
//     };

//     socket.on('connect', handleConnect);
//     socket.on('disconnect', handleDisconnect);

//     setIsConnected(socket.connected);

//     return () => {
//       socket.off('connect', handleConnect);
//       socket.off('disconnect', handleDisconnect);
//     };
//   }, []);

//   const reconnect = useCallback(() => {
//     if (!socket.connected) {
//       socket.connect();
//     }
//   }, []);

//   return (
//       <SocketContext.Provider value=
//       {{ isConnected, reconnect }}>
//       <BrowserRouter>
//         {/* <ErrorBoundary>
//           <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
//             <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-16">
//                   <Link to="/" className="flex items-center">
//                     <Camera className="h-8 w-8 text-indigo-500" />
//                     <span className="ml-2 text-xl font-bold text-white">ProctorStream</span>
//                   </Link>
//         <div className="flex items-center space-x-4">
//                     <span
//                      className={`px-3 py-1 rounded-full text-sm ${
//                         isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//                       }`}
//                     >
//                       {isConnected ? 'Connected' : 'Disconnected'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </nav> */}
//             <ErrorBoundary>
//       {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800"> */}
//       <div className="min-h-screen bg-[linear-gradient(to_bottom_right,_#0b1e1b,_#496863)]">
//         <nav className="bg-[#2c484380] backdrop-blur-md sticky top-0 z-50 shadow-md">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="flex items-center justify-between h-16">
//       <Link to="/" className="flex items-center text-[#edf2f7] font-bold text-xl">
//         <Camera className="h-8 w-8 text-[#4c51bf] mr-2" />
//         ProctorStream
//       </Link>
//       <div className="flex items-center space-x-4">
//         <span
//           className={`px-4 py-2 rounded-full text-sm font-medium ${
//             isConnected ? 'bg-[#48bb78] text-white' : 'bg-[#f56565] text-white'
//           }`}
//         >
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </span>
//       </div>
//     </div>
//   </div>
// </nav>


//             <Suspense fallback={<LoadingScreen />}>
//               <Routes>
//                 <Route path="/home" element={<Home />} />
//                 <Route
//                   path="/exam/:roomId"
//                   element={
//                     <ErrorBoundary>
//                       <ExamPage />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route
//                   path="/view/:roomId"
//                   element={
//                     <ErrorBoundary>
//                       <Viewer />
//                     </ErrorBoundary>
//                   }
//                 />
//                 <Route path="/proctoring" element={<ProctoringPage />} />
//                 <Route path="/student-login" element={<StudentLogin />} />
//                 <Route path="/admin" element={< AdminDashboard/>} />
               
//         <Route path="/" element={<ExamInterface />} />
//             {/* <Route path="/exam" element={<ExamPage />} /> */}
//               </Routes>
//             </Suspense>
//           </div>
//         </ErrorBoundary>
//       </BrowserRouter>
//     </SocketContext.Provider>
//   );
// }

// export default App;


import React, { Suspense, useEffect, useState, useCallback, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Camera, AlertCircle } from 'lucide-react';
import { socket } from './config/socket';
import ProctoringPage from './components/ProctoringPage';
// import ExamInterface from './components/ExamInterface';
import ExamInterface from './components/ExamInterface '
import ExamPage from './components/ExamPage';
// import Login from './pages/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegForm from './pages/Admin/RegForm';
import RegCourse from './pages/Admin/RegCourse.tsx';
import Users from './components/admin/Users.tsx';
import LecturerDashboard from './components/Lecturer/LecturerDashboard.tsx';
// import Home from './components/Home.tsx';
import JoinStreamer from './components/JoinStreamer.tsx';
import JoinViewer from './components/JoinViewer.tsx';
import EditLecturerModal from './components/admin/EditLecturerModal.tsx';
import AdminCourses from './components/admin/AdminCourses.tsx';
import LectCourses from './components/Lecturer/LecturerCourses.tsx';
import LecturerTimetable from './components/Lecturer/LecturerTimetable.tsx';
import AdminList from './components/admin/AdminList.tsx';
import EditAdminModal from './components/admin/EditAdminModal.tsx';
// import LoginWrapper from "./pages/LoginWrapper.tsx";
import LandingPage from './pages/LandingPage.tsx';
import JoinLogin from './pages/JoinLogin.tsx';
import LecturerSubmissions from './components/Lecturer/LecturerSubmission.tsx';






const Home = React.lazy(() => import('./components/Home'));
const Viewer = React.lazy(() => import('./components/Viewer'));
const CreateAdminPage = React.lazy(() => import('./components/modals/CreateAdminModal.tsx'));
const AdminLoginPage = React.lazy(() => import('./components/AdminLoginPage'));
const TokenVerificationPage = React.lazy(() => import('./components/TokenVerificationPage'));
const Login = React.lazy(() => import('./components/JoinLogin'));
const CreateCoursePage = React.lazy(() => import('./components/CreateCourseModal.tsx'));
const CreateLecturerPage = React.lazy(() => import('./components/CreateLecturerModal.tsx'));
const Logs = React.lazy(() => import('./components/Logs.tsx'));
const Cleartoken = React.lazy(() => import('./components/cleartoken'));


class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <div className="bg-red-900/20 rounded-lg shadow-xl p-6 border border-red-500">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            <p className="text-red-200 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Link
              to="/"
              className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

export const SocketContext = createContext<{
  isConnected: boolean;
  reconnect: () => void;
}>({
  isConnected: false,
  reconnect: () => {},
});

function AppWrapper() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const reconnect = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const noLayoutRoutes = ['/admin', '/login','/register', '/register-course', '/users', '/lecturer','edit-lecturer','/admin-courses','/lecturer-courses', '/loggs','/timetable','/verify-token','/cleartoken','/','/admin-create','/adminlist','/editadmin','/Landingpage','/Submitted-exam'];
  const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

  return (
    <SocketContext.Provider value={{ isConnected, reconnect }}>
      <ErrorBoundary>
        {isLayoutVisible ? (
          <div className="min-h-screen bg-[linear-gradient(to_bottom_right,_#0b1e1b,_#496863)]">
            <nav className="bg-[#2c484380] backdrop-blur-md sticky top-0 z-50 shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <Link to="/" className="flex items-center text-[#edf2f7] font-bold text-xl">
                    <Camera className="h-8 w-8 text-[#4c51bf] mr-2" />
                    ProctorStream
                  </Link>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      isConnected ? 'bg-[#48bb78] text-white' : 'bg-[#f56565] text-white'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </nav>

            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/exam/:roomId" element={<ExamPage />} />
                <Route path="/view/:roomId" element={<Viewer />} />
                <Route path="/proctoring" element={<ProctoringPage />} />
                <Route path="/" element={<Login/>}     />
                {/* <Route path="/LOGIN" element={<Login />} /> */}
                <Route path="/admin" element={<AdminDashboard />} /> {/* ❌ No layout */}
                <Route path="/lecturer" element={<LecturerDashboard />} />
                <Route path="/register" element={<RegForm />} />
                <Route path="/register-course" element={<RegCourse />} />
                <Route path="/users" element={<Users />} />
                <Route path="/lecturer-courses" element={< LectCourses/>} />
                <Route path="/join-streamer" element={<JoinStreamer />} />
                <Route path="/join-viewer" element={<JoinViewer />} />
                <Route path="/edit-lecturer" element={<EditLecturerModal />} />
                <Route path="/ExamInterface" element={<ExamInterface />} />
                {/* <Route path="/login2" element={<LoginPage />} /> */}
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/register-lecturer" element={<CreateLecturerPage />} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/timetable" element={<LecturerTimetable />} />
        <Route path="/admin-courses" element = {<AdminCourses/>} />
        <Route path="/verify-token" element={<TokenVerificationPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-create" element={<CreateAdminPage />} />
        <Route path="/editadmin" element={<EditAdminModal/>} />
        <Route path="/loggs" element={<Logs />} />
        <Route path="/cleartoken" element={<Cleartoken/>}     />
        <Route path="/LandingPage" element={<LandingPage/>}     />
        <Route path="/Submitted-exam" element={<LecturerSubmissions/>}     />
        <Route path="/" element={<JoinLogin/>}     />
        {/* <Route path="/" element={<LoginWrapper />} /> */}
        
              </Routes>
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/exam/:roomId" element={<ExamPage />} />
              <Route path="/view/:roomId" element={<Viewer />} />
              <Route path="/proctoring" element={<ProctoringPage />} />
              <Route path="/" element={<Login/>}     />
              {/* <Route path="/LOGIN" element={<Login />} /> ❌ No layout */}
              <Route path="/admin" element={<AdminDashboard />} /> {/* ❌ No layout */}
              <Route path="/lecturer" element={<LecturerDashboard />} />
              <Route path="/register" element={<RegForm />} />
              <Route path="/register-course" element={<RegCourse />} />
              <Route path="/users" element={<Users />} />
              <Route path="/join-viewer" element={<JoinViewer />} />
              <Route path="/join-streamer" element={<JoinStreamer />} />
              <Route path="/edit-lecturer" element={<EditLecturerModal />} />
              <Route path="/admin-courses" element = {<AdminCourses/>} />
              <Route path="/lecturer-courses" element={< LectCourses/>} />
              <Route path="/timetable" element={<LecturerTimetable />} />
              <Route path="/ExamInterface" element={<ExamInterface />} />
                <Route path="/loggs" element={<Logs />} />
                <Route path="/cleartoken" element={<Cleartoken/>}     />
                <Route path="/verify-token" element={<TokenVerificationPage />} />
                <Route path="/admin-create" element={<CreateAdminPage />} />
                <Route path="/adminlist" element={<AdminList />} />
                <Route path="/editadmin" element={<EditAdminModal/>} />
                <Route path="/LandingPage" element={<LandingPage/>}     />
                <Route path="/Submitted-exam" element={<LecturerSubmissions/>}     />
                <Route path="/" element={<JoinLogin/>}     />
                {/* <Route path="/" element={<LoginWrapper />} /> */}
                
            </Routes>
          </Suspense>
        )}
      </ErrorBoundary>
    </SocketContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;


