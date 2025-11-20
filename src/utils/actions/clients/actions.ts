
interface paramsSearch {
    name?:string
    email?:string
}

export const clientsList = async (token:string, page:number = 1, params:paramsSearch = {}) => {
    
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (params.name) {
        queryParams.append("name", params.name);
    }

    if (params.email) {
        queryParams.append("email", params.email);
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients?${queryParams.toString()}`, 
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
    });

    const data = await response.json();

    if (!data.data) {
      throw new Error(`HTTP error! Status:`);
    }
    
    return data;
};

export const clientSingle = async (token:string, client_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
    });

    const data = await response.json();

    if (!data.data) {
      throw new Error(`HTTP error! Status:`);
    }
    
    return data.data;
};

export const createClient = async (token:string,username:string, email:string, password:string, password_confirmation:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username, 
            email: email,
            password: password,
            password_confirmation: password_confirmation
        }),
    });
    
    return await response.json();
}

export const editClient = async (token:string, client_id:number, username:string, email:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client_id}`, {
        method: "PUT",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            username: username, 
            email: email
        }),
    });
    
    return await response.json();
}

export const editPassword = async (token:string, client_id:number, password:string, password_confirmation:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/update-password/${client_id}`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            password: password, 
            password_confirmation: password_confirmation
        }),
    });
    
    return await response.json();
}

export const deleteClient = async (token:string, client_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/clients/${client_id}`, {
        method: "DELETE",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
    
    return await response.json();
}
