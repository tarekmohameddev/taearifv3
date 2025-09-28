export default function handler(req, res) {
  if (req.method === "GET") {
    // For demo purposes, return an empty array
    // In a real application, you would fetch from a database
    res.status(200).json([]);
  } else if (req.method === "POST") {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      // For demo purposes, create a simple user object
      // In a real application, you would save to a database
      const user = {
        _id: Math.random().toString(36).substr(2, 9),
        username: username,
        imageToggle: false,
      };

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
