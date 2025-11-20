
interface paramsSearch {
    name?:string
    email?:string
}

export const usersList = async (token:string, page:number = 1, params:paramsSearch = {}) => {
    
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (params.name) {
        queryParams.append("name", params.name);
    }

    if (params.email) {
        queryParams.append("email", params.email);
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users?${queryParams.toString()}`, 
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

export const userSingle = async (token:string, user_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${user_id}`, {
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
    
    return data.data;
};

export const createUser = async (token:string,name:string, email:string, password:string, password_confirmation:string ,role_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name, 
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            role_id: role_id
        }),
    });
    
    return await response.json();
}

export const editUser = async (token:string, user_id:number, name:string, email:string, role_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${user_id}`, {
        method: "PUT",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            name: name, 
            email: email,
            role_id: role_id
        }),
    });
    
    return await response.json();
}

export const editPassword = async (token:string, user_id:number, password:string, password_confirmation:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/update-password/${user_id}`, {
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

export const deleteUser = async (token:string, user_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${user_id}`, {
        method: "DELETE",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        }
    });
    
    return await response.json();
}
