import { iterateIDs, lowerID } from "core/id-parser";

export default {
    regex:
      /^\[([0-9.:-]+)]\[\s*([0-9]+)]LogSquad: ADMIN COMMAND: Kicked player \d+\. \[Online IDs=\s*(.*?)\] \s*(.*?)(?: from RCON)?$/,
    onMatch: (args, logParser) => {

        const timestamp = args[1];
        const chainId = +args[2];
        const playerName = args[3];
        const reason = args[4];

        const IDs = {};
        iterateIDs(args[5]).forEach((platform, id) => {
            IDs[lowerID(platform)] = id;
        });

        const player = {
            playerName,
            ...IDs
        };

        logParser.eventStore.kicks[chainId] = {
            ...logParser.eventStore.kicks[chainId],
            player,
            timestamp,
            reason
        };

        logParser.emit('PLAYER_KICK', logParser.eventStore.kicks[chainId]);
        delete logParser.eventStore.kicks[chainId];
    }
};
  