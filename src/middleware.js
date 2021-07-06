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
    // const token = req.cookies.accessToken
    const accessToken = "BQDK99qlexjiWMzGYl1CTT1ipq5KD7tH_G6-jEsY5dxWlSpehCH_2x8bJIWso-2w4-KWMuAED2-QJBmZSb-1m-_fvBakO1z_RYs8TSynOnydEMZTJQqu5eL0fgHocGz_OOV_vORW0dYkAL3FAY_JFCr3bu9iFwHECiwyKavv5UYRflA8LS6YForGwfjDBQz2zXT5Hs37S-S3gdxy"
    const refreshToken = req.cookies.refreshToken
    let authOptions = {
        url: "https://api.spotify.com/v1/me",
        headers: { Authorization: "Bearer " + accessToken },
        json: true
    };

    request.get(authOptions, (err, res, body) => {
        if (body.error) {
            getAccessToken(refreshToken)
            .then( token => {
                console.log(token)
            })
            .catch( err => {
                throw err.message
            })
        }
    })
}

// Request access token using refresh token
const getAccessToken = refreshToken => {
    return new Promise( (resolve, reject) => {
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: { Authorization: 
                "Basic " + new Buffer.from(client_id + ":-" + client_secret, 'utf8').toString('base64')
            },
            form: { grant_type: "refresh_token", refresh_token: refreshToken },
            json: true
        }
    
        request.post(authOptions, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                refreshedAccessToken = body.access_token;
                resolve(refreshedAccessToken)
            } else {
                reject (body);
            }
        })
    })
}

module.exports = {
    ranString: ranString,
    verifyToken: verifyToken
}