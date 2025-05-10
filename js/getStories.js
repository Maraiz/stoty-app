export async function getStories(token) {
    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok && !result.error) {
        return result.listStory; 
      } else {
        throw new Error(result.message || "Gagal mengambil cerita");
      }
    } catch (error) {
      throw new Error("Terjadi kesalahan saat mengambil data cerita");
    }
  }
  