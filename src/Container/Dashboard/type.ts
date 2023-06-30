import { S3 } from 'aws-sdk'
import React from 'react'
import { BaseContainerType } from '../type'

export type DashboardContainerType = BaseContainerType

export type DashboardDirDataType = {
  isDir: boolean
  displayKey?: string
}

export type DashboardFileDataType = {
  preview?: {
    original: string
  },
  displayKey?: string
}

export type DashboardDataType = S3.Object & (DashboardDirDataType & DashboardFileDataType)

export type DashboardContextType = {
  data?: null | Array<any>
  fetching?: boolean
  handleOnDelete?: (item: DashboardDataType) => (e: React.MouseEvent<HTMLButtonElement>) => void
}