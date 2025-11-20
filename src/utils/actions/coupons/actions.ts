export async function couponsList(token: string, page: number = 1, params: any = {}) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());

    if (params.name) {
        searchParams.append('name', params.name);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupons?${searchParams.toString()}`, {
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

export async function createCoupon(token: string, data: {
    name: string;
    code: string;
    start_at: string;
    end_at: string;
    type: 'fixed' | 'percentage';
    amount: number;
    max_usage: number;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupons`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.name,
            code: data.code,
            start_at: data.start_at,
            end_at: data.end_at,
            type: data.type,
            amount: data.amount,
            max_usage: data.max_usage,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function editCoupon(token: string, id: number, data: {
    name: string;
    code: string;
    start_at: string;
    end_at: string;
    type: 'fixed' | 'percentage';
    amount: number;
    usage: number;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupons/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.name,
            code: data.code,
            start_at: data.start_at,
            end_at: data.end_at,
            type: data.type,
            amount: data.amount,
            usage: data.usage,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function deleteCoupon(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupons/${id}`, {
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

export async function getCoupon(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/coupons/${id}`, {
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
