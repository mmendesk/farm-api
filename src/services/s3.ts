import { Config, S3 } from "aws-sdk";

enum logoTypes {
  "primaryLogo" = "primaryLogo",
  "secondaryLogo" = "secondaryLogo",
}

export default class S3Service {
  public s3: S3;
  constructor() {
    const config = new Config({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: "us-east-1",
      apiVersion: "2006-03-01",
    });

    config.setPromisesDependency(require("bluebird"));

    this.s3 = new S3(config);
  }

  async uploadBase64(base64, clientId, logoType: logoTypes) {
    const base64Data = Buffer.from(base64.split("base64,")[1], "base64");

    await this.s3
      .createBucket({
        Bucket: process.env.S3_BUCKET,
        ACL: "public-read",
      })
      .promise();

    const type = base64.split(";")[0].split("/")[1];
    const params = {
      Key: `${clientId}/${logoType}.${type}`,
      Bucket: process.env.S3_BUCKET,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    return this.s3.upload(params).promise();
  }

  async deleteImage(path) {
    return this.s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: path,
      })
      .promise();
  }
}
