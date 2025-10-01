import mongoose from "mongoose";

const componentVariantSchema = new mongoose.Schema(
  {
    componentId: {
      type: String,
      required: true,
      index: true,
    },
    variantId: {
      type: String,
      required: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    pageId: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    styles: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient queries
componentVariantSchema.index({ tenantId: 1, pageId: 1, componentId: 1 });

// Update the updatedAt field on save
componentVariantSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const ComponentVariant =
  mongoose.models.ComponentVariant ||
  mongoose.model("ComponentVariant", componentVariantSchema);

export default ComponentVariant;
