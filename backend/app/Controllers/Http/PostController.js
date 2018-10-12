"use strict";
const imagePath = "UserPost";
const Helpers = use("Helpers");
const Post = use("App/Models/Post");
const Member = use("App/Models/Member");
const Comment = use("App/Models/Comment");
const Database = use("Database");
const Like = use("App/Models/Like");
/**
 * Resourceful controller for interacting with posts
 */
class PostController {
  async acquireOldPostsByTime({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      const following = await Database.from("followings").where({
        MemberID: member.id
      });
      let displayUserId = [];
      displayUserId.push(member.id);
      following.map(user => {
        displayUserId.push(user.FollowingMemberID);
      });

      const posts = await Database.from("posts")
        .whereIn("MemberID", displayUserId)
        .where("id", "<", params.postID);
      posts.sort(function(a, b) {
        var keyA = new Date(a.created_at),
          keyB = new Date(b.created_at);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      //Truncate into length 10
      posts.slice(0, 10);

      for (let index in posts) {
        let post = posts[index];
        const member = await Member.findBy("id", post.MemberID);
        post.userPortrait = member.profilePic;
        post.userName = member.userName;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if(comment.length > 0){
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id",comment[0].MemberID)
          post.commentUser = commentMember.userName
        }else{
          post.comment = null
          post.commentUser = null
        }

        let date = new Date();
        let created_at = new Date(post.created_at);
        post.timeToNow = Math.ceil((date - created_at) / (1000 * 3600));
      }
      let backArrayData = [];
      for (let index in posts) {
        let post = posts[index];
        let dic = new Object();
        dic.postID = post.id;
        dic.username = post.userName;
        dic.location = post.location;
        dic.portrait = post.userPortrait;
        dic.photo = post.postPic;
        dic.likes = post.likes;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser
        dic.date = post.timeToNow;
        backArrayData.push(dic);
      }

      response.send(JSON.stringify({ data: backArrayData }));
    } catch (error) {
      console.log(error);
    }
  }

  /*
  response{
    data: [
        {
        postID: 5,
        username: "newUser",
        location: "5",
        portrait: "2",
        photo: "5",
        likes: 0,
        comment: [{
                    id: 1,
                    MemberID: 2,
                    comment: "this is 2's comment",
                    PostID: 3,
                    created_at: null,
                    updated_at: null
                    }],
        date: 11
        }
  }
  */
  async acquireLatestPostsByTime({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      const following = await Database.from("followings").where({
        MemberID: member.id
      });
      let displayUserId = [];
      displayUserId.push(member.id);
      following.map(user => {
        displayUserId.push(user.FollowingMemberID);
      });

      const posts = await Database.from("posts").whereIn(
        "MemberID",
        displayUserId
      );
      posts.sort(function(a, b) {
        var keyA = new Date(a.created_at),
          keyB = new Date(b.created_at);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      //Truncate into length 10
      posts.slice(0, 10);

      for (let index in posts) {
        let post = posts[index];
        const member = await Member.findBy("id", post.MemberID);
        post.userPortrait = member.profilePic;
        post.userName = member.userName;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if(comment.length > 0){
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id",comment[0].MemberID)
          post.commentUser = commentMember.userName
        }else{
          post.comment = null
          post.commentUser = null
        }

        let date = new Date();
        let created_at = new Date(post.created_at);
        post.timeToNow = Math.ceil((date - created_at) / (1000 * 3600));
      }
      let backArrayData = [];
      for (let index in posts) {
        let post = posts[index];
        let dic = new Object();
        dic.postID = post.id;
        dic.username = post.userName;
        dic.location = post.location;
        dic.portrait = post.userPortrait;
        dic.photo = post.postPic;
        dic.likes = post.likes;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser
        dic.date = post.timeToNow;
        backArrayData.push(dic);
      }

      response.send(JSON.stringify({ data: backArrayData }));
    } catch (error) {
      console.log(error);
    }
  }

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
    try {
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
        name: fileName
      });

      //Server Error
      if (!postPic.moved()) {
        return postPic.error();
      }
      const member = await Member.findBy("email", request.input("userEmail"));
      const post = new Post();
      post.MemberID = member.id;
      post.postPic = filePath;
      await post.save();

      //If has comment
      if (request.input("comment")) {
        const comment = new Comment();
        comment.comment = request.input("comment");
        comment.MemberID = member.id;
        comment.PostID = post.id;
        await comment.save();
      }

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

module.exports = PostController;
