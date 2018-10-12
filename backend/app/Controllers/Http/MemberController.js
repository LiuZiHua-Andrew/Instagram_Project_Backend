"use strict";
const Encryption = use("Encryption");
const Member = use("App/Models/Member");
const imagePath = "UserPortrait";
const Database = use("Database");
/**
 * Resourceful controller for interacting with members
 */
class MemberController {
  /*
  response{
        status: "Success/Fail",
        user: member,
        following: following,
        follower: follower,
        posts: posts,
        isFollow:isFollow,
        reason:(When status is Fail)
  }
  */
  async acquireOthersProfile({ params, response }) {
    try {
      let isFollow = await Database.table("followings")
        .where({ MemberID: params.userEmail })
        .where({ FollowingMemberID: params.othersEmail });

      if (isFollow.length === 0) {
        isFollow = false;
      } else {
        isFollow = true;
      }
      const member = await Member.findBy("email", params.othersEmail);
      const following = Database.table("followings").where({
        MemberID: member.id
      });
      const follower = Database.table("followings").where({
        FollowingMemberID: member.id
      });
      const posts = Database.table("posts").where({ MemberID: member.id });

      return response.json({
        status: "Success",
        user: member,
        following: following,
        follower: follower,
        posts: posts,
        isFollow: isFollow
      });
    } catch (error) {
      console.log(error);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*
  response{
    status:"Success/Fail",
    user:,
    following:,
    follower:,
    posts:,
    reason:(When status is Fail
  }
  */
  async acquireSelfProfile({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      const following = await Database.table("followings").where({
        MemberID: member.id
      });
      const follower = await Database.table("followings").where({
        FollowingMemberID: member.id
      });
      const posts = await Database.table("posts").where({
        MemberID: member.id
      });

      return response.json({
        status: "Success",
        user: member,
        following: following,
        follower: follower,
        posts: posts
      });
    } catch (error) {
      console.log(error);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*
  response{
    status:'Success/Fail',
    reason:(When status is Fail),
    user:
  }
  */
  async searchUser({ params, response }) {
    try {
      const user = await Database.table("members").where({
        userName: params.userName
      });
      response.json({
        status: "Success",
        user: user
      });
    } catch (error) {
      console.log(error);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*uploadPortrait
  request{
    userEmail:"",
    userPortrait:{Picture stream}
  }
  response{
    status:"Success/Fail",
    reason:(When status is Fail)
  }
  */
  async updatePortrait({ request, response }) {
    try {
      const postPic = request.file("userPortrait", {
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
        name: fileName
      });

      //Server Error
      if (!postPic.moved()) {
        return postPic.error();
      }

      const member = await Member.findBy("email", request.input("userEmail"));
      member.merge({ profilePic: filePath });
      await member.save();

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

  /*Login
  request{
    loginEmail:'',
    loginPass:''
  }
  response{
    status:'Success/Fail',
    reason:(Only when status is Fail)
  }
  */
  async login({ request, response }) {
    try {
      let member = await Member.findBy("email", request.input("loginEmail"));

      //Whether email exists
      if (member === null) {
        return response.json({
          status: "Fail",
          reason: "Email Not Exists"
        });
      }

      const password = Encryption.decrypt(member.password);
      //Whether password is correct
      if (password != request.input("loginPassword")) {
        return response.json({
          status: "Fail",
          reason: "Password is incorrect"
        });
      }

      //Login successes
      if (member != null && password === request.input("loginPassword")) {
        return response.send('success')
      }
    } catch (err) {
      console.log(err);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }

  /*Register()
  request: {
      registerPassword:'',
      registerEmail:''
    }
  response:{
    registerEmail:'',
    status:Success/Fail,
    reason:(Only when status is Fail)
  }
  */
  async register({ request, response }) {
    try {
      const requestData = request.all();

      //Use Encryption to encrypt user plain password
      const encrypted = Encryption.encrypt(requestData.registerPassword);
      const userEmail = await Database.table("members")
        .where("email", requestData.registerEmail)
        .select("email");

      //email is not exist -> new user
      if (userEmail.length <= 0) {
        const member = new Member();
        member.email = requestData.registerEmail;
        member.password = encrypted;
        await member.save();

        return response.send('success')
      } else {
        return response.json({
          registerEmail: requestData.registerEmail,
          status: "Fail",
          reason: "Email Existed"
        });
      }
    } catch (err) {
      console.log(err);
      return response.json({
        status: "Fail",
        reason: "Server Error"
      });
    }
  }
}

module.exports = MemberController;
