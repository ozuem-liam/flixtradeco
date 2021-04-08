const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const axios = require('axios')
const bitcore = require('bitcore-explorers/node_modules/bitcore-lib');
const Insight = require('bitcore-explorers').Insight;

// Home routes
router.get('/', (req, res) => res.render('welcome'));
router.get('/about', (req, res) => res.render('about'));
router.get('/contactus', (req, res) => res.render('contactus'));
router.get('/faq', (req, res) => res.render('faq'));
router.get('/forgotpass', (req, res) => res.render('forgotpass'));
router.get('/news', (req, res) => res.render('news'));
router.get('/rules', (req, res) => res.render('rules'));
// router.use(express.static('./flixtrade.co'))


// User Routing
router.get('/account', ensureAuthenticated, (req, res) => 
res.render('a=account', {
    username: req.user.username,
    date: req.user.date
}));

router.get('/a=home', ensureAuthenticated, (req, res) => res.render('a=home'));

router.get('/a=about-us', ensureAuthenticated, (req, res) => res.render('a=about'));

router.get('/a=faq', ensureAuthenticated, (req, res) => res.render('a=faq'));

router.get('/a=news', ensureAuthenticated, (req, res) => res.render('a=news'));

router.get('/a=contactus', ensureAuthenticated, (req, res) => res.render('a=contactus'));

router.get('/a=rules', ensureAuthenticated, (req, res) => res.render('a=rules'));

// User Account Routing

router.get('/a=deposit', ensureAuthenticated, (req, res) => res.render('deposit'));
router.get('/a=deposit_list', ensureAuthenticated, (req, res) => res.render('deposit_list'));
router.get('/a=withdraw', ensureAuthenticated, (req, res) => res.render('withdraw'));
router.get('/a=withdraw_history', ensureAuthenticated, (req, res) => res.render('withdraw_history'));
router.get('/a=earnings', ensureAuthenticated, (req, res) => res.render('history'));
router.get('/a=security', ensureAuthenticated, (req, res) => res.render('setting'));
router.get('/a=edit_account', ensureAuthenticated, (req, res) => 
res.render('edit_account', {
    userId: req.user._id,
    username: req.user.username,
    date: req.user.date,
    name: req.user.name,
    wallet: req.user.wallet,
    email: req.user.email
}));
router.get('/a=referals', ensureAuthenticated, (req, res) => res.render('referral'));
router.get('/a=referallinks', ensureAuthenticated, (req, res) => res.render('referrallinks'));


// // Creating sender adress from WIF (Wallet Imported Format)
// const prvKeySenderWIF = 'cPeVnqLvV1g1uf6qSjNtMKk5NXQB39LbKX6xDS7C1tw1ga4Jou7L';
// const prvKeySender = bitcore.PrivateKey.fromWIF(prvKeySenderWIF);
// const addrSender = prvKeySender.toAddress();

// console.log('Sender Address>>' + addrSender);

// // Create reciever address from WIF (Wallet Imported Format)
// const prvKeyReceiverWIF = 'cNVWz5ZGEybU3Ye9wacVfpMMk1vPb3RG3BLh36h8rMUxSW4bvWYu';
// const prvKeyReceiver = bitcore.PrivateKey.fromWIF(prvKeyReceiverWIF);
// const addrReceiver = prvKeyReceiver.toAddress();

// console.log('Receiver Address>> ' + addrReceiver)

// const insight = new Insight('testnet');

// insight.getUnspentUtxos(addrSender, (err, utxos) => {
//     if(err) {}
//     else{
//         //Unspent transaction Output for new transaction
//         console.log('Unspent Transaction Output' + utxos);

//         let tx = bitcore.Transaction();
//         tx.from(utxos);
//         tx.to(addrReceiver, 1000);
//         tx.change(addrSender);
//         tx.fee(50000);

//         //Signing the transaction with Sender's privateKey
//         tx.sign(prvKeySender);
//         // console.log('transaction:');
//         // console.log(tx.toObject());

//         tx.serialize();

//         // const scriptIn = bitcore.Script(tx.Object().inputs[0].script)
//         // console.log('input script string: ');
//         // console.log(scriptIn.toString());
//         // const scriptOut = bitcore.Script(tx.toObject().outputs[0].script)
//         // console.log('output script string: ');
//         // console.log(scriptOut.toString());

//         // tx.addData()
//         insight.broadcast(tx, (err, returnedTxId) => {
//             if(err){
//                 console.log(err);
//             } else {
//                 console.log('successful broadcast: ' + returnedTxId);
//             }
//         });
//     }
// });





const sendBitcoin = async (recieverAddress, amountToSend) => {
  const sochain_network = "BTCTEST";
  const privateKey = process.env.PRIVATE_KEY;
  const sourceAddress = "mg28B9bWsnidhbmLLr4LqBCTqxXHGE67r8";
  const satoshiToSend = amountToSend * 100000000;
  let fee = 0;
  let inputCount = 0;
  let outputCount = 2;
  const utxos = await axios.get(
    `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
  );
  const transaction = new bitcore.Transaction();
  let totalAmountAvailable = 0;

  let inputs = [];
  utxos.data.data.txs.forEach(async (element) => {
    let utxo = {};
    utxo.satoshis = Math.floor(Number(element.value) * 100000000);
    utxo.script = element.script_hex;
    utxo.address = utxos.data.data.address;
    utxo.txId = element.txid;
    utxo.outputIndex = element.output_no;
    totalAmountAvailable += utxo.satoshis;
    inputCount += 1;
    inputs.push(utxo);
  });

  transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
  // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

  fee = transactionSize * 20
  if (totalAmountAvailable - satoshiToSend - fee  < 0) {
    throw new Error("Balance is too low for this transaction");
  }

  //Set transaction input
  transaction.from(inputs);

  // set the recieving address and the amount to send
  transaction.to(recieverAddress, satoshiToSend);

  // Set change address - Address to receive the left over funds after transfer
  transaction.change(sourceAddress);

  //manually set transaction fees: 20 satoshis per byte
  transaction.fee(fee * 20);

  // Sign transaction with your private key
  transaction.sign(privateKey);

  // serialize Transactions
  const serializedTransaction = transaction.serialize();
  // Send transaction
  const result = await axios({
    method: "POST",
    url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
    data: {
      tx_hex: serializedTX,
    },
  });
  return result.data.data;
};

sendBitcoin("mtVE8anM63kQcgKUC6oQQD9K6xiV4wsryq", 0.0003);


module.exports = router;  