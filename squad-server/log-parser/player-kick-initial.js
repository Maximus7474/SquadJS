export default {
    regex:
      /^\[([0-9.:-]+)]\[\s*([0-9]+)]LogOnlineGame: Display: Kicking player:\s+(.*)\s+;\s+Reason\s+=\s+(.*)$/,
    onMatch: (args, logParser) => {

        const timestamp = args[1];
        const chainId = +args[2];
        const playerName = args[3];
        const reason = args[4];

        logParser.eventStore.kicks[chainId] = {
            timestamp,
            reason,
            player: {
                playerName
            }
        };
    }
  };
  