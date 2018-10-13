"use strict";
const Member = use("App/Models/Member");
const Post = use("App/Models/Post");
const Like = use("App/Models/Like");
const Database = use("Database");
/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  async whoLike({ params, response }) {
    /*comment
  response{
    status: "Success/Fail",
    likes:'[]' (when status is Success)
    reason: (When status is Fail)
  }
  */
    try {
      const like = await Database.from("likes").where({
        PostID: params.postID
      });

      //Acquire latest userName of each user
      let memberList = [];
      await like.map(row => {
        memberList.push(row.MemberID);
      });

      const member = await Database.from("members").whereIn("id", memberList);

      await like.map((row, index) => {
        row.userName = member[index].userName;
      });

      return response.json({
        status: "Success",
        likes: like
      });
    } catch (error) {
      console.log(err);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*like
  request{
    userEmail:'',
    postID:''
  }
  response{
    status: "Success/Fail",
    reason: (When status is Fail)
  }
  */
  async like({ request, response }) {
    try {
      const member = await Member.findBy("email", request.input("userEmail"));
      const post = await Post.find(request.input("postID"))

      const like = new Like();
      like.MemberID = member.id;
      like.PostID = request.input("postID");
      like.postFromID = post.MemberID;
      await like.save();

      return response.json({
        status: "Success"
      });
    } catch (err) {
      console.log(err);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }
}

module.exports = LikeController;
