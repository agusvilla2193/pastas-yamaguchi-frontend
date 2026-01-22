export const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'pastas_preset');

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/dfvj78jdc/image/upload`,
        { method: 'POST', body: data }
    );

    if (!res.ok) throw new Error('Error al subir imagen');

    const fileData = await res.json();
    return fileData.secure_url;
};
