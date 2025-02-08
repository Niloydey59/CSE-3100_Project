const data = {
  users: [
    {
      username: "JohnDoe",
      email: "johm@5678.com",
      password: "1234",
      image: "path/to/image1.jpg",
    },
    {
      username: "JaneDoe",
      email: "jane@45ada.com",
      password: "5678",
      image: "path/to/image2.jpg",
    },
  ],
  posts: [
    {
      username: "JohnDoe",
      title: "First Post",
      content: "This is the content of the first post.",
      tags: ["introduction", "welcome"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage1.jpg"], // Add image attribute
    },
    {
      username: "JaneDoe",
      title: "Second Post",
      content: "This is the content of the second post.",
      tags: ["update", "news"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage2.jpg"], // Add image attribute
    },
    {
      username: "JohnDoe",
      title: "Third Post",
      content: "This is the content of the third post.",
      tags: ["announcement", "event"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage3.jpg"], // Add image attribute
    },
    {
      username: "JaneDoe",
      title: "Fourth Post",
      content: "This is the content of the fourth post.",
      tags: ["discussion", "general"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage4.jpg"], // Add image attribute
    },
    {
      username: "JohnDoe",
      title: "Fifth Post",
      content: "This is the content of the fifth post.",
      tags: ["question", "help"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage5.jpg"], // Add image attribute
    },
    {
      username: "JaneDoe",
      title: "Sixth Post",
      content: "This is the content of the sixth post.",
      tags: ["feedback", "suggestion"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage6.jpg"], // Add image attribute
    },
    {
      username: "JohnDoe",
      title: "Seventh Post",
      content: "This is the content of the seventh post.",
      tags: ["announcement", "update"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage7.jpg"], // Add image attribute
    },
    {
      username: "JaneDoe",
      title: "Eighth Post",
      content: "This is the content of the eighth post.",
      tags: ["discussion", "topic"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage8.jpg"], // Add image attribute
    },
    {
      username: "JohnDoe",
      title: "Ninth Post",
      content: "This is the content of the ninth post.",
      tags: ["question", "query"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage9.jpg"], // Add image attribute
    },
    {
      username: "JaneDoe",
      title: "Tenth Post",
      content: "This is the content of the tenth post.",
      tags: ["feedback", "review"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["677b51b0eaf2d90a527f929f"], // Replace with valid comment IDs
      image: ["path/to/postImage10.jpg"], // Add image attribute
    },
  ],

  groups: [
    {
      name: "Group 1",
      description: "This is the description of Group 1.",
      members: [
        {
          user: "674e82f3372c555ca3bcd313", // Replace with valid member ID
          joinedAt: new Date("2024-12-20T10:00:00Z"),
          role: "member",
        },
      ],
      admin: "674e82f3372c555ca3bcd312", // Replace with a valid admin ID
    },
    {
      name: "Group 2",
      description: "This is the description of Group 2.",
      members: [
        {
          user: "674e82f3372c555ca3bcd313", // Replace with valid member ID
          joinedAt: new Date("2024-12-20T11:00:00Z"),
          role: "member",
        },
        {
          user: "60d0fe4f5311236168a109cc", // Replace with another valid member ID
          joinedAt: new Date("2024-12-21T12:00:00Z"),
          role: "member",
        },
      ],
      admin: "674e82f3372c555ca3bcd312", // Replace with a valid admin ID
    },
    {
      name: "Group 3",
      description: "This is the description of Group 3.",
      members: [
        {
          user: "674e82f3372c555ca3bcd313", // Replace with valid member ID
          joinedAt: new Date("2024-12-22T13:00:00Z"),
          role: "admin",
        },
      ],
      admin: "674e82f3372c555ca3bcd312", // Replace with a valid admin ID
    },
  ],

  groupPosts: [
    {
      username: "JohnDoe",
      title: "First Post",
      content: "This is the content of the first post.",
      tags: ["introduction", "welcome"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage1.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JaneDoe",
      title: "Second Post",
      content: "This is the content of the second post.",
      tags: ["update", "news"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage2.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JohnDoe",
      title: "Third Post",
      content: "This is the content of the third post.",
      tags: ["announcement", "event"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage3.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JaneDoe",
      title: "Fourth Post",
      content: "This is the content of the fourth post.",
      tags: ["discussion", "general"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage4.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JohnDoe",
      title: "Fifth Post",
      content: "This is the content of the fifth post.",
      tags: ["question", "help"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage5.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JaneDoe",
      title: "Sixth Post",
      content: "This is the content of the sixth post.",
      tags: ["feedback", "suggestion"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage6.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JohnDoe",
      title: "Seventh Post",
      content: "This is the content of the seventh post.",
      tags: ["announcement", "update"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage7.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JaneDoe",
      title: "Eighth Post",
      content: "This is the content of the eighth post.",
      tags: ["discussion", "topic"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage8.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JohnDoe",
      title: "Ninth Post",
      content: "This is the content of the ninth post.",
      tags: ["question", "query"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage9.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
    {
      username: "JaneDoe",
      title: "Tenth Post",
      content: "This is the content of the tenth post.",
      tags: ["feedback", "review"],
      author: "60d0fe4f5311236168a109ca", // Replace with a valid author ID from your database
      likes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      dislikes: ["60d0fe4f5311236168a109cb"], // Replace with valid author IDs
      comments: ["60d0fe4f5311236168a109cc"], // Replace with valid comment IDs
      image: ["path/to/postImage10.jpg"], // Add image attribute
      groupId: "676e3877314a944f2037a26c", // Add groupId
    },
  ],
};

module.exports = data;
