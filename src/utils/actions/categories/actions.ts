export const categoriesList = async (token: string, page: number = 1, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams({
            ...params,
            page: page.toString()
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data.data) {
        throw new Error(`HTTP error! Status:`);
        }

        return data;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const createCategory = async (token: string, name: string, name_ar: string, parent_id: string, image: File | null) => {
    try {
        
        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('name_ar', name_ar);
        formData.append('parent_id', parent_id);

        if (image) {
            formData.append('image', image);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if(response.status === 422){
            const errors = await response.json();
            throw new Error(Object.values(errors.errors)[0][0]);
        }

        if (!response.ok) {
            throw new Error('Failed to create category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const editCategory = async (token: string, id: number, name: string, name_ar: string, parent_id: string, image: File | null) => {
    try {

        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('name_ar', name_ar);
        formData.append('parent_id', parent_id);

        if (image) {
            formData.append('image', image);
        }

        console.log(formData,'formData category')

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                //'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });

        if(response.status === 422){
            const errors = await response.json();
            throw new Error(Object.values(errors.errors)[0][0]);
        }

        if (!response.ok) {
            throw new Error('Failed to update category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteCategory = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const categorySingle = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }

        const data = await response.json();

        if (!data.data) {
        throw new Error(`HTTP error! Status:`);
        }
        
        return data.data;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
