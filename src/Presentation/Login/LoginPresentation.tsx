import React from 'react'
import { InputGroup, Button, Spinner } from '@blueprintjs/core'

import { useAppContext, type } from 'Container/App'
import { useLoginContext } from 'Container/Login'

import * as styles from './LoginPresentation.styles'

const LoginFormSection = () => {
  const {
    currentUser,
    changeUserState,
  } = useAppContext()

  const { handleSubmitBtn } = useLoginContext()

  const list: type.AppUserTypeKeys[] = ['accessKey', 'secretKey', 'bucketName']

  return (
    <>
      {
        list.map((key) => (
          <InputGroup
            name={key}
            placeholder={`please enter your ${key}`}
            onChange={changeUserState}
            value={currentUser && currentUser[key]}
          />
        ))
      }
      <Button onClick={handleSubmitBtn}>Submit</Button>
    </>
  )
}

const LoginPresentation = () => {
  const { fetching } = useLoginContext()

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>File Upload System</h1>
        { fetching ? <Spinner /> : <LoginFormSection /> }
      </div>
    </div>
  )
}

export default LoginPresentation