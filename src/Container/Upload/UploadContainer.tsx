import React, { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { Pica } from 'Lib'

import useAwsS3Client from 'Hook/useAwsS3Client'
import { useAppContext } from 'Container/App'
import { UploadContainerType, UploadContextType, IMAGE_SIZE_ENUM } from './type'

const UploadContext = React.createContext({})
export const useUploadContext = (): UploadContextType => useContext(UploadContext)

const INIT_PREVIEW_LIST = Object.keys(IMAGE_SIZE_ENUM).reduce((acc, key) => ({ ...acc, [key]: null }), {})

const isImage = (file: File) => ['jpg', 'jpeg', 'png', 'gif'].some(key => file.type.includes(key))

const UploadContainer = (props: UploadContainerType) => {
  const navigate = useNavigate()

  const { S3Client } = useAwsS3Client()
  const { currentUser } = useAppContext()
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  let currSearchDir = params.get('currSearchDir')
  currSearchDir = currSearchDir ? currSearchDir.replace(/\/$/, '') : 'upload'

  const [fetching, setFetching] = useState(false)
  const [file, setFile] = useState<File>()
  const [previewList, setPreviewList] = useState<UploadContextType['previewList']>(INIT_PREVIEW_LIST)
  const [checkList, setCheckList] = useState<IMAGE_SIZE_ENUM[]>(Object.values(IMAGE_SIZE_ENUM).filter(key => key !== IMAGE_SIZE_ENUM.CUSTOM))
  const [uploadProgress, setUploadProgress] = useState<Number>(0)
  const [currUploadFileName, setCurrentUploadFileName] = useState<String>('')
  const [customSize, setCustomSize] = useState<UploadContextType['customSize']>({ width: 250, height: 250 })
  const [enableResized, setEnableResized] = useState<UploadContextType['enableResized']>(false)

  const handleOnChangeFile = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    const file = (target.files as FileList)[0]

    const mb = 1024 * 1024

    if (file.size > 5 * mb) {
      e.target.value = ''
      alert('Oops, the file size is very big. max: 5mb')
      return
    }

    try {
      setFetching(true)

      if (enableResized) {
        const currPreviewImg = {
          [IMAGE_SIZE_ENUM.SMALL]: await Pica.Resizer({ file, maxWidth: 355, maxHeight: 245 }),
          [IMAGE_SIZE_ENUM.MEDIUM]: await Pica.Resizer({ file, maxWidth: 694, maxHeight: 460 }),
          [IMAGE_SIZE_ENUM.LARGE]: await Pica.Resizer({ file, maxWidth: 912, maxHeight: 460 }),
          [IMAGE_SIZE_ENUM.XLARGE]: await Pica.Resizer({ file, maxWidth: 1140, maxHeight: 460 }),
          [IMAGE_SIZE_ENUM.CUSTOM]: await Pica.Resizer({ file, maxWidth: customSize?.width, maxHeight: customSize?.height }),
          [IMAGE_SIZE_ENUM.ORIGINAL]: file,
        }

        setPreviewList(currPreviewImg)
      }

      setFile(file)
    } catch (error) {
      console.log({ error })
    } finally {
      setFetching(false)
    }
  }

  const handleOnUpload = async(e: InputEvent) => {
    e.preventDefault()

    const currFile = file as File

    const fileList = checkList.reduce((acc: Promise<any>[], key) => {
      const fileBlob = previewList && previewList[key]

      if (fileBlob) {
        const currFileKey = `${currSearchDir}/${key}/${currFile.name}`

        const params = {
          Body: fileBlob instanceof File ? fileBlob : new File([fileBlob], currFile.name),
          Key: currFileKey,
          ContentType: currFile.type,
          Bucket: currentUser?.bucketName || '',
        }

        acc.push(
          S3Client
            .putObject(params)
            .on('httpUploadProgress', ({loaded, total}) => {
              setCurrentUploadFileName(currFileKey)
              setUploadProgress(loaded / total * 100)
            })
            .promise()
        )
      }

      return acc
    }, [])

    try {
      setFetching(true)

      if (enableResized && isImage(currFile)) {
        await Promise.all(fileList)
      } else {
        await S3Client.putObject({
          Body: file,
          Key: `${currSearchDir}/${currFile.name}`,
          ContentType: currFile.type,
          Bucket: currentUser?.bucketName || '',
        })
        .on('httpUploadProgress', ({loaded, total}) => {
          setCurrentUploadFileName(`upload/files/${currFile.name}`)
          setUploadProgress(loaded / total * 100)
        })
        .promise()
      }
    } catch (err) {
      console.log({ error: err })
    } finally {
      navigate(`/dashboard/${currSearchDir}`)
    }
  }

  const handleCheckboxOnChange = (key: IMAGE_SIZE_ENUM) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = checkList?.includes(key) ? checkList.filter(item => item !== key) : [ ...checkList, key]

    setCheckList(newList)
  }

  const handleEnableResized: UploadContextType['handleEnableResized'] = (e) => {
    setEnableResized(!enableResized)
  }

  useEffect(() => {
    async function formateCustomPreviewImg() {
      if (!file || !customSize?.width || !customSize?.height) return

      try {
        setFetching(true)
        const imageFile = await Pica.Resizer({ file, maxWidth: customSize.width, maxHeight: customSize.height })
        setPreviewList(prevState => ({
          ...prevState,
          [IMAGE_SIZE_ENUM.CUSTOM]: imageFile,
        }))
        setFetching(false)

      } catch (error) {
        console.log({ error })
      }
    }

    formateCustomPreviewImg()
  }, [customSize])

  const value = {
    file,
    previewList,
    fetching,
    checkList,
    uploadProgress,
    currUploadFileName,
    customSize,
    currSearchDir,
    enableResized,
    setFile,
    setPreviewList,
    setCustomSize,
    handleCheckboxOnChange,
    handleOnChangeFile,
    handleOnUpload,
    handleEnableResized,
  }

  return (
    <UploadContext.Provider value={value}>
      {props.children}
    </UploadContext.Provider>
  )
}

export default UploadContainer