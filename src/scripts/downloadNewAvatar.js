import Handlebars from "handlebars";
import backPannelTpl from "../blocks/back-pannel/back-pannel.hbs?raw";
import profileAvatarTpl from "../blocks/profile-content/__avatar/avatar.hbs?raw";
import profileContentTpl from "../blocks/profile-content/profile-content.hbs?raw";
import cellButtonTpl from "../blocks/profile-content/__cell/cell-button.hbs?raw";
import cellTpl from "../blocks/profile-content/__cell/cell.hbs?raw";
import modalTpl from "../blocks/modal/modal.hbs?raw";
import buttonTpl from "../blocks/button/button.hbs?raw";
import profileTpl from "../layouts/profile/profile-new-avatar.hbs?raw";
import { profileInfo } from "../mocks/profileInfo";
import { infoModal } from "../mocks/infoModal";

Handlebars.registerPartial("backPannel", backPannelTpl);
Handlebars.registerPartial("profileAvatar", profileAvatarTpl);
Handlebars.registerPartial("primaryProfile", profileContentTpl);
Handlebars.registerPartial("cell", cellTpl);
Handlebars.registerPartial("cellButton", cellButtonTpl);
Handlebars.registerPartial("modal", modalTpl);
Handlebars.registerPartial("button", buttonTpl);

document.body.innerHTML = Handlebars.compile(profileTpl)({
  ...profileInfo,
  ...infoModal,
  profileContent: "primaryProfile",
});
