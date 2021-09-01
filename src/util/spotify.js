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
    }
  }
}

export default Sportify;