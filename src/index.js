import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3 from "web3"
import $ from 'jquery'

const fromElem = document.getElementById('from');
const sendTx = document.getElementById('sendtx');
const web3 = new Web3();

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});
$.get('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken',(data)=>{
    $('#gas-low').val(data.result.SafeGasPrice);
    $('#gas-mid').val(data.result.ProposeGasPrice);
    $('#gas-high').val(data.result.FastGasPrice);
})
$('#disconnect').on('click',()=>{
  connector.killSession().then((v)=>{
    console.log('kill session');
    window.location.reload();
  })
})
// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}else{
  initPage();
}

function initPage(){
  fromElem.value = connector.accounts[0];
}
// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
  initPage();
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
  fromElem.value= '';
});

sendTx.addEventListener('click',()=>{
  const tx = {
    from: connector.accounts[0], // Required
    to: $('#to').val().trim(), // Required (for non contract deployments)
    data:(()=>{
        if ($('#data').val().trim()==''){
            return '0x'
        }else{
          return $('#data').val().trim();
        }
    })(), 
    gasPrice: web3.utils.toHex( web3.utils.toWei($('#gasprice').val().trim(),'gwei')), // Optional
    gas: web3.utils.toHex($('#gaslimit').val().trim()), // Optional
    value: web3.utils.toHex($('#value').val().trim()), // Optional
    nonce: web3.utils.toHex($('#nonce').val().trim()) // Optional
  };
  console.log(tx);

  connector
    .sendTransaction(tx)
    .then((result) => {
      // Returns transaction id (hash)
      console.log(result);
      $('#txhash').val(result);
    })
    .catch((error) => {
      // Error returned when rejected
      console.error(error);
    });
})