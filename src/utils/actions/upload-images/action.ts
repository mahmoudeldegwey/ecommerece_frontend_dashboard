
export const uploadImage = async (token: string, data: {
    model_id: string | number;
    model_type: string; 
    destination: string; 
    file: File | null;
}) => {
    
    try {
        const formData = new FormData();
    
        formData.append('file', data.file)
        formData.append('model_id', data.model_id)
        formData.append('model_type', data.model_type) 
        formData.append('destination', data.destination) 

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                //'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        console.log('Response:', response);
        // if (!response.ok) {
        //     throw new Error('Failed to upload image');
        // }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};