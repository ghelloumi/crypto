export async function handleErrors(response) {
    if (!response.ok) {
        const data = await response.json();
        throw data.message || response.statusText;
    }
    return response;
}
