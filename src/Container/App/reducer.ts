import { AppUserType } from './type'

export const FILE_UPLOAD_SYSTEM_USER_INFO = 'FILE_UPLOAD_SYSTEM_USER_INFO'

export enum APP_ACTION_TYPES {
  CHANGE_USER_STATE = 'CHANGE_USER_STATE',
  CHANGE_USER_IS_LOGIN = 'CHANGE_USER_IS_LOGIN',
  CHANGE_USER_IS_LOGOUT = 'CHANGE_USER_IS_LOGOUT'
}

export const DEFAULT_STATE: AppUserType & { isLogin: boolean } = {
  accessKey: '',
  secretKey: '',
  bucketName: '',
  isLogin: false,
}

const reducer = (
  state = DEFAULT_STATE,
  action: {
    type: APP_ACTION_TYPES,
    [key: string]: any
  }
) => {
  const { type, ...value } = action

  switch(action.type){
    case APP_ACTION_TYPES.CHANGE_USER_STATE: {
      return { ...state, ...value }
    }

    case APP_ACTION_TYPES.CHANGE_USER_IS_LOGIN: {
      return { ...state, isLogin: true }
    }

    case APP_ACTION_TYPES.CHANGE_USER_IS_LOGOUT: {
      return DEFAULT_STATE
    }

    default: return DEFAULT_STATE
  }
}

export default reducer