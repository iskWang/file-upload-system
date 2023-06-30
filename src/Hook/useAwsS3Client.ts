import AWS from 'aws-sdk'
import { useAppContext } from 'Container/App'

const useAwsS3Client = () => {
  const { currentUser } = useAppContext()

  const S3Client = new AWS.S3({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: currentUser?.accessKey || '',
      secretAccessKey: currentUser?.secretKey || ''
    },
    params: {
      Bucket: currentUser?.bucketName || ''
    },
    region: process.env.REACT_APP_AWS_REGION || 'ap-northeast-1'
  })

  return {
    S3Client,
    currentUser,
  }
}

export default useAwsS3Client