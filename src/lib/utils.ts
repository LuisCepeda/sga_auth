export async function makeHttpRequest(url: string, method: HttpMethod, body?: any) {
    console.log('url', url)
    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            ...(body && { body: JSON.stringify(body) })
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            ...(body && { body: JSON.stringify(body) })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status},${await response.json()}`);
        }

        const responseBody = await response.json();
        return responseBody

    } catch (error) {
        console.error('Request failed', error);
        return error
    }
}


export async function checkIfUserIsRegistered(email: string) {

    const url = `${process.env.USERS_DOMAIN}?email=${email}`
    try {
        const user = await makeHttpRequest(url, 'GET')
        if (user.Status !== 'ok') throw new Error('Error while querying the data')
        if (user.Data.length === 0) return false
        return user

    } catch (error) {
        console.error('Request failed:', error)
    }

}

export function formatUserData(userData) {
    const { createdAt, updateAt, password, ...userFilteredData } = userData
    return userFilteredData
}

export function formatUsersData(users: any[]) {
    return users.map(user => formatUserData(user))
}