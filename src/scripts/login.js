import Handlebars from "handlebars";
import buttonTpl from "../blocks/button/button.hbs?raw";
import fieldTpl from "../blocks/form-input/input.hbs?raw";
import authTpl from "../layouts/auth/auth.hbs?raw";
import loginTpl from "../layouts/auth/__login/auth__login.hbs?raw";

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("field", fieldTpl);
Handlebars.registerPartial("loginForm", loginTpl);

document.body.innerHTML = Handlebars.compile(authTpl)({
  formType: "loginForm",
});
