const API_BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function addStory({ token, formData }) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error;
  }
}

export async function getStoriesWithLocation(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories?location=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
}

export async function getStoryDetail(token, id) {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error fetching story detail:', error);
    throw error;
  }
}