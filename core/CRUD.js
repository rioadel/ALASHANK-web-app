

const apiBaseUrl = 'http://51.68.175.80/test/api';
const apiKey = 'ac67edbe1ce9c1da5a5b3eb0fd682ea2';
const headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
}
// Create (POST)
export async function postData(endpointUrl, resource) {
    try {
        const response = await fetch(`${apiBaseUrl}/${endpointUrl}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(resource),
        });
        const data = await response.json();
        if (!response.ok) {
            return { status: false, message: data.message };
        }
        else {
            return { status: true, data: data};
        }
    } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
    }
}

// Read (GET)
export async function getResource(endpointUrl) {
    try {
        const response = await fetch(`${apiBaseUrl}/${endpointUrl}`,
            {
                method: 'GET',
                headers: headers,
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch resource');
        }
        return data;
    } catch (error) {
        console.error('Error fetching resource:', error);
        throw error;
    }
}

// Update (PUT)
export async function updateResource(endpointUrl, updatedResource) {
    try {
        const response = await fetch(`${apiBaseUrl}/${endpointUrl}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedResource),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update resource');
        }
        return data;
    } catch (error) {
        console.error('Error updating resource:', error);
        throw error;
    }
}

// Delete (DELETE)
export async function deleteResource(endpointUrl) {
    try {
        const response = await fetch(`${apiBaseUrl}/${endpointUrl}`, {
            method: 'DELETE',
            headers: headers
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete resource');
        }
        return { message: 'Resource deleted successfully' };
    } catch (error) {
        console.error('Error deleting resource:', error);
        throw error;
    }
}

// (async () => {
//     try {
//         // Create a resource
//         const newResource = await createResource({ name: 'Example', description: 'An example resource' });
//         console.log('Created:', newResource);

//         // Read a resource
//         const fetchedResource = await getResource(newResource.id);
//         console.log('Fetched:', fetchedResource);

//         // Update a resource
//         const updatedResource = await updateResource(newResource.id, { name: 'Updated Example' });
//         console.log('Updated:', updatedResource);

//         // Delete a resource
//         const deletionMessage = await deleteResource(newResource.id);
//         console.log(deletionMessage);
//     } catch (error) {
//         console.error(error);
//     }
// })();
