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

//Post Table
Route.post('/api/postIns','PostController.postIns')

//Like Table
Route.post('api/like','LikeController.like')
