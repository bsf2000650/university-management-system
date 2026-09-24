import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth/Login"
import SignUpPage from "./pages/auth/SignUpPage"
import DashboardLayout from "./components/layout/DashboardLayout"
import DashboardPage from "./pages/dashboard/DashboardPage"
import StudentsPage from "./pages/students/StudentPage"
import TeachersPage from "./pages/teachers/TeachersPage"
import CoursesPage from "./pages/courses/CoursesPage"

// BrowserRouter is what actually talks to the browser's History API —
// it's what makes the URL bar change, back/forward buttons work, and
// deep-linking (someone pasting /students directly into the address bar)
// land on the right page instead of always showing the same component
// like your current App.tsx does.
//
// It needs to wrap the ENTIRE app, once, at the top — never nest a second
// BrowserRouter anywhere else in the tree.
//
// DashboardLayout is the parent layout route: every page nested under it
// renders inside <Outlet /> so the Sidebar + Header appear on all of them.
// Auth pages (login/signup) sit outside it and stay full-screen.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/students' element={<StudentsPage />} />
          <Route path='/teachers' element={<TeachersPage />} />
          <Route path='/courses' element={<CoursesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
