import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import apiResponse from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // get data
  // check validations
  //check if user existed
  // verify the credentials
  // user register
  

  // get user details
  //validations -not empty
  //check if user already exists or not
  //check for images, check for avatar
  // upload them to cloudinary ,avatar
  //create user object-create entry db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  
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
  } else if (!avatar) {
    throw new apiError(400, "Can't proceed without avatar");
  } else if (!coverImage) {
    throw new apiError(400, "Can't proceed without coverImage");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "user with this username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar is required");
  }

  const avatarFile = await uploadOnCloudinary(avatarLocalPath);
  const coverImageFile = await uploadOnCloudinary(coverImageLocalPath);

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
    throw new apiError(500, "something went wrong whiile registering a user");
  }
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Registered Sucessfully"));
});

export default registerUser;
