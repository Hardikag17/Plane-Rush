//jshint esversion:8
const path = require('path');

module.exports = {
  contracts_build_directory: path.join(__dirname, 'src/abis'),
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
  },

  compilers: {
    solc: {
      version: '0.6.6',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: ['truffle-plugin-verify'],
};
