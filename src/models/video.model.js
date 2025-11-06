import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: string, // cloudinary url
      required: true,
    },
    thumbnail: {
      type: string,
      required: true, //cloudinary url
    },
    title: {
      type: string,
      required: true,
    },
    description: {
      type: string,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
    },
    isPublised: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
    },
  },

  { timestamps: true },
);

VideoSchema.plugin(mongooseAggregatePaginate)




export const Video = mongoose.model("Video", VideoSchema);

