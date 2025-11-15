import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(
      500,
      "something went wrong while generating refresh and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName, avatar, coverImage, email, password } = req.body;
  console.log("email :", email);
  console.log("fullName :", fullName);
  console.log("avatar :", avatar);
  console.log("coverImage :", coverImage);
  console.log("username :", username);
  console.log("password :", password);

  if (!fullName) {
    throw new apiError(400, "Can't proceed without fullname");
  } else if (!username) {
    throw new apiError(400, "Can't proceed without username");
  } else if (!password) {
    throw new apiError(400, "Can't proceed without password ");
  } else if (!email) {
    throw new apiError(400, "Can't proceed without email");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "user with this username or email already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarLocalPath = req.files?.avatar?.[0]?.path?.replace(/\\/g, "/");
  console.log("avatarLocalPath :", avatarLocalPath);

  console.log("req.files :", req.files);

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path?.replace(
    /\\/g,
    "/",
  );

  console.log("req.files :", req.files);

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar is required");
  }

  const avatarFile = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatarFile :", avatarFile);

  const coverImageFile = await uploadOnCloudinary(coverImageLocalPath);
  console.log("coverImageFile :", coverImageFile);

  if (!avatarFile) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatarFile.url,
    coverImage: coverImageFile?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new apiError(500, "something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Registered Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new apiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(404, "user not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorised request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new apiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(
        401,
        "Refresh token is either expired or already in use",
      );
    }

    const options = {
      httpsOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        200,
        { accessToken, refreshToken: newRefreshToken },

        "Access token refreshed",
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token");
  }
});
export { registerUser, loginUser, logoutUser, refreshAccessToken };
