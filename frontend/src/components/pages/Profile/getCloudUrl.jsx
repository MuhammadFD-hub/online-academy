const getCloudUrl = (publicId, format, cloudname) => {
  return `https://res.cloudinary.com/${cloudname}/image/upload/${publicId}.${format}`;
};

export default getCloudUrl;
