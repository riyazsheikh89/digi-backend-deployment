const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  BUCKET_NAME,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = require("./env-variables");

// configuration
const s3Client = new S3Client({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});


// Function for uploading file to S3 bucket 
function uploadFile(fileBuffer, fileName, mimetype) {
  try {
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    return s3Client.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    console.log("Error! inside uploadFile");
    throw error;
  }
}


// Function for deleting file from S3 bucket
function deleteFile(fileName) {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };
  
    return s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.log("Error! inside deleteFile function");
    throw error;
  }
}


// Function for generating secure signed url for S3 objects
async function getFileSignedUrl(key) {
  try {
    const getParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(getParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
    // expiresIn : in seconds
  } catch (error) {
    console.log("Error! inside getFileSignedUrl function");
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  getFileSignedUrl,
};
