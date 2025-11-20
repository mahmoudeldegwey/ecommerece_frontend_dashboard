interface paramsSearch {
    name?:string
}

export const brandsList = async (token:string, page:number = 1, params:paramsSearch = {}) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (params.name) {
        queryParams.append("name", params.name);
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands?${queryParams.toString()}`, 
        {
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
    
    return data;
};

export const brandSingle = async (token:string, brand_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands/${brand_id}`, {
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

export const createBrand = async (token:string, name:string,name_ar:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands`, {
        method: "POST",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            name: name,
            name_ar: name_ar
        }),
    });
    
    return await response.json();
}

export const editBrand = async (token: string, brand_id: number, name: string, name_ar: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands/${brand_id}`, {
        method: "PUT",
        headers: {  
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            name: name,
            name_ar: name_ar
        }),
    });
    
    return await response.json();
}

export const deleteBrand = async (token:string, brand_id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/brands/${brand_id}`, {
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
