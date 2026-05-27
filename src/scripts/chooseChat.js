import Handlebars from "handlebars";
import chatPannelTpl from "../blocks/chat-pannel/chat-pannel.hbs?raw";
import chatCardTpl from "../blocks/chat-pannel/__chat-card/chat-card.hbs?raw";
import avatarTpl from "../blocks/chat-pannel/__chat-card/__avatar/avatar.hbs?raw";
import chatInfoTpl from "../blocks/chat-pannel/__chat-card/__chat-info/chat-info.hbs?raw";
import shooseChatTpl from "../blocks/choose-chat/choose-chat.hbs?raw";
import chatSearch from "../blocks/chat-pannel/__chat-search/chat-search.hbs?raw";
import chatTlp from "../layouts/chat/chat.hbs?raw";
import { chats } from "../mocks/chats";

Handlebars.registerPartial("chatPannel", chatPannelTpl);
Handlebars.registerPartial("chatCard", chatCardTpl);
Handlebars.registerPartial("avatar", avatarTpl);
Handlebars.registerPartial("chatInfo", chatInfoTpl);
Handlebars.registerPartial("chatSearch", chatSearch);
Handlebars.registerPartial("chooseChat", shooseChatTpl);

document.body.innerHTML = Handlebars.compile(chatTlp)({
  chats,
  chatContent: "chooseChat",
});
