export const getStatistics = async (token: string) => {
    try {
        
       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard-statistics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data) {
            throw new Error(`HTTP error! Status:`);
        }

        return data;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}