'use strict'
const Comment = use('App/Models/Comment')
const Member = use('App/Models/Member')

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {

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
  async comment(){
    try{
      const member = await Member.findBy('email',request.input('userEmail'))

      const comment = new Comment();
      comment.MemberID = member.id
      comment.PostID = request.input('postID')
      comment.comment = request.input('comment')
      await comment.save();

      return response.json({
        status: "Success"
      });
    }catch(err){
      console.log(err)
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }
}

module.exports = CommentController
