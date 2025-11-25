import Router from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getWatchHistory,
  getUserChannelProfile,
  updateCoverImage,
  updateAvatar,
  updateAccountDetails,
} from "../controllers/user.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router
.route("/login")
.post(loginUser);

router
.route("/logoutUser")
.post(verifyJWT, logoutUser); // anotherMiddleware

router
.route("/refresh-token")
.post(refreshAccessToken);

router
.route("/Changed-password")
.post(verifyJWT, changeCurrentPassword);

router
.route("/Current-user")
.get(verifyJWT, getCurrentUser);

router
.route("/Edit-account-details")
.patch(verifyJWT,updateAccountDetails);

router
  .route("/Updated-avatar")
  .patch(verifyJWT, upload.single("avatar"),updateAvatar);

router
  .route("/updated-coverImage")
  .patch(verifyJWT, upload.single("coverImage"),updateCoverImage);

router
.route("/c/:username")
.get(verifyJWT,getUserChannelProfile);

router
.route("/watch-History")
.get(verifyJWT,getWatchHistory); 

export default router;
