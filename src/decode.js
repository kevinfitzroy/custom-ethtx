
import decoder from 'ethereum-tx-decoder'
import $ from 'jquery'
// var decoder = require('ethereum-tx-decoder');
import Web3 from "web3"
const web3 = new Web3();
var BN = web3.utils.BN;


$('#decode').on('click',()=>{
    var raw = $('#rawtxdata').val().trim();

    var decodedTx = decoder.decodeTx(raw);
    function hexToNumber(key,unit){
        return web3.utils.fromWei(web3.utils.hexToNumberString(decodedTx[key]['_hex']),unit);
    }
    decodedTx['gasPrice'] = hexToNumber('gasPrice','gwei')
    decodedTx['gasLimit'] = web3.utils.hexToNumberString(decodedTx['gasLimit']['_hex']).toString()
    decodedTx['value'] = hexToNumber('value','ether');
    $('#rawtxdecode').val(JSON.stringify(decodedTx,null, '    '));
})

