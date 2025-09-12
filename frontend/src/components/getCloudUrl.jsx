const getCloudUrl = (publicId, format) => {
  if (!publicId || !format) return null;
  return `https://res.cloudinary.com/dzsxpy7qy/image/upload/${publicId}.${format}`;
};

export default getCloudUrl;
