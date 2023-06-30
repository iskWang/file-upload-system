import React from 'react'
import { CheckboxProps } from '@blueprintjs/core'
import { BaseContainerType } from '../type'

export enum IMAGE_SIZE_ENUM {
  SMALL = '355x245',
  MEDIUM = '694x460',
  LARGE = '912x460',
  XLARGE = '1140x460',
  ORIGINAL = 'original',
  CUSTOM = 'custom',
}

export type UploadContainerType = BaseContainerType

export type UploadContextType = {
  file?: File
  fetching?: boolean
  previewList?: {
    [key in IMAGE_SIZE_ENUM]?: File | Blob | null
  }
  checkList?: IMAGE_SIZE_ENUM[]
  uploadProgress?: Number
  currUploadFileName?: String
  customSize?: {
    width: number,
    height: number
  }
  currSearchDir?: string
  enableResized?: boolean
  setCustomSize?: typeof React.useState
  handleOnUpload?: () => void
  handleOnChangeFile?: () => void
  handleOnHomeClick?: () => void
  handleCheckboxOnChange?: (key: IMAGE_SIZE_ENUM) => CheckboxProps['onChange']
  handleEnableResized?: CheckboxProps['onChange']
}
