import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from 'Container/App'

const LogoutScene = () => {
  const { handleLogoutAction } = useAppContext()

  useEffect(() =>{
    handleLogoutAction && handleLogoutAction()
  }, [])

  return <Navigate to='/' />
}

export default LogoutScene