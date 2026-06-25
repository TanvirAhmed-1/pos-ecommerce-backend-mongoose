import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true },
    images: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "hidden"], default: "active" },
  },
  { timestamps: true }
);

// Mongoose static method to calculate average rating and update product collection
reviewSchema.statics.calculateAverageRating = async function (productId: Schema.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, status: "active" },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  const ProductModel = model("Product");
  if (stats.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      totalReviews: stats[0].nRating,
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post("save", function () {
  (this.constructor as any).calculateAverageRating(this.product);
});

// Call calculateAverageRating after deletion
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Review = model("Review");
    await (Review as any).calculateAverageRating(doc.product);
  }
});

export const ReviewModel = model<IReview>("Review", reviewSchema);
