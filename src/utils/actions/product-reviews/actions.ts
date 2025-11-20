export const productReviewsList = async (token:string, page:number = 1, params:paramsSearch = {}) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (params.name) {
        queryParams.append("name", params.name);
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product-reviews?${queryParams.toString()}`, 
        {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
    });

    console.log(response)

    const data = await response.json();

    if (!data.data) {
      throw new Error(`HTTP error! Status:`);
    }
    
    return data;
};

export const deleteProductReview = async (token:string, id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product-reviews/${id}`, 
        {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}

export const approveProductReview = async (token:string, id:number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product-reviews/${id}/approve-review`, 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
}
