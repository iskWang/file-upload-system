import { BaseContainerType } from '../type'

export type AppContainerType = BaseContainerType

export type AppUserTypeKeys = 'accessKey' | 'secretKey' | 'bucketName'

export type AppUserType = {
  [key in AppUserTypeKeys]: string
}

export type AppContextType = {
  currentUser?: AppUserType
  isAuth?: boolean
  changeUserState?: () => void
  handleLoginAction?: () => void
  handleLogoutAction?: () => void
}