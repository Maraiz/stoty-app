export async function addStory({ token, formData }) {
    try {
      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menambahkan cerita');
      }
  
      return result;
    } catch (error) {
      throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
  }
  