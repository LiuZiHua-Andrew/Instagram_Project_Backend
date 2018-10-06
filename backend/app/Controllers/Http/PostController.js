"use strict";
const imagePath = "UserPost";
const Helpers = use("Helpers");
const Drive = use("Drive")
/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  async postIns({ request, response }) {
    console.log(await Drive.exists('public/UserPost/1538815728810.jpeg'))
    const postPic = request.file("postPic", {
      types: ["image"],
      size: "15mb"
    });
    console.log(Drive.disk)
    //Change File Name
    let fileName = `${new Date().getTime()}.${postPic.subtype}`;

    //Giving File Path
    let filePath = imagePath + "/" + fileName;
    const uploadPath = Helpers.publicPath(imagePath);

    //Save File
    await postPic.move(uploadPath, {
      name : fileName
    });

    //Server Error
    if (!postPic.moved()) {
      return postPic.error();
    }

    return "File Moved";
  }
}

module.exports = PostController;
