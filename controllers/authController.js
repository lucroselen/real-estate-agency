const express = require("express");
const router = express.Router();
const authServices = require("../services/authServices");
const { TOKEN_COOKIE_NAME } = require("../config/constants");
const { isAuth, isAlreadyLogged } = require("../middlewares/authMiddleware");

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME);
  res.redirect("/");
});
router.get("/login", isAlreadyLogged, (req, res) => {
  let title = "Login";
  res.render("login", { title });
});

router.post("/login", isAlreadyLogged, async (req, res) => {
  let { username, password } = req.body;
  let user = await authServices.login(username, password);

  if (!user) {
    return res.redirect("/404");
  }
  let token = await authServices.createToken(user);

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
  });

  res.redirect("/");
});

router.get("/register", isAlreadyLogged, (req, res) => {
  let title = "Register";
  res.render("register", { title });
});

router.post("/register", isAlreadyLogged, async (req, res) => {
  try {
    let { name, username, password, rePassword } = await req.body;
    authServices.register(name, username, password);
    res.redirect("/login");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
