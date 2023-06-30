// Ref. https://codesandbox.io/s/77z3f?file=/src/App.tsx
import pica from 'pica'

export type ResizerProps = {
  file?: File
  maxWidth?: number
  maxHeight?: number
}

const imageLoader = (file: File) => {
  return new Promise<{
    image: HTMLImageElement
    width: number
    height: number
  }>((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.onerror = (err) => reject(err)
    image.onload = (e) => {
      const { width, height } = e.target as HTMLImageElement

      resolve({
        image,
        width,
        height,
      })
    }

    const reader = new FileReader()
    reader.onerror = (err) => reject(err)
    reader.onload = () => {
      image.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export const Resizer = async({
  file,
  maxWidth,
  maxHeight,
}: ResizerProps): Promise<Blob | null> => {
  const resizer = new pica()

  let resizedFile = null

  if (file) {
    const { image, width, height } = await imageLoader(file)
    let ratio = 1

    if (maxWidth && maxHeight) {
      if (width > maxWidth) {
        ratio = maxWidth / width
      } else if (height > maxHeight) {
        ratio = maxHeight / height
      }
    }

    const canvas = document.createElement('canvas')
    canvas.width = width * ratio
    canvas.height = height * ratio

    resizedFile = await resizer.resize(image, canvas)
    resizedFile = await resizer.toBlob(resizedFile, file.type)
    // resizedFile = new File([resizedFile], file.name)
  }

  return resizedFile
}
