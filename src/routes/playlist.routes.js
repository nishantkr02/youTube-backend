import { Router } from 'express';
import { createPlaylist, getUserPlaylists ,getPlaylistById ,addVideoToPlaylist ,removeVideoFromPlaylist, deletePlaylist, updatePlaylist } from '../controllers/playlist.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const playlistRouter = Router()
 playlistRouter.use(verifyJWT)

//Creating the Playlist
 playlistRouter.route("/create-playlist").post(createPlaylist)


 // Getting all playlist by the user 
  playlistRouter.route("/get-user-playlists").get(getUserPlaylists)

  
 playlistRouter.route("/:playlistId")
  .get(getPlaylistById)


  playlistRouter.route("/update-playlist/:playlistId")
  .patch(updatePlaylist)


playlistRouter.route("/delete-playlist/:playlistId")
  .delete(deletePlaylist)


playlistRouter.route("/add-video/:videoId/:playlistId").patch(addVideoToPlaylist);

playlistRouter.route("/remove-video/:videoId/:playlistId").patch(removeVideoFromPlaylist);



 export default playlistRouter