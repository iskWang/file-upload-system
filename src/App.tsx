import React from 'react'
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AppContainer, { useAppContext } from 'Container/App'
import DashboardScene from 'Scene/Dashboard'
import LoginScene from 'Scene/Login'
import UploadScene from 'Scene/Upload'
import LogoutScene from 'Scene/Logout'

import PrivateLayout from 'Component/PrivateLayout'

// Ref. https://stackoverflow.com/a/69592617
const PrivateRoute = (props: any) => {
  const { isAuth } = useAppContext()

  if (!isAuth) return <Navigate to="/login" />

  return (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  )
}

const RootScene = () => {
  const { isAuth } = useAppContext()

  const path = isAuth ? '/dashboard' : '/login'

  return <Navigate to={path} />
}

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<RootScene />} />
      <Route path="/login" element={<LoginScene />} />
      <Route path="/logout" element={<LogoutScene />} />
      <Route element={<PrivateRoute />}>
        <Route path="dashboard/*" element={<DashboardScene />} />
        <Route path="upload" element={<UploadScene />} />
      </Route>
    </Routes>
  )
}

const App = () => {
  return (
    <AppContainer>
      <Router />
    </AppContainer>
  )
}

export default App;
