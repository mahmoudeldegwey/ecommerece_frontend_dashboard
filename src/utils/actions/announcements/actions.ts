export async function announcementsList(token: string, page: number = 1, params: any = {}) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());

    if (params.name) {
        searchParams.append('name', params.name);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/announcements?${searchParams.toString()}`, {
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

export async function createAnnouncement(token: string, data: {
    name: string;
    message: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.name,
            message: data.message,
            start_at: data.start_at,
            end_at: data.end_at,
            is_active: data.is_active,
        }),
    });

    if (response.status == 422) {
        const errors = await response.json();
        throw new Error(Object.values(errors.errors)[0][0]);
    }

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function editAnnouncement(token: string, id: number, data: {
    name: string;
    message: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
}) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/announcements/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: data.name,
            message: data.message,
            start_at: data.start_at,
            end_at: data.end_at,
            is_active:  data.is_active,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export async function deleteAnnouncement(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/announcements/${id}`, {
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

export async function getAnnouncement(token: string, id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/announcements/${id}`, {
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
