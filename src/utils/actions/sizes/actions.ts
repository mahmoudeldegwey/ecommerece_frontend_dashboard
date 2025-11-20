"use client";

export const sizesList = async (token: string, page: number = 1, params: any = {}) => {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        
        if (params.name) {
            queryParams.append('name', params.name);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sizes?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sizes');
        }

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

export const createSize = async (token: string, name: string, name_ar: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sizes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name:name, name_ar:name_ar }),
        });

        if (!response.ok) {
            throw new Error('Failed to create size');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const editSize = async (token: string, id: number, name: string, name_ar: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sizes/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name:name, name_ar:name_ar }),
        });

        if (!response.ok) {
            throw new Error('Failed to update size');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const deleteSize = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sizes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete size');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const getSize = async (token: string, id: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sizes/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch size');
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
