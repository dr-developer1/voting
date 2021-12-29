App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
  
    init_new: function() {
      return App.init_newWeb3();
    },
  
  
  
      init_newWeb3: function() {
        // TODO: refactor conditional
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
        } else {
          // Specify default instance if no web3 instance provided
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          web3 = new Web3(App.web3Provider);
        }
        return App.initNewForm();
      },
  
      initNewForm: function() {
        $.getJSON("newElection.json", function(newElection) {
          // Instantiate a new truffle contract from the artifact
          // var ethers = require('ethers');  
// var crypto = require('crypto');

// let account = web3.eth.accounts;
// console.log("Acc: " + account);
            // console.log(acc);
          // newElection['networks']['address'] = '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01';
          App.contracts.newElection = TruffleContract(newElection);
          // Connect provider to interact with contract
          App.contracts.newElection.setProvider(App.web3Provider);
          // newElection['networks']['address'] = '0x00';
            // console.log(newElection['networks']['address'])
          //App.listenForEventsForm();
  
          return App.renderNew();
          //return Remplissage_Formulaire();
        });
      },
  
      renderNew: function() {
        web3.eth.getCoinbase(function(err, account) {
          if (err === null) {
            App.account = account;
            //alert("eee");
            // $("#accountAddress").html("Adresse de connexion : " + account);
  
            // console.log(account);
          }
        });
      },
  redirect :function(){
    return window.location.href = "http://localhost:3000/question.html";
  },
  
      FormSubmit :function(){
  
        var questionInstance;
            // Get all the forms elements and their values in one step
            // var values =$('input name="suggestion"');
            let values = [];
            $("input[name='suggestion[]']").each(function() {
                values.push($(this).val());
            });
            var inputTitle = $('#inputTitle').val();
            // iterates over array elements
            //console.log(values);
            // alert('test');
            // return App.redirect();
            // return window.location.href = "http://localhost:3000/test.html";
            App.contracts.newElection.deployed().then(function(instance) {
                for (let value of values) {
                    // console.log( value );
                    // questionInstance.addNewElection(value);
                    instance.addNewElection(inputTitle, value, { from: App.account });
                    }
                    return App.redirect();
              });
  
      },
      AddSugg :function() 
      {
        let string = "$(this).closest('.form-group').remove();"
        let div = $('#newsuggrow');
        let newDiv = '';
        newDiv +='<div class="form-group col-md-4">';
        newDiv +='<input type="text" class="form-control" name="suggestion[]">';
        newDiv +='<a href="javascript:void(0);" class="link delete suggestion-delete-row" onclick="'+string+'">Remove</a>';
        newDiv +='</div>';
        div.append(newDiv);
      },
      RemoveSugg :function() 
      {
      //   $(".suggestion-delete-row").click(function(e) {
      //     alert('test');
          // e.preventDefault();
          // $(this).parent().remove();
      // });
        // console.log($(this));
      }
  };
  
  $(function() {
        $(window).load(function() {
          App.init_new();
  
       });
  });