"use strict";
const Following = use("App/Models/Following");
const Member = use("App/Models/Member");
const Database = use("Database");
/**
 * Resourceful controller for interacting with followings
 */
class FollowingController {

  /*unfollow()
  request{
    userEmail:"",
    followingID:""
  }
   response{
    status:'Success/Fail',
    reason:(When status is Fail)
  }
  */
  async unfollow({ request, response }) {
    try {
      const member = Member.findBy("email", request.input("userEmail"));
      await Database.table("followings")
        .where({ MemberID: member.id })
        .where({ FollowingMemberID: request.input("followingID") })
        .delete();
      return response.json({
        status: "Success"
      });
    } catch (error) {
      console.log(error);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*follow
  request{
    userEmail:'',
    followingID:''
  }
  response{
    status:'Success/Fail',
    reason:(When status is Fail)
  }

  */
  async follow({ request, response }) {
    try {
      let following = new Following();
      const member = Member.findBy("email", request.input("userEmail"));
      following.MemberID = member.id;
      following.FollowingMemberID = request.input("followingID");
      await following.save();

      response.json({
        status: "Success"
      });
    } catch (error) {
      console.log(error);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }
}

module.exports = FollowingController;
