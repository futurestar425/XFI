export const MAINNET = 1;
export const POLYGON = 137;
export const ARBITRUM = 42161;
export const SEPOLIA = 11155111;
export const POLYGON_MUMBAI = 80001;
export const ARBITRUM_GOERLI = 421613;

// Define the chainId to ChainInfo map
export const chainIdToInfo: Record<number, ChainInfo> = {
    1: {
      id: 1,
      name: "Ethereum",
      rpc: "https://ethereum.blockpi.network/v1/rpc/public",
      currency: "ETH",
      _asset: "",
      _usdt: "",
      _xfi: "",
      _aToken: "",
      _vault: "",
      _factory: ""
    },
    137: {
        id: 137,
        name: "Polygon",
        rpc: "https://polygon.blockpi.network/v1/rpc/public",
        currency: "MATIC",
        _asset: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        _usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        _xfi: "0x04bdC310e11181c1f66f0155BF3ebb319868bF4A",
        _aToken: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
        _vault: "0x56dC8572428c3b2c2F121049E26F9b37a7Ad9599",
        _factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
    },
    42161: {
        id: 42161,
        name: "Arbitrum",
        rpc: "https://endpoints.omniatech.io/v1/arbitrum/one/public",
        currency: "ETH",
        _asset: "",
        _usdt: "",
        _xfi: "",
        _aToken: "",
        _vault: "",
        _factory: ""
    },
    11155111: {
        id: 11155111,
        name: "Sepolia",
        rpc: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
        currency: "ETH",
        _asset: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
        _usdt: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
        _xfi: "0x075F948C3a82d6f8f7149B25dbE06E5f12105986",
        _aToken: "0x16dA4541aD1807f4443d92D26044C1147406EB80",
        // _vault: "0x2434Fc177d053105551b6193542Ef55862b71CB9",
        // _vault: "0x4091F927f25E32458d224F0C0821b65b647f5aF6",
        // _vault: "0xb39e01E564300D86fFb95E9Aeed5273Ec7b7A1A6",
        // _vault: "0xeb8d76Ef2B1ff058bd6cb158faD71Deb2dd5e1C5",///
        // _vault: "0x782EE0E77851CE773857178d96AB4bfB4ef1269c",
        _vault: "0x435d9135a89abec4604e0c8eB7Ec15966923C7eE",
        _factory: "0xc9f18c25Cfca2975d6eD18Fc63962EBd1083e978"
    },
    80001: {
        id: 80001,
        name: "Mumbai",
        rpc: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
        currency: "MATIC",
        _asset: "0x52D800ca262522580CeBAD275395ca6e7598C014",
        _usdt: "0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2",
        _xfi: "0xe65dCfea4e04129eB5e0616ED01AE35ECB844642",
        _aToken: "0x4086fabeE92a080002eeBA1220B9025a27a40A49",
        _vault: "0x006bcB5796f507d98303F8112Ccbb9307c0f8fD1",
        _factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32"
    },
    421613: {
        id: 421613,
        name: "Arbitrum Goerli",
        rpc: "https://arbitrum-goerli.blockpi.network/v1/rpc/public	",
        currency: "AGOR",
        _asset: "",
        _usdt: "",
        _xfi: "",
        _aToken: "",
        _vault: "",
        _factory: ""
    },
    // Add more chainId to ChainInfo mappings as needed
  };
  

// SEPOLIA
// const _asset = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // usdc 
// const _usdt = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0';
// const _xxx = '0x075F948C3a82d6f8f7149B25dbE06E5f12105986'; // xfi token (test)
// const _aaveAToken = '0x16dA4541aD1807f4443d92D26044C1147406EB80' // Aave aUSDC address
// const _aavePool = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'; // aave v3 pool
// const _routerAddress = '0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98' // Uniswap V2 router address
// const _factoryAddress = '0xc9f18c25Cfca2975d6eD18Fc63962EBd1083e978' // Uniswap V2 factory address
// const aaveVault = '0xB999BceB27D24dBEc0E0319956A6523E104b23b4'; // Aave Vault


// MUMBAI 
// const _asset = '0x52D800ca262522580CeBAD275395ca6e7598C014'; // usdc 
// const _usdt = '0x1fdE0eCc619726f4cD597887C9F3b4c8740e19e2';
// const _xxx = '0xe65dCfea4e04129eB5e0616ED01AE35ECB844642'; // xfi
// const _aaveAToken = '0x4086fabeE92a080002eeBA1220B9025a27a40A49' // Aave aUSDC address
// const _aavePool = '0xcC6114B983E4Ed2737E9BD3961c9924e6216c704'; // aave v3 pool (Pool-Proxy) 
// const _routerAddress = '0x8954AfA98594b838bda56FE4C12a09D7739D179b' // Quickswap V2 router address
// const _factoryAddress = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32' // Quickswap V2 factory address
// const aaveVault = '0x1dBE405800cC48560B05296D794379cF93b4f061'; // Aave Vault


// ARBITRUM GOERLI not supported yet 


// Polygon mainnet 
// const _asset = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'; // usdc 
// const _usdt = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
// const _xxx = '0x04bdC310e11181c1f66f0155BF3ebb319868bF4A'; // xfi 
// const _aaveAToken = '0x625E7708f30cA75bfd92586e17077590C60eb4cD' // Aave aUSDC address
// const _aavePool = '0x794a61358D6845594F94dc1DB02A252b5b4814aD'; // aave v3 pool (Pool-Proxy) 
// const _routerAddress = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff' // Quickswap V2 router address
// const _factoryAddress = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32' // Quickswap V2 factory address
// const aaveVault = '0x4e6ce0904b12bdaa6ac49c575970f2cbfdd230df';