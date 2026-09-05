import Prediction from "../models/Prediction.js";

export async function getHistory(req, res) {
  try {
    const { favoritesOnly } = req.query;
    const filter = { userId: req.userId };
    if (favoritesOnly === "true") filter.isFavorite = true;

    const predictions = await Prediction.find(filter).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history", details: err.message });
  }
}

export async function deletePrediction(req, res) {
  try {
    const deleted = await Prediction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Prediction not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Could not delete prediction", details: err.message });
  }
}

export async function toggleFavorite(req, res) {
  try {
    const prediction = await Prediction.findOne({ _id: req.params.id, userId: req.userId });
    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }
    prediction.isFavorite = !prediction.isFavorite;
    await prediction.save();
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: "Could not update favorite", details: err.message });
  }
}
