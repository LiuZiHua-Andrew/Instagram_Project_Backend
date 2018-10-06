"use strict";
const Encryption = use("Encryption");
const Member = use('App/Models/Member')
const imagePath = "UserPortrait"
/**
 * Resourceful controller for interacting with members
 */
class MemberController {

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
  async updatePortrait({request,response}){
    try{
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
        name : fileName
      });

      //Server Error
      if (!postPic.moved()) {
        return postPic.error();
      }

      const member = await Member.findBy('email',request.input('userEmail'))
      member.merge({profilePic : filePath})
      await member.save()

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
      let member = await Member.findBy('email',request.input('loginEmail'))

      //Whether email exists
      if(member === null){
        return  response.json({
          status: "Fail",
          reason: "Email Not Exists"
        });
      }

      const password = Encryption.decrypt(member.password);
      //Whether password is correct
      if(password != request.input('loginPassword')){
        return  response.json({
          status: "Fail",
          reason: "Password is incorrect"
        });
      }

      //Login successes
      if(member != null && password === request.input('loginPassword')){
        return  response.json({
          status: "Success",
          loginEmail:request.input('loginEmail')
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

        return response.json({
          registerEmail: requestData.registerEmail,
          status: "Success"
        });
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
