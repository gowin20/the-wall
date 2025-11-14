import { imageSize } from "image-size";

export const imageSizeMetadata = async (imageBuffer) => {
    
    const dimensions = imageSize(imageBuffer);

    return {
        "width": String(dimensions.width),
        "height": String(dimensions.height)
    }
}