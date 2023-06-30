import React, {
  useState,
  useEffect,
  useContext,
} from 'react'
import { useParams } from 'react-router-dom'

import useAwsS3Client from 'Hook/useAwsS3Client'
import {
  DashboardContainerType,
  DashboardContextType,
  DashboardDataType,
} from './type'

const DashboardContext = React.createContext({})
export const useDashboardContext = (): DashboardContextType => useContext(DashboardContext)

const formatSearchDirStr = (str = '') => {
  if (str[str.length -1] !== '/') {
    str = `${str}/`
  }


  return str
}

const DashboardContainer = (props: DashboardContainerType) => {
  const { S3Client, currentUser } = useAwsS3Client()

  const [data, setData] = useState<DashboardDataType[]>([])
  const [fetching, setFetching] = useState<DashboardContextType['fetching']>(false)

  const currSearchDir = formatSearchDirStr(useParams()['*'])

  const formatDisplayData = (items: DashboardDataType[]) => items.reduce((acc: DashboardDataType[], curr) => {
    if (!curr || !curr.Key) return acc

    const displayKey = currSearchDir === '/' ? curr.Key : curr.Key.replace(currSearchDir, '')

    // current sub-folder
    if (!displayKey) return acc

    acc.push({
      ...curr,
      displayKey,
      isDir: displayKey.includes('/')
    })

    return acc
  }, [])

  const handleContentItem = async(content: Omit<DashboardDataType, 'preview'>)=> {
    const url = `https://${currentUser?.bucketName}/${content.Key}`

    const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(key => content.Key?.includes(key))

    const type = content.Key && content.Key.includes('.') && content.Key.split('.').pop()

    const mb = 1024 * 1024

    const preview = isImage && (content.Size as number) < mb && {
      original: url,
    }

    return {
      ...content,
      type,
      preview,
    }
  }

  const fetchData = async(searchDir: string) => {
    let currData: any[] = []

    try {
      setFetching(true)

      const response = await S3Client.listObjectsV2({
        Bucket: currentUser?.bucketName || '',
        Delimiter: `/`,
        Prefix: searchDir === '/' ? '' : searchDir,
      }).promise()

      if (Array.isArray(response.Contents)) {
        currData = response.Contents
        currData = await Promise.all(currData.map(handleContentItem)) as DashboardDataType[]

        response.CommonPrefixes?.filter(el => el.Prefix !== undefined).forEach(el => currData.push({ Key: el.Prefix, isDir: true }))

        currData = formatDisplayData(currData)
        currData = currData.sort(item => item.isDir ? -1 : 1)
      }

      setData(currData)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  const handleOnDelete = (item: DashboardDataType) => async(e: InputEvent) => {
    const confirm = window.prompt(`Are you sure?\nPlease type ${item.displayKey} in input field`)

    if (confirm !== item.displayKey) {
      return
    }

    try {
      // @ts-ignore-start
      await S3Client.deleteObject({
        Bucket: currentUser?.bucketName || '',
        Key: item.Key
      }).promise()
      // @ts-ignore-end
      fetchData(currSearchDir)
    } catch (error) {
      console.log({ error })
    }
  }

  useEffect(() => {
    fetchData(currSearchDir)
  }, [currSearchDir])

  return (
    <DashboardContext.Provider
      value={{
        data,
        fetching,
        handleOnDelete,
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  )
}

export default DashboardContainer