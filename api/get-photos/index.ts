import { APIGatewayProxyEventV2, 
         APIGatewayProxyResultV2,
         Context } 
from "aws-lambda";

const bucketName = process.env.PHOTO_BUCKET_NAME;

async function getPhotos(event: APIGatewayProxyEventV2, context: Context):Promise<APIGatewayProxyResultV2> {
  console.log("I got the bucket Bane and it is " + bucketName);
  return{
    statusCode: 200,
    body:'Hello from lambda, it is live!'
  }

}

export {getPhotos}