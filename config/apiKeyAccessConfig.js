const planLimits = {
    
  free: {
    "/api/wallet/createwallet":20,    //20 request per month
    "/api/wallet/createtransferdefault":20,
    "/api/wallet/getaddresses":20 , 
    "/api/wallet/getdefaultaddress":20,
    "/api/wallet/getbalance":20
  },
  premium: {
    "/api/wallet/createwallet":40,
    "/api/wallet/createtransferdefault":40,
    "/api/wallet/getaddresses":40 , 
    "/api/wallet/getdefaultaddress":40,
    "/api/wallet/getbalance":40
  },
};  

module.exports = planLimits