import React from 'react'
import { useNavigate } from 'react-router-dom'

import * as styles from './PrivateLayout.styles'

const Header = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.header}>
      <button onClick={() => navigate('dashboard')}>Dashboard</button>
      <button onClick={() => navigate('logout')}>Logout</button>
    </div>
  )
}

const PrivateLayout = (props: any) => {
  return (
    <div className={styles.container}>
      <Header />
      {props.children}
    </div>
  )
}

export default PrivateLayout