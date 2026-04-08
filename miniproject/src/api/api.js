const BASE_URL = "http://localhost:5000/api";

export const getMenu = async () => {
        const response = await fetch(`${BASE_URL}/menu`);
    return response.json();
};