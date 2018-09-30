module.exports = {
    codechef: {
      authURL: 'https://api.codechef.com/oauth/authorize',
      tokenURL: 'https://api.codechef.com/oauth/token',
      clientID: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      callbackURL: '/auth/callback',
      username:'JOBS_USER_USERNAME',
      password:'JOBS_USER_PASSWORD',
    },
    mongodb: {
      dbURI: 'DB_URL'
    },
    session: {
      cookieKey: 'COOKIE_SECRET_KEY'
    },
    gmail:{
      user: 'GMAIL_ACCOUNT_USERNAME',
      password: 'GMAIL_ACCOUNT_PASS'
    }
};
