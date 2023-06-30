import React from 'react'
import { Link } from 'react-router-dom'
import { Checkbox } from '@blueprintjs/core'

import { useUploadContext, type } from 'Container/Upload'

import * as styles from './Upload.styles'

const CustomSizeSection = () => {
  const {
    checkList,
    customSize,
    previewList,
    enableResized,
    setCustomSize,
    handleCheckboxOnChange
  } = useUploadContext()

  const value = previewList && previewList[type.IMAGE_SIZE_ENUM.CUSTOM]

  if (!enableResized || !value) return null

  const handleOnChange = (key: 'width' | 'height') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSize && setCustomSize((prevState: any) => ({ ...prevState, [key]: Number(e.target.value) }))
  }

  return (
    <div>
      <Checkbox
        className={styles.previewItem}
        checked={checkList?.includes(type.IMAGE_SIZE_ENUM.CUSTOM)}
        onClick={handleCheckboxOnChange && handleCheckboxOnChange(type.IMAGE_SIZE_ENUM.CUSTOM)}
      >
        Custom Size
      </Checkbox>
      <label>Max width: <input type="number" value={customSize?.width} onChange={handleOnChange('width')} /></label>
      <br />
      <label>Max height: <input type="number" value={customSize?.height} onChange={handleOnChange('height')} /></label>
      <br />
      <img className={styles.previewImgHandle} alt="custom" src={URL.createObjectURL(value)} />
    </div>
  )
}

const PreviewListSection = () => {
  const {
    previewList,
    checkList,
    enableResized,
    handleCheckboxOnChange,
  } = useUploadContext()

  return (
    <div className={styles.listContainer}>
      {
        previewList && Object.keys(previewList).filter(key => key !== type.IMAGE_SIZE_ENUM.CUSTOM).map(key => {
          const value = previewList[key as type.IMAGE_SIZE_ENUM]

          if (!enableResized || !value) return null

          return (
            <div key={key} className={styles.previewItem}>
              <Checkbox
                disabled={key === type.IMAGE_SIZE_ENUM.ORIGINAL}
                checked={checkList?.includes(key as type.IMAGE_SIZE_ENUM)}
                onClick={handleCheckboxOnChange && handleCheckboxOnChange(key as type.IMAGE_SIZE_ENUM)}
              >
                {key}
              </Checkbox>
              <img className={styles.previewImgHandle} alt={key} src={URL.createObjectURL(value)} />
            </div>
          )
        })
      }
      <br />
    </div>
  )
}

const UploadPresentation = () => {
  const {
    fetching,
    uploadProgress,
    currUploadFileName,
    currSearchDir,
    handleOnUpload,
    handleOnChangeFile,
    enableResized,
    handleEnableResized,
  } = useUploadContext()

  console.log({ enableResized })

  return (
    <div>
      <h3>Image Preview</h3>
      <p>Current folder: <Link to={`/dashboard/${currSearchDir}`}>{currSearchDir}</Link></p>
      <Checkbox checked={enableResized} onChange={handleEnableResized}>Need resized image</Checkbox>
      <div className={styles.container}>
        {!fetching && <input type="file" onChange={handleOnChangeFile} />}
        {!fetching && <button onClick={handleOnUpload}>Upload</button>}
        {fetching && <p>Please wait.... {currUploadFileName} - {uploadProgress?.toFixed(2)} %</p>}
      </div>
      <PreviewListSection />
      <CustomSizeSection />
    </div>
  )
}

export default UploadPresentation