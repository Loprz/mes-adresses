const mapPostsToNews = ({
  order = [],
  posts = {},
}: {
  order?: string[];
  posts?: Record<string, any>;
} = {}) => {
  return order
    .map((postId) => posts[postId])
    .filter((post) => post && !post.delete_at && !post.type)
    .map(({ id, message, create_at }) => ({
      id: id ?? "",
      message: message ?? "",
      date: create_at != null ? String(create_at) : "",
    }));
};

export const fetchNews = async () => {
  const url = process.env.MATTERMOST_CHANNEL_URL;
  if (!url) {
    return [];
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.MATTERMOST_TOKEN ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return mapPostsToNews(data);
};
