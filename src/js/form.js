App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init_form: function() {
    return App.init_formWeb3();
  },



    init_formWeb3: function() {
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
      return App.initContractForm();
    },

    initContractForm: function() {
      $.getJSON("Election.json", function(election) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.Election = TruffleContract(election);
        // Connect provider to interact with contract
        App.contracts.Election.setProvider(App.web3Provider);

        //App.listenForEventsForm();

        return App.renderForm();
        //return Remplissage_Formulaire();
      });
    },

    renderForm: function() {
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          //alert("eee");
          $("#accountAddress").html("Adresse de connexion : " + account);

          console.log(account);
        }
      });
    },


    Remplissage_Formulaire :function(){

      var personInstance;

      var inputNom = $("#inputNom").val();
      var inputPrenom = $('#inputPrenom').val();
      var inputSexe = $("#inputSexe").val();
      var inputFonction= $("#inputFonction").val();

      App.contracts.Election.deployed().then(function(instance) {
        personInstance = instance;
        //return personInstance.addPerson("Ahmed","Ibrahim","Homme","Developpeur", { from: App.account });
        return personInstance.addPerson(inputNom,inputPrenom,inputSexe,inputFonction, { from: App.account });
      }).then(function(personCount) {
        setTimeout(function(){
           window.location.href = 'recap.html';
         }, 9000);
          // alert("seend !");
          //console.log("personCount : "+personCount);

          console.log("inputNom : "+inputNom);
          console.log("inputPrenom : "+inputPrenom);
          console.log("inputFonction : "+inputFonction);
          console.log("inputSexe : "+inputSexe);

      });


},

}
$(function() {
      $(window).load(function() {
        App.init_form();

     });
     //setTimeout(function(){ alert("Hello"); }, 3000);
});
