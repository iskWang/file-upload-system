import { BaseContainerType } from '../type'

export type LoginContainerType = BaseContainerType
export type LoginContextType = {
  handleSubmitBtn?: () => void,
  fetching?: boolean
}