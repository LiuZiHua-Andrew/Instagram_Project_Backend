'use strict'
const Member = use('App/Models/Member')
const Post = use('App/Models/Post')
const Like = use('App/Models/Like')
/**
 * Resourceful controller for interacting with likes
 */
class LikeController {

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
  async like({request,response}){
    try{
      const member = await Member.findBy('email',request.input('userEmail'))

      const like = new Like();
      like.MemberID = member.id
      like.PostID = request.input('postID')
      await like.save();

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

module.exports = LikeController
