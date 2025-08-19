const useCloudUpload = () => {
  async function uploadImg(file, folder) {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", `web/online_academy/${folder}`);
    form.append("upload_preset", "unsigned_uploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzsxpy7qy/image/upload",
      { method: "POST", body: form }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return { public_id: data.public_id, format: data.format };
  }
  return { uploadImg };
};

export default useCloudUpload;
