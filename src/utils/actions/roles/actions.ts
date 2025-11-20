
interface paramsSearch {
    name?:string
}

export const rolesList = async (token:string, page:number = 1, params:paramsSearch = {}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles?page=${page}&name=${Object.keys(params).length !== 0 ? params.name : ""}`, {
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

export const roleSingle = async (token:string, role_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles/${role_id}`, {
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

export const createRole = async (token:string,name:string, permissions:number[]) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "role":{ name: name, guard_name: "admin" },
            "permissions": permissions
        }),
    });
    
    return await response.json();
}

export const editRole = async (token:string, role_id:number, name:string, permissions:number[]) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles/${role_id}`, {
        method: "PUT",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "role":{ name: name, guard_name: "admin" },
            "permissions": permissions
        }),
    });
    
    return await response.json();
}

export const deleteRole = async (token:string, role_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/roles/${role_id}`, {
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
