export const productsList = async (token: string, page: number = 1, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams({
            ...params,
            page: page.toString()
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products?${queryParams}`, {
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

export const createProduct = async (token: string, data: {
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    price: string;
    sale_price: string;
    quantity: string;
    brand_id: string;
    has_free_shipping: boolean;
    has_multi_color: boolean;
    has_multi_size: boolean;
    sku: string;
    categories: number[];
    colors: number[];
    sizes: number[];
    main_image: File | null;
}) => {
    
    try {
        const formData = new FormData();
        
        formData.append('name', data.name)
        formData.append('name_ar', data.name_ar)
        formData.append('description', data.description)
        formData.append('description_ar', data.description_ar)
        formData.append('price', data.price)
        formData.append('sale_price', data.sale_price)
        formData.append('quantity', data.quantity)
        formData.append('brand_id', data.brand_id)
        
        if(data.has_free_shipping){
            formData.append('has_free_shipping',1)
        }else{
            formData.append('has_free_shipping',0)
        }
        
        if(data.has_multi_color) {
            formData.append('has_multi_color', 1)
        }else{
            formData.append('has_multi_color', 0)
        }
        //console.log(typeof(data.has_multi_size) ,"data.has_multi_size ")
        if(data.has_multi_size) {
            formData.append('has_multi_size', 1)
        }else{
            formData.append('has_multi_size', 0)
        }

        formData.append('sku', data.sku)

        data.categories.forEach((categoryId) => {
            formData.append('categories[]', categoryId.toString());
        });
    
        if(data.has_multi_color && data.colors ){
            data.colors.forEach((color,index) => {
                formData.append(`colors[${index}][color_id]`, color.toString());
            });
        }

        if(data.has_multi_size   && data.sizes ){
            data.sizes.forEach((size,index) => {
                formData.append(`sizes[${index}][size_id]`, size.toString());
            });
        }

        formData.append('main_image', data.main_image)

        //console.log(data.brand_id,'brand_id');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
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
            throw new Error('Failed to create product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateProduct = async (token: string, id: number ,data: {
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
    price: string;
    sale_price: string;
    quantity: number;
    brand_id: string;
    has_free_shipping: boolean;
    has_multi_color: boolean;
    has_multi_size: boolean;
    //sku: string;
    categories: number[];
    colors: number[];
    sizes: number[];
    main_image: File | null;
}) => {
    
    try {
        console.log('data updateProduct function:', data);
        const formData = new FormData();
        
        formData.append('name', data.name)
        formData.append('name_ar', data.name_ar)
        formData.append('description', data.description)
        formData.append('description_ar', data.description_ar)
        formData.append('price', data.price)
        formData.append('sale_price', data.sale_price)
        formData.append('quantity', data.quantity)
        formData.append('brand_id', data.brand_id)
        
        if(data.has_free_shipping){
            formData.append('has_free_shipping',1)
        }else{
            formData.append('has_free_shipping',0)
        }
        
        if(data.has_multi_color) {
            formData.append('has_multi_color', 1)
        }else{
            formData.append('has_multi_color', 0)
        }

        if(data.has_multi_size) {
            formData.append('has_multi_size', 1)
        }else{
            formData.append('has_multi_size', 0)
        }

        data.categories.forEach((categoryId) => {
            formData.append('categories[]', categoryId.toString());
        });
    
        if(data.has_multi_color && data.colors ){
            data.colors.forEach((color,index) => {
                formData.append(`colors[${index}][color_id]`, color.toString());
            });
        }

        if(data.has_multi_size   && data.sizes ){
            data.sizes.forEach((size,index) => {
                formData.append(`sizes[${index}][size_id]`, size.toString());
            });
        }

        formData.append('main_image', data.main_image)

        //console.log(data.brand_id,'brand_id');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
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
            throw new Error('Failed to update product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteProduct = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getProduct = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product');
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
