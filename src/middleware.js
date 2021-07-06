require("dotenv").config();
const request = require("request");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const ranString = (length) => {
    str = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < length; i++) {
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
  }

// Token verification
const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken
    let authOptions = {
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + accessToken },
        json: true
    };

    request.get(authOptions, (err, res, body) => {
        if (body.error && res.statusCode === 401) {
            getAccessToken(refreshToken)
            .then( token => {
                req.accessToken = token
                next()
            })
            .catch( err => {
                throw err.message
            })
        } else {
            req.accessToken = accessToken
            next()
        }
    })
}

// Request access token using refresh token
const getAccessToken = refreshToken => {
    return new Promise( (resolve, reject) => {
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: { Authorization: 
                "Basic " + new Buffer.from(client_id + ":" + client_secret, 'utf8').toString('base64')
            },
            form: { grant_type: "refresh_token", refresh_token: refreshToken },
            json: true
        }
    
        request.post(authOptions, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                refreshedAccessToken = body.access_token;
                resolve(refreshedAccessToken)
            } else {
                reject(body);
            }
        })
    })
}

module.exports = {
    ranString: ranString,
    verifyToken: verifyToken
}