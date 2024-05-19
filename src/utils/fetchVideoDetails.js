import axios from "axios";

export const fetchVideoDetails = async (videoId) => {
  try {
    const apiKey = "AIzaSyB47RISrDvfNVN2DoqvG1iIXjnrwb1ezm8";
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch video details. Status: " + response.status
      );
    }

    // Check if response contains any items.
    if (response.data.items.length === 0) {
      throw new Error("Video not found");
    }

    return {
      title: response.data.items[0].snippet.title,
      description: response.data.items[0].snippet.description,
    };
  } catch (error) {
    console.log("Error fetching video details. ");
    // throw error;
  }
};
