"use strict";
const imagePath = "UserPost";
const Helpers = use("Helpers");
const Post = use("App/Models/Post");
const Member = use("App/Models/Member");
const Comment = use("App/Models/Comment");
const Following = use("App/Models/Following");
const Database = use("Database");
const Like = use("App/Models/Like");
const NodeGeocoder = use("node-geocoder");

/*Calculating Distance by (lat,lng)*/
function GetDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //KM
  return s;
}

class PostController {
  async acquirePost({ params, response }) {
    try {
      const post = await Post.find(params.postID);
      const member = await Member.find(post.MemberID);
      post.userName = member.email;
      const like = await Database.from("likes").where({ PostID: post.id });
      let isLike = false;
      like.map(like => {
        if (like.MemberID === member.id) {
          isLike = true;
        }
      });
      post.isLike = isLike;
      post.likes = like.length;

      const comment = await Database.from("comments").where({
        PostID: post.id
      });
      if (comment.length > 0) {
        post.comment = comment[0].comment;

        const commentMember = await Member.findBy("id", comment[0].MemberID);
        post.commentUser = commentMember.email;
      } else {
        post.comment = null;
        post.commentUser = null;
      }

      let date = new Date();
      let created_at = new Date(post.created_at);
      post.timeToNow = Math.ceil((date - created_at) / (1000 * 3600));

      response.send(post);
    } catch (error) {
      console.log(error);
    }
  }
  async acquireLatestFollowing({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      const following = await Database.from("followings").where({
        MemberID: member.id
      });
      let displayUserId = [];
      // displayUserId.push(member.id);
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
        post.userName = member.email;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        let isLike = false;
        like.map(like => {
          if (like.MemberID === member.id) {
            isLike = true;
          }
        });
        post.isLike = isLike;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if (comment.length > 0) {
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id", comment[0].MemberID);
          post.commentUser = commentMember.email;
        } else {
          post.comment = null;
          post.commentUser = null;
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
        dic.isLike = post.isLike;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser;
        dic.date = post.timeToNow;
        backArrayData.push(dic);
      }

      response.send(JSON.stringify({ data: backArrayData }));
    } catch (error) {
      console.log(error);
    }
  }

  async acquireOldFollowing({ params, response }) {
    try {
      const member = await Member.findBy("email", params.userEmail);
      const following = await Database.from("followings").where({
        MemberID: member.id
      });
      let displayUserId = [];
      // displayUserId.push(member.id);
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
        post.userName = member.email;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        let isLike = false;
        like.map(like => {
          if (like.MemberID === member.id) {
            isLike = true;
          }
        });
        post.isLike = isLike;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if (comment.length > 0) {
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id", comment[0].MemberID);
          post.commentUser = commentMember.email;
        } else {
          post.comment = null;
          post.commentUser = null;
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
        dic.isLike = post.isLike;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser;
        dic.date = post.timeToNow;
        backArrayData.push(dic);
      }

      response.send(JSON.stringify({ data: backArrayData }));
    } catch (error) {
      console.log(error);
    }
  }

  /*acquireOldPostsByLocation()
  request{
    postID: []
    lastID:
    userEmail：
  }
  */
  async acquireOldPostsByLocation({ request, response }) {
    //1) email -> userID + FollowingID
    const member = await Member.findBy("email", request.input("userEmail"));
    const following = await Database.from("followings").where({
      MemberID: member.id
    });
    let displayUserId = [];
    displayUserId.push(member.id);
    following.map(user => {
      displayUserId.push(user.FollowingMemberID);
    });

    //2) ID -> Posts
    const posts = await Database.from("posts").whereIn(
      "MemberID",
      displayUserId
    );

    //3) Add distance attributes for each post
    post.map(post => {
      if (post.location != null) {
        let distance = GetDistance(
          post.lon,
          post.lat,
          request.input("lon"),
          request.input("lat")
        );
        post.distance = distance;
      } else {
        post.distance = 50000; // If location is empty, xl distance
      }
    });

    //4) Sort By Distance and truncate posts before the last post
    posts.sort(function(a, b) {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    });
    let lastIdIndex;
    posts.map((post, index) => {
      if (post.postID === request.input("lastID")) {
        lastIdIndex = index;
      }
    });
    posts = posts.slice(lastIdIndex + 1);

    //5) Filter out existed posts
    postFilter = (element, index, array) => {
      var data = request.input("postID");
      var isUsed = true;
      for (index in data) {
        let post = data[index];
        if (post === element.postID) {
          isUsed = false;
        }
      }
      if (isUsed) {
        return element;
      }
    };
    posts = posts.filter(postFilter);

    //6) Format response data
    for (let index in posts) {
      let post = posts[index];
      const member = await Member.findBy("id", post.MemberID);
      post.userPortrait = member.profilePic;
      post.userName = member.email;

      const like = await Database.from("likes").where({ PostID: post.id });
      post.likes = like.length;

      let isLike = false;
      like.map(like => {
        if (like.MemberID === member.id) {
          isLike = true;
        }
      });
      post.isLike = isLike;

      let isLike = false;
      like.map(like => {
        if (like.MemberID === member.id) {
          isLike = true;
        }
      });
      post.isLike = isLike;

      const comment = await Database.from("comments").where({
        PostID: post.id
      });
      if (comment.length > 0) {
        post.comment = comment[0].comment;

        const commentMember = await Member.findBy("id", comment[0].MemberID);
        post.commentUser = commentMember.email;
      } else {
        post.comment = null;
        post.commentUser = null;
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
      dic.isLike = post.isLike;
      dic.commentContent = post.comment;
      dic.commentUser = post.commentUser;
      dic.date = post.timeToNow;
      backArrayData.push(dic);
    }
    response.send(JSON.stringify({ data: backArrayData }));
  }

  /*acquireLatestPostsByLocation()
  request{
    userEmail:
    location:,
    lat:,
    lng:
  }
  */
  async acquireLatestPostsByLocation({ request, response }) {
    //1) email -> userID + FollowingID
    const member = await Member.findBy("email", request.input("userEmail"));
    const following = await Database.from("followings").where({
      MemberID: member.id
    });
    let displayUserId = [];
    displayUserId.push(member.id);
    following.map(user => {
      displayUserId.push(user.FollowingMemberID);
    });
    //2) ID -> Posts
    const posts = await Database.from("posts").whereIn(
      "MemberID",
      displayUserId
    );

    //3) Add distance attributes for each post
    post.map(post => {
      if (post.location != null) {
        let distance = GetDistance(
          post.lon,
          post.lat,
          request.input("lon"),
          request.input("lat")
        );
        post.distance = distance;
      } else {
        post.distance = 50000; // If location is empty, xl distance
      }
    });

    //4) Sort By Distance and truncate into size 10
    posts.sort(function(a, b) {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    });
    post.slice(0, 10);

    //5) Adding complete information for each post
    for (let index in posts) {
      let post = posts[index];
      const member = await Member.findBy("id", post.MemberID);
      post.userPortrait = member.profilePic;
      post.userName = member.email;

      const like = await Database.from("likes").where({ PostID: post.id });
      post.likes = like.length;

      let isLike = false;
      like.map(like => {
        if (like.MemberID === member.id) {
          isLike = true;
        }
      });
      post.isLike = isLike;

      const comment = await Database.from("comments").where({
        PostID: post.id
      });
      if (comment.length > 0) {
        post.comment = comment[0].comment;

        const commentMember = await Member.findBy("id", comment[0].MemberID);
        post.commentUser = commentMember.email;
      } else {
        post.comment = null;
        post.commentUser = null;
      }
    }

    //6) Format response data
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
      dic.isLike = post.isLike;
      dic.commentContent = post.comment;
      dic.commentUser = post.commentUser;
      dic.date = post.timeToNow;
      backArrayData.push(dic);
    }
    response.send(JSON.stringify({ data: backArrayData }));
  }
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
        post.userName = member.email;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        let isLike = false;
        like.map(like => {
          if (like.MemberID === member.id) {
            isLike = true;
          }
        });
        post.isLike = isLike;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if (comment.length > 0) {
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id", comment[0].MemberID);
          post.commentUser = commentMember.email;
        } else {
          post.comment = null;
          post.commentUser = null;
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
        dic.isLike = post.isLike;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser;
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
        post.userName = member.email;

        const like = await Database.from("likes").where({ PostID: post.id });
        post.likes = like.length;

        let isLike = false;
        like.map(like => {
          if (like.MemberID === member.id) {
            isLike = true;
          }
        });
        post.isLike = isLike;

        const comment = await Database.from("comments").where({
          PostID: post.id
        });
        if (comment.length > 0) {
          post.comment = comment[0].comment;

          const commentMember = await Member.findBy("id", comment[0].MemberID);
          post.commentUser = commentMember.email;
        } else {
          post.comment = null;
          post.commentUser = null;
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
        dic.isLike = post.isLike;
        dic.commentContent = post.comment;
        dic.commentUser = post.commentUser;
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
    "comment":(Optional),
    "lat":,
    "log":
  }
  response{
    "status":"Success/Fail"
    "reason":(Only when status is Fail)
  }
  */
  async postIns({ request, response }) {
    try {
      console.log(request.all());

      //FIXME:Different file key for different content
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

      //Resolve Location
      var options = {
        provider: "google",
        apiKey: "AIzaSyC0IRqt601KXqI8rMuzvkWEwwFosamtzv0"
      };
      let location = "";
      var geocoder = NodeGeocoder(options);
      location = await geocoder
        .reverse({ lat: request.input('lat'), lon: request.input('log') })
        .then(function(res) {
          //Return location information
          return res;
        })
        .catch(function(err) {
          console.log(err);
        });
      location = location[0].formattedAddress;

      const member = await Member.findBy("email", request.input("userEmail"));
      const post = new Post();
      post.MemberID = member.id;
      post.postPic = filePath;
      post.location = location;
      post.lat = request.input("lat");
      post.log = request.input("log");
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
