var TokenProvider = require('refresh-token');

function refreshAccessToken(refreshToken)
{
  var tokenProvider = new TokenProvider(keys.codechef.tokenURL, {
      refresh_token: refreshToken,
      client_id:     keys.codechef.clientID,
      client_secret: keys.codechef.clientSecret
    });

  tokenProvider.getToken(function (err, token) {
   //token will be a valid access token.
   if(err) throw err;
   return token;
  });
}

module.exports.refreshAccessToken = refreshAccessToken;
