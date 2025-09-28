import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  websiteName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  componentSettings: {
    type: Map,
    of: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    default: () => new Map(),
  },
  globalComponentsData: {
    type: Object,
    default: () => ({}),
  },
});

function createModel(modelName, schema) {
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  return mongoose.model(modelName, schema);
}

const User = createModel("User", userSchema);

export default User;
