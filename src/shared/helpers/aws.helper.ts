import { S3 } from 'aws-sdk';
import { awsConfig } from 'src/config/aws.config';

export class AwsHelper {
  static genereatePresignedPostUrl(key: string) {
    const s3 = new S3({
      signatureVersion: 'v4',
      region: 'af-south-1',
    });
    console.log(awsConfig);
    console.log(key);
    const params = {
      Expires: 1800,
      Bucket: awsConfig.bucketName,
      Key: key,
      Conditions: [
        { acl: 'public-read' },
        ['content-length-range', 100, 10000000],
        // ['starts-with', '$key', 'uploads/'],
        ['starts-with', '$Content-Type', 'image/jpg'],
      ],
    };

    return s3.createPresignedPost(params);
  }
}
