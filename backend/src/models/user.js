import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: [{ type: String }],
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profilePhoto: { type: String, default: "" },
    headline: { type: String, default: "" },
    about: { type: String, default: "" },

    skills: [{ type: String }],
    projects: [ProjectSchema],

    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
