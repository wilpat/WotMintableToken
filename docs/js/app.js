App = {

  web3Provider: null,
  contracts: {},
  minter: '0x0',
  loading: false,
  tokensAvalaible: 0,
  coinbase: '0x0',

  init: function() {
    App.initWeb3();
    console.log("App initialized...");
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    window.web3 = web3;
    return App.initContracts();
  },

  initContracts: () => {
    $.getJSON("WotToken.json", function(WotToken) {
        App.contracts.WotToken = TruffleContract(WotToken);
        App.contracts.WotToken.setProvider(App.web3Provider);
        App.contracts.WotToken.deployed().then(function(WotToken) {
          // console.log("WOT Token Address:", WotToken.address);
        });

        App.listenForEvents();
        return App.render();
      });
  },

  render : () =>{
    if(App.loading){
      return;
    }
    let loader = $('#loader');
    let loader1 = $('#loader1');
    let content = $('#content')

    // Loading account data
    web3.eth.getCoinbase((err, acc) =>{
      if(!err){
        App.coinbase = acc;
        $('#coinbase').html(`Your address is : ${acc}`)
      }
    })

    // Load token contract
    App.contracts.WotToken.deployed().then(i =>{
      token = i;
      return token.minter();
    }).then(minter =>{
      // console.log(minter);
      App.minter = minter;
      $('#minter').val(minter)
      return token.totalSupply();
    }).then(totalSupply => {
      App.tokensAvalaible = totalSupply.toNumber();
      $('#tokensAvalaible').html(App.tokensAvalaible);
      App.loading = false;
      loader.hide();
      loader1.hide();
      content.show();
    })
  },


  mintTokens: () =>{
    if(App.coinbase != App.minter){
      alert('You are not allowed to mint.');
    } else {
      $('#content').hide();
      $('#loader1').show();
      let numberOfTokens = $('#numberOfTokens').val();
      App.contracts.WotToken.deployed().then(i => {
        token = i;
        return token.mintTokens(numberOfTokens)
      }).then(receipt => {
        console.log('Tokens minted.')
        $('form#mint').trigger('reset') // reset number of tokens in form
      }).catch(err=>{
        console.log(err);
        App.render();
        alert('Something went wrong with your request.')
      });
    }
  },

  updateMinter: () => {
    $('#content').hide();
    $('#loader1').show();
    let newMinter = $('#minter').val();
    if(web3.isAddress(newMinter)){
      App.contracts.WotToken.deployed().then(i => {
        token = i;
        return token.updateMinter(newMinter);
      }).then(receipt =>{
        console.log('Minter Updated');
      })
      .catch(err=>{
        console.log(err);
        App.render();
        alert('You are not allowed to update minter.')
      });
    }else{
      alert('Invalid mint address.')
    }
  },

  listenForEvents: () =>{
    App.contracts.WotToken.deployed().then(i =>{
      token = i;
      token.Mint({}, {}).watch((error,event) => {
        if(!error){
          console.log('Event: ', event);
          App.render();
        }else{
          console.error(error);
        }
      });
      token.MinterUpdate({}, {}).watch((error,event) => {
        if(!error){
          console.log('Event: ', event);
          App.render();
        }else{
          console.error(error);
        }
      });
    })
  }
}



$(function() {
     $(window).load(function() {
          App.init();
     });
});
