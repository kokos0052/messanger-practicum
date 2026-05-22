import Handlebars from "handlebars";
import linksTpl from "../blocks/links/links.hbs?raw";
import navigationTpl from "../layouts/navigation/navigation.hbs?raw";
import { links } from "../mocks/links";

Handlebars.registerPartial("links", linksTpl);

document.body.innerHTML = Handlebars.compile(navigationTpl)({ links });
