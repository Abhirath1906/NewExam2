export default async function handler(req, res) {
    try {
      const apiRes = await fetch("https://dummyjson.com/products/categories");
      const data = await apiRes.json();
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  }
  