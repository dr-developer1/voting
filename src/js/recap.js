var tab = new Array(10);
var tabContre = new Array(10);
const myMap = new Map();
const myMapContre = new Map();
var tmp;
var tmp2;
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',


  init_recap: function() {
    return App.init_recapWeb3();
  },

  init_recapWeb3: function() {

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
    return App.init_recapContract();
  },

  init_recapContract: function() {



    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      //App.listen_recapForEvents();
      App.listen_recapForEventsElection();
      //return App.render_recapElection();
      return App.render_recap();
      /*laa*/

    });

  },

  listen_recapForEventsElection: function(){

    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
        instance.votedEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          console.log("event triggered", event)
        // Reload when a new vote is recorded
        });
        return App.render_recapElection();
        //return App.render_recap();//App.render_recapElection();
        //return App.render_recapElectionContre();
      });


  },


  render_recap: function() {
    var personInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Adresse de connexion : " + account);

        console.log(account);
      }
    });


    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      personInstance = instance;
      return personInstance.personCount();
    }).then(function(personCount) {
      console.log("personCount : "+ personCount);
      candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
  /*    var id;
      var nom;
      var prenom;
      var sexe;
      var fonction;
      var candidatesResults;
      var candidateTemplate;
      var tab;*/

      for (var i = 1; i <= personCount; i++) {


      //  console.log("personCount : " + personCount);
        personInstance.personnes(i).then(function(personne) {
           var id = personne[0];
          var nom = personne[1];
           var prenom = personne[2];
          var sexe = personne[3];
          var fonction = personne[4];
        //  console.log("id "+i + " = " +id);
        //});
        /*  personInstance.getdeCisionpour(i).then(function(_tab){
            var tab = _tab;
              console.log("getdeCisionpour : " + tab);
          });*/
  //console.log("myMap.get(tmp) first : "+ tmp);
  console.log("vee : "+ nom);
      tmp2 = tmp - personCount+1;

        //console.log("i "+ i);

          candidateTemplate =
          "<tr><th>" + id
          + "</th><td>" + nom
          + "</td><td>" + prenom + "</td><td>" + sexe + "</td><td>" + fonction  +"</td><td>" +myMap.get(tmp2)  +"</td></tr>"//personInstance.getdeCisionpour(i);
          candidatesResults.append(candidateTemplate);
        //  console.log("tmp2 v2 "+ tmp2);
          //console.log("id : "+ id);
        //  console.log("fonction : "+fonction);


      });

        //return personInstance.Inscrits(App.account);
      }


      }).then(function(hasVoted) {

        loader.hide();
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });
      //return App.render2();
},


render_recapElection: function() {


  var electionInstance;
  // Load account data


  App.contracts.Election.deployed().then(function(election) {

     electionInstance = election;
     return electionInstance.personCount();
   }).then(function(personCount) {
     //console.log("personCount(render) : "+ personCount);

     for (var i = 1; i <= personCount; i++) {
       //alert("ss");
       //console.log("getdeCisionpour (i): " + i);
       console.log("i1 : " + i);

       electionInstance.getdeCisionpour(i).then(function(_tab){
         //console.log("personCount(render) : "+ personCount);
         tmp = i-personCount;
        // console.log("i2 (tmp) : " + (tmp));
         tab = _tab;
         myMap.set(tmp,tab);
           //console.log("getdeCisionpour (tab): " + tab);
            console.log("i1 prime : " + i);
           console.log("getdeCisionpour (MyMap) "+tmp+" : " + myMap.get(tmp) );
           personCount--;

       });
      }

    });
    //App.render_recapElectionContre();

},

/*render_recapElectionContre: function() {

  var electionInstance;
  // Load account data
alert("fddd");
  App.contracts.Election.deployed().then(function(election) {

     electionInstance = election;
     return electionInstance.personCount();
   }).then(function(personCount) {
     //console.log("personCount(render) : "+ personCount);

     for (var i = 1; i <= personCount; i++) {
       //alert("ss");
       //console.log("getdeCisionpour (i): " + i);
       console.log("i2 : " + i);

       electionInstance.getdeCisioncontre(i).then(function(_tab){
         //console.log("personCount(render) : "+ personCount);
         tmp2 = i-personCount;
        // console.log("i2 (tmp) : " + (tmp));
         tabContre = _tab;
         myMapContre.set(tmp2,tab);
           //console.log("getdeCisionpour (tab): " + tab);

           console.log("getdeCisioncontre (MyMapContre) "+tmp2+" : " + myMapContre.get(tmp2) );
           personCount--;
       });
      }
    });

},*/


}
$(function() {
      $(window).load(function() {
        App.init_recap();

     });
});
