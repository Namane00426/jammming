const clientId = 'ac9866f0c59d467cb715225d8283d283';
const redirectUri = "http://localhost:3000/";
let accessToken;

const Sportify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    //check for access token match
    const accesstokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires:in=([^&]*)/);

    if(accesstokenMatch && expiresInMatch) {
      accessToken = accesstokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Sportify.getAccessToken(); 
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
      { headers: {
        Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(!jsonResponse.tracks) {
          return [];
        }

        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
      }));
    })
  },

  savePlaylist(name, trackUris){
    if(!name || !trackUris) {
      return;
    } 

    const accessToken = Sportify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    }
    let userId;
    return fetch('https://api.spotify.com/v1/me', {headers: headers} 
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        })
        
      })
      
    })
  }
}

export default Sportify;