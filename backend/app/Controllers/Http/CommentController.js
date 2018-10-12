"use strict";
const Comment = use("App/Models/Comment");
const Member = use("App/Models/Member");
const Database = use("Database");

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  async acquireComment({ params, response }) {
    try {
      const comments = await Database.from("comments").where({
        'PostID': params.postID
      });

      for(let index in comments){
        let comment = comments[index]
        let member = await Member.find(comment.MemberID)
        comment.userName = member.userName
      }
      return response.json(comments);

    } catch (error) {
      console.log(error);
    }
  }

  /*comment
  request{
    userEmail:'',
    postID:'',
    comment:''
  }
  response{
    status: "Success/Fail",
    reason: (When status is Fail)
  }
  */
  async postComment() {
    try {
      const member = await Member.findBy("email", request.input("userEmail"));

      const comment = new Comment();
      comment.MemberID = member.id;
      comment.PostID = request.input("postID");
      comment.comment = request.input("comment");
      await comment.save();

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

module.exports = CommentController;
