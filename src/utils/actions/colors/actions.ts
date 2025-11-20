export async function colorsList(token: string, page: number = 1, params: any = {}) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());

    if (params.name) {
        searchParams.append('name', params.name);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/colors?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function createColor(token: string, name: string, name_ar: string, value: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/colors`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:name, name_ar:name_ar, value:value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function editColor(token: string, id: number, name: string, name_ar: string, value: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/colors/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:name, name_ar:name_ar, value:value }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function deleteColor(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/colors/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function getColor(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/colors/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}
