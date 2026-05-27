import Handlebars from "handlebars";
import backPannelTpl from "../blocks/back-pannel/back-pannel.hbs?raw";
import profileAvatarTpl from "../blocks/profile-content/__avatar/avatar.hbs?raw";
import profileContentTpl from "../blocks/profile-content/profile-content.hbs?raw";
import cellButtonTpl from "../blocks/profile-content/__cell/cell-button.hbs?raw";
import cellTpl from "../blocks/profile-content/__cell/cell.hbs?raw";
import profileTpl from "../layouts/profile/profile.hbs?raw";
import { profileInfo } from "../mocks/profileInfo";

Handlebars.registerPartial("backPannel", backPannelTpl);
Handlebars.registerPartial("profileAvatar", profileAvatarTpl);
Handlebars.registerPartial("primaryProfile", profileContentTpl);
Handlebars.registerPartial("cell", cellTpl);
Handlebars.registerPartial("cellButton", cellButtonTpl);

document.body.innerHTML = Handlebars.compile(profileTpl)({
  ...profileInfo,
  profileContent: "primaryProfile",
  disableInputs: true,
});
