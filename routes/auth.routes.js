//localhost:8000

const authcontroller = require("../controllers/auth.controller");
const authmw = require("../middleware/auth.mw");

module.exports= (app)=>{
    app.post("/api/auth/signup",authmw.verifySignUpBody,authcontroller.signUp)
    app.post("/api/auth/signin",authmw.verifySignInBody,authcontroller.signIn)
}