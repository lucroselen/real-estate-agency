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
  try {
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
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/register", isAlreadyLogged, (req, res) => {
  let title = "Register";
  res.render("register", { title });
});

router.post("/register", isAlreadyLogged, async (req, res) => {
  let { name, username, password, rePassword } = req.body;

  try {
    if (name) {
      name = name
        .split(" ")
        .map((x) => (x = x[0].toUpperCase() + x.slice(1)))
        .join(" ")
        .toString();
    }
    if (password !== rePassword) {
      res.render("register", { error: "Both passwords must be the same!" });
    } else {
      await authServices.register(name, username, password);
      res.redirect("/login");
    }
  } catch (error) {
    res.render("register", { error: getErrorMessage(error) });
  }
});

function getErrorMessage(error) {
  let errorNames = Object.keys(error.errors);
  if (errorNames.length > 0) {
    return error.errors[errorNames[0]].properties.message;
  } else {
    return error.message;
  }
}
module.exports = router;
