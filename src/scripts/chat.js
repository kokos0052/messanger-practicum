import Handlebars from "handlebars";
import chatWindowTpl from "../blocks/chat-window/chat-window.hbs?raw";
import chatHeaderTpl from "../blocks/chat-window/__chat-header/chat-header.hbs?raw";
import chatInputTpl from "../blocks/chat-window/__chat-input/chat-input.hbs?raw";
import chatMessagesTpl from "../blocks/chat-window/__chat-messages/chat-messages.hbs?raw";
import chatPannelTpl from "../blocks/chat-pannel/chat-pannel.hbs?raw";
import chatCardTpl from "../blocks/chat-pannel/__chat-card/chat-card.hbs?raw";
import avatarTpl from "../blocks/chat-pannel/__chat-card/__avatar/avatar.hbs?raw";
import chatInfoTpl from "../blocks/chat-pannel/__chat-card/__chat-info/chat-info.hbs?raw";
import chatSearch from "../blocks/chat-pannel/__chat-search/chat-search.hbs?raw";
import chatTlp from "../layouts/chat/chat.hbs?raw";
import { chats } from "../mocks/chats";
import { chatInfo } from "../mocks/chatInfo";

Handlebars.registerPartial("chatWindow", chatWindowTpl);
Handlebars.registerPartial("chatHeader", chatHeaderTpl);
Handlebars.registerPartial("chatInput", chatInputTpl);
Handlebars.registerPartial("chatMessages", chatMessagesTpl);
Handlebars.registerPartial("chatPannel", chatPannelTpl);
Handlebars.registerPartial("chatCard", chatCardTpl);
Handlebars.registerPartial("avatar", avatarTpl);
Handlebars.registerPartial("chatInfo", chatInfoTpl);
Handlebars.registerPartial("chatSearch", chatSearch);

document.body.innerHTML = Handlebars.compile(chatTlp)({
  chats,
  ...chatInfo,
  chatContent: "chatWindow",
});
