"use strict";
const Encryption = use("Encryption");
const Member = use("App/Models/Member");
const imagePath = "UserPortrait";
const Database = use("Database");

class MemberController {
  async acquireLatestActionFromFollower({ params, response }) {
    try {
      //email -> likes -> truncate into 10 -> adding event attribute
      const member = await Member.findBy("email", params.userEmail);
      const likes = await Database.from("likes").where({
        postFromID: member.id
      });
      likes.slice(0, 10);
      likes.map(like => {
        like.event = "like";
      });
      //email -> follow -> truncate into 10 -> adding event attribute
      const followings = await Database.from("followings").where({
        FollowingMemberID: member.id
      });
      followings.slice(0, 10);
      followings.map(following => {
        following.event = "follow";
      });

      //Join two arrays and proceed sort by created_at
      let activityArray = likes.concat(followings);
      activityArray.sort(function(a, b) {
        var keyA = new Date(a.created_at),
          keyB = new Date(b.created_at);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      activityArray.slice(0, 10);

      for (let index in activityArray) {
        let activity = activityArray[index];
        let userEmail = await Member.find(activity.MemberID);
        activity.userEmail = userEmail.userName;
      }
      //Format response
      response.json({ activityArray });
    } catch (error) {
      console.log(error);
    }
  }

  /*
  request{
    lastLikeID:
    lastFollowID:
    userEmail:
  }
  */
  async acquireOldActionFromFollower({ params, response }) {
    //email -> like -> truncate into 10 -> adding event attribute
    const member = await Member.findBy("email", params.userEmail);
    const likes = await Database.from("likes")
      .where({
        postFromID: member.id
      })
      .where("id", "<", params.lastLikeID);
    likes.slice(0, 10);
    likes.map(like => {
      like.event = "like";
    });
    //email -> follow -> truncate into 10 -> adding event attribute
    const followings = await Database.from("followings")
      .where({
        FollowingMemberID: member.id
      })
      .where("id", "<", params.lastFollowID);
    followings.slice(0, 10);
    followings.map(following => {
      following.event = "follow";
    });
    //Join two arrays and proceed sort by created_at
    let activityArray = likes.concat(followings);
    activityArray.sort(function(a, b) {
      var keyA = new Date(a.created_at),
        keyB = new Date(b.created_at);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
    activityArray.slice(0, 10);

    for (let index in activityArray) {
      let activity = activityArray[index];
      let userEmail = await Member.find(activity.MemberID);
      console.log(userEmail.userName);
      activity.userEmail = userEmail.userName;
    }

    //Find lastFollowEventID and lastLikeEventID
    let lastLikeID = 999;
    let lastFollowID = 999;
    activityArray.map(activity => {
      if (activity.event === "like") {
        if (activity.id < lastLikeID) {
          lastLikeID = activity.id;
        }
      } else {
        if (activity.id < lastFollowID) {
          lastFollowID = activity.id;
        }
      }
    });
    //Format response
    response.send(
      JSON.stringify({
        lastLikeID: lastLikeID,
        lastFollowID: lastFollowID,
        activities: activityArray
      })
    );
  }

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

  //AcquirePortrait -> url
  async acquirePortrait({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      response.send(member.profilePic);
    } catch (error) {
      console.log(error);
    }
  }
  //AcquireInfo -> PostNum, Follower, Following
  async acquireUserInfo({ params, response }) {
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

      response.send(
        posts.length + "," + follower.length + "," + following.length
      );
    } catch (error) {
      console.log(error);
    }
  }
  //AcquirePost -> urlString
  async acquireUserPosts({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      let posts = await Database.table("posts").where({
        MemberID: member.id
      });
      posts = posts.reverse();
      let postArray = "";
      posts.map(post => {
        if (postArray != "") {
          postArray = postArray + ','+ post.postPic;
        }else{
          postArray = post.postPic
        }
      });
      response.send(postArray);
    } catch (error) {
      console.log(error);
    }
  }
  /* NOT USE
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
        return response.send("Email Not Existed");
      }

      const password = Encryption.decrypt(member.password);
      //Whether password is correct
      if (password != request.input("loginPassword")) {
        return response.send("Pass Word Incorrect");
      }

      //Login successes
      if (member != null && password === request.input("loginPassword")) {
        return response.send("success");
      }
    } catch (err) {
      console.log(err);
      return response.send("Server Error");
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

        return response.send("success");
      } else {
        return response.send("Email Existed");
      }
    } catch (err) {
      console.log(err);
      return response.send("Server Error");
    }
  }
}

module.exports = MemberController;
