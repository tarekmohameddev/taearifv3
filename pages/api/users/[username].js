export default function handler(req, res) {
  const { username } = req.query;

  if (req.method === "GET") {
    // Fetch user by username (mock data for now)

    const user = { id: 1, username };
    res.status(200).json(user);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
