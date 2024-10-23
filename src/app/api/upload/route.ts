import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

const s3Config = {
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    }
};

const s3Client = new S3Client(s3Config);

async function handler(req: NextRequest,
) {
    const body = await req.text();
    const JSONBody = JSON.parse(body || JSON.stringify({}))
    const imageBase64 = JSONBody.imageBase64
    const bucket = "fcjimob-uploads-new"
    const base64Data = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const fileName = `uploads/${uuidv4()}.png`;
    const uploadParams = {
        Bucket: bucket,
        Key: fileName,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: 'image/png',
        ACL: ObjectCannedACL.public_read,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        const imageUrl = `https://${bucket}.s3.amazonaws.com/${fileName}`;
        return NextResponse.json({ imageUrl })
    } catch (err) {
        console.log("Error", err);
        return null;
    }

}

export { handler as GET, handler as POST };
