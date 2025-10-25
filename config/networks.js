const { mainnet,base,baseSepolia,sepolia } = require('viem/chains');


const networks = (network) =>{
   if(network === "Sepolia"){
     return {network:sepolia,rpc:process.env.SEPOLIA_RPC}
   }
   if(network === "BaseSepolia"){
     return {network:baseSepolia,rpc:process.env.BASE_SEPOLIA_RPC}
   }
   if(network === "Ethereum"){
     return {network:mainnet,rpc:process.env.ETHEREUM_RPC} 
   }
   if(network === "Base"){
     return  {network:base,rpc:process.env.BASE_RPC}
   }
}
module.exports = networks