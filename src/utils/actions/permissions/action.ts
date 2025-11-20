
export const  permissionsList = async (token:string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/permission`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
            "Access-Control-Allow-Origin": "*",
        },
    })

    const data = await response.json();

    if (!data.data) {
        throw new Error(`HTTP error! Status:`);
    }
      
    return data.data;

}