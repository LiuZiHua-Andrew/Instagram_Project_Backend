'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager'} */
const Route = use('Route')

Route.on('/').render('welcome')

// Member Table
Route.post('/api/register','MemberController.register')
Route.get('/api/login','MemberController.login')
Route.put('/api/updatePortrait','MemberController.updatePortrait')
Route.get('api/searchUser/:userName','MemberController.searchUser')
Route.get('api/acquireSelfProfile/:userEmail','MemberController.acquireSelfProfile')
Route.get('api/acquireOthersProfile/:userEmail/:othersEmail','MemberController.acquireOthersProfile')

//Post Table
Route.post('/api/postIns','PostController.postIns')
Route.get('/api/acquireLatestPostsByTime/:userEmail','PostController.acquireLatestPostsByTime')
Route.get('/api/acquireOldPostsByTime/:userEmail/:postID','PostController.acquireOldPostsByTime')

//Like Table
Route.post('api/like','LikeController.like')
Route.get('api/whoLike/:postID','LikeController.whoLike')

//Comment Table
Route.post('api/comment','CommentController.comment')

//Follow Table
Route.post('api/follow','FollowingController.follow')
Route.delete('api/follow','FollowingController.unfollow')
