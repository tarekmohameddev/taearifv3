import mongoose from "mongoose";

const componentSettingSchema = new mongoose.Schema(
  {
    componentId: {
      type: String,
      required: true,
      index: true,
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
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
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
componentSettingSchema.index({ tenantId: 1, pageId: 1, componentId: 1 });

// Update the updatedAt field on save
componentSettingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const ComponentSetting =
  mongoose.models.ComponentSetting ||
  mongoose.model("ComponentSetting", componentSettingSchema);

export default ComponentSetting;
