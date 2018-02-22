module.exports = {
 rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    development: {
      host: "localhost",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten:  {
     network_id: 3,
     host: "localhost",
     port:  8545,
     gas:   10443034,
     // gasPrice: '2E90EDD000',
     from: '0x3905692887231e5672dacb49c0a32b87f7de81a8'
  }
}
}
