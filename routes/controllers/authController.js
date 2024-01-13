import { validasaur } from "../../deps.js";
import { bcrypt } from "../../deps.js";
import * as authService from "../../services/authService.js";

const registerRules = async() => {
  return {
    email: [validasaur.required, validasaur.isEmail, validasaur.notIn(await authService.getUsedEmails())],
    password: [validasaur.required, validasaur.minLength(4)],
  };
};
/* redundant for now
const loginRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required],
};
*/

const getRegisterData = async(request) => {
  const body = request.body({type: "form"});
  const params = await body.value;

  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const getLoginData = async(request) => {
  const body = request.body({type: "form"});
  const params = await body.value;

  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const showRegistration = ({render}) => {
  render("register.eta");
};

const showLogin = ({render}) => {
  render("login.eta");
};

const loginUser = async({state, request, response, render}) => {
  const loginData = await getLoginData(request);
  const user = await authService.getUserByEmail(loginData.email);
  const hash = user ? user.password : "";
  const cmp = await bcrypt.compare(loginData.password, hash);

  if (!cmp) {
    console.log("match error on login");
    loginData.errors = {error: "email and password did not match"};
    render("/login.eta", loginData);
  } else {
    await state.session.set("user", user);
    response.redirect("/topics");
  };
};

const registerUser = async({render, request, response}) => {
  const registerData = await getRegisterData(request);

  const [passes, errors] = await validasaur.validate(
    registerData,
    await registerRules(),
  );

  if (!passes) {
    console.log(errors);
    registerData.errors = errors;
    render("register.eta", registerData);
  } else {
    const hash = await bcrypt.hash(registerData.password);
    await authService.registerUser(registerData.email, hash);
    console.log("user registered");
    response.redirect("/auth/login");  
  };
};

const logout = async({state, response}) => {
  await state.session.set("user", null)

  console.log("user logged out");
  response.redirect("/")
};  

export { showRegistration, showLogin, registerUser, loginUser, logout };