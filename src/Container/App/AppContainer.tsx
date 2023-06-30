import React, {
  useContext,
  useReducer,
  useMemo,
  useEffect,
  ChangeEvent
} from 'react'

import { AppContainerType, AppContextType } from './type'
import reducer, { DEFAULT_STATE, APP_ACTION_TYPES, FILE_UPLOAD_SYSTEM_USER_INFO } from './reducer'

const initialer = () => {
  let state = DEFAULT_STATE

  if (localStorage.getItem(FILE_UPLOAD_SYSTEM_USER_INFO)) {
    state = JSON.parse(localStorage.getItem(FILE_UPLOAD_SYSTEM_USER_INFO) || '')
  }

  return state
}

const AppContext = React.createContext({})
export const useAppContext = (): AppContextType => useContext(AppContext)
export const useAppReducer = () => useReducer(reducer,  initialer())

const AppContainer = (props: AppContainerType) => {
  const [currentUser, dispatch] = useAppReducer()

  const isAuth = useMemo(() => {
    return currentUser.isLogin && [
      currentUser.accessKey,
      currentUser.secretKey
    ].every(key => !!key)
  }, [currentUser])

  const value = {
    currentUser,
    isAuth,
    changeUserState: (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: APP_ACTION_TYPES.CHANGE_USER_STATE,
        [e.target.name]: e.target.value,
      })
    },
    handleLoginAction: () => {
      dispatch({ type: APP_ACTION_TYPES.CHANGE_USER_IS_LOGIN })
    },
    handleLogoutAction: () => {
      dispatch({ type: APP_ACTION_TYPES.CHANGE_USER_IS_LOGOUT })
      localStorage.removeItem(FILE_UPLOAD_SYSTEM_USER_INFO)
    }
  }

  useEffect(() => {
    if (currentUser.isLogin) {
      localStorage.setItem(FILE_UPLOAD_SYSTEM_USER_INFO, JSON.stringify(currentUser))
    }
  }, [currentUser])

  return (
    <AppContext.Provider
      value={value}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContainer