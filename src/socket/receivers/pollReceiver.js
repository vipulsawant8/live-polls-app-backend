import { POLL_EVENTS } from "../events/pollEvents.js";
import { joinPollHandler, castVoteHandler } from "../handlers/pollHandlers.js";

const pollReceiver = (io, socket) => {

	socket.on(POLL_EVENTS.JOIN, (data) => {

		joinPollHandler(io, socket, data);
	});

	socket.on(POLL_EVENTS.CAST_VOTE, (data) => {

		castVoteHandler(io, socket, data);
	});
};

export default pollReceiver;