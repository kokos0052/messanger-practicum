import Handlebars from "handlebars";
import errorTpl from "../layouts/error/error.hbs?raw";
import buttonTpl from "../blocks/button/button.hbs?raw";

Handlebars.registerPartial("button", buttonTpl);

document.body.innerHTML = Handlebars.compile(errorTpl)({
  code: "404",
  message: "Не туда попали",
});
