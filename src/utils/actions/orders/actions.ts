export const ordersList = async (token: string, page: number = 1, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams({
            ...params,
            page: page.toString()
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders?${queryParams}`, {
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

export const getOrder = async (token: string, oder_id: number = 1) => {
    try {
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/${oder_id}`, {
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

        return data.data;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const updateOrderStatus = async (token: string, oder_id: number = 1, status: string) => {
    try {
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders/update-status/${oder_id}`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status })
        });

        return await response.json();

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const downloadInvoice = async (token: string, oder_id: number = 1) => {
    try{    

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${oder_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/pdf',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to preview invoice');
        }

        return response;
        
    } catch (error){
        console.error('Error:', error);
        throw error;
    }
};