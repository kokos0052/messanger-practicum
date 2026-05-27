import Handlebars from "handlebars";
import buttonTpl from "../blocks/button/button.hbs?raw";
import authTpl from "../layouts/auth/auth.hbs?raw";
import fieldTpl from "../blocks/form-input/input.hbs?raw";
import signinTpl from "../layouts/auth/__signup/auth__signup.hbs?raw";

Handlebars.registerPartial("button", buttonTpl);
Handlebars.registerPartial("field", fieldTpl);
Handlebars.registerPartial("signupForm", signinTpl);

document.body.innerHTML = Handlebars.compile(authTpl)({
  formType: "signupForm",
});
