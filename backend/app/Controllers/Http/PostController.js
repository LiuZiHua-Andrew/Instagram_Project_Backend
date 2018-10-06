"use strict";
const imagePath = "UserPost";
const Helpers = use("Helpers");
const Post = use("App/Models/Post")
const Member = use("App/Models/Member")
const Comment = use("App/Models/Comment")
/**
 * Resourceful controller for interacting with posts
 */
class PostController {

  /*postIns
  request{
    "postPic":{Picture Stream},
    "userEmail":'',
    "comment":(Optional)
  }
  response{
    "status":"Success/Fail"
    "reason":(Only when status is Fail)
  }
  */
  async postIns({ request, response }) {

    try{
      const postPic = request.file("postPic", {
        types: ["image"],
        size: "15mb"
      });
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
      const member = await Member.findBy('email',request.input('userEmail'))
      const post = new Post();
      post.MemberID = member.id;
      post.postPic = filePath;
      await post.save()

      //If has comment
      if(request.input('comment')){
        const comment = new Comment();
        comment.comment = request.input('comment');
        comment.MemberID = member.id;
        comment.PostID = post.id;
        await comment.save()
      }

      return response.json({
        status: "Success"
      });

    } catch(err){
      console.log(err)
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }
}

module.exports = PostController;
