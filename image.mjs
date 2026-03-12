import sharp from 'sharp'

export const getImage = async url => {

  const imageResponse = await fetch(url)
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
  
  // For rotating:
  const rotation = 270 // set to 0 for no rotation
  const rotatedImageBuffer = await sharp(imageBuffer).rotate(270).toBuffer()
  return rotatedImageBuffer.toString('base64')
}

