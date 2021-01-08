const dotenv = require("dotenv");
const envPath = __dirname + `/../.env`;
dotenv.config({ path: envPath });

const DATABASE = process.env.DATABASE;
const SECRET_KEY = process.env.SECRET_KEY;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const TokenLife = process.env.TokenLife;
const vnp_Url = process.env.vnp_Url;
const returnUrl = process.env.returnUrl;
module.exports = {
    DATABASE,
    SECRET_KEY,
    USER,
    PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    CLIENT_URL,
    TokenLife,
    vnp_Url,
    returnUrl
}