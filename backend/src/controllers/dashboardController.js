import mongoose from "mongoose";
import Prediction from "../models/Prediction.js";

export async function getDashboard(req, res) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const [summary] = await Prediction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          predictionsMade: { $sum: 1 },
          averagePredictedPrice: { $avg: "$predictedPrice" },
        },
      },
    ]);

    const brandCounts = await Prediction.aggregate([
      { $match: { userId } },
      { $group: { _id: "$make", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const recentPredictions = await Prediction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const brandDistribution = await Prediction.aggregate([
      { $match: { userId } },
      { $group: { _id: "$make", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const priceOverTime = await Prediction.find({ userId })
      .sort({ createdAt: 1 })
      .select("predictedPrice createdAt");

    res.json({
      predictionsMade: summary?.predictionsMade || 0,
      averagePredictedPrice: summary ? Math.round(summary.averagePredictedPrice) : 0,
      mostPredictedBrand: brandCounts[0]?._id || null,
      recentPredictions,
      brandDistribution: brandDistribution.map((b) => ({ brand: b._id, count: b.count })),
      priceOverTime: priceOverTime.map((p) => ({
        date: p.createdAt,
        price: p.predictedPrice,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Could not build dashboard", details: err.message });
  }
}
