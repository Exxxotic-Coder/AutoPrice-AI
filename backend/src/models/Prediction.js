import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true },
    origin: { type: String, required: true },
    driveTrain: { type: String, required: true },
    engineSize: Number,
    cylinders: Number,
    horsepower: Number,
    mpgCity: Number,
    mpgHighway: Number,
    weight: Number,
    wheelbase: Number,
    length: Number,
    predictedPrice: { type: Number, required: true },
    explanation: [String],
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Prediction", predictionSchema);
