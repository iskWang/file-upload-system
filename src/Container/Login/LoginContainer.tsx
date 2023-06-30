import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom";

import useAwsS3Client from 'Hook/useAwsS3Client'
import { useAppContext } from 'Container/App'
import { LoginContainerType, LoginContextType } from './type'

const LoginContext = React.createContext({})
export const useLoginContext = (): LoginContextType => useContext(LoginContext)

const LoginContainer = (props: LoginContainerType) => {
  const navigate = useNavigate()
  const { S3Client } = useAwsS3Client()
  const { handleLoginAction } = useAppContext()

  const [fetching, setFetching] = useState(false)

  const handleSubmitBtn = async() => {
    try {
      setFetching(true)
      const response = await S3Client.listObjects().promise()

      if (response.$response.data) {
        handleLoginAction && handleLoginAction()
        navigate('/dashboard')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setFetching(false)
    }
  }

  const value = {
    handleSubmitBtn,
    fetching,
  }

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContainer