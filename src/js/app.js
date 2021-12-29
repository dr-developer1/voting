App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {


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
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
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
      electionInstance = instance;
      console.log("ddd : " +electionInstance.candidatesCount() );

      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {

      //alert("ddd");
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var descriptif = candidate[2];
          var voteCountPour = candidate[3];
          var voteCountContre = candidate[4];
          //var hasVoted = candidate[5];
          console.log(" id : " +candidate[0])
          //alert("hasVoted : " +hasVoted);

          // Render candidate Result
          var candidateTemplate =
          "<tr><th>" + id
          + "</th><td>" + name
          + "</td><td>" + descriptif
          + "</td><td>"+voteCountPour
          +"</td><td>"+voteCountContre
          +"</td><td><button value='pour' type='submit' data-id=" +id + " class='btn btn-primary btnVote"+id+"' onclick='App.castVotePour()'>Vote Pour</button></td>"
          +"<td><button value='pour' type='submit' data-id=" +id + " class='btn btn-primary btnVote"+id+"' onclick='App.castVoteContre()'>Vote Contre</button></td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var btnclick=0;
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);

        });

      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        // let btnname = btnVote1 + id;
        // $('.btnVote'+id).hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

  },

  castVotePour: function() {
    var candidateId = document.activeElement.getAttribute('data-id');
    // alert(document.activeElement.getAttribute('data-id'))
    // console.log($('#form').data('#candidatesSelect', this.text))
    // return false;
    App.contracts.Election.deployed().then(function(instance) {
      return instance.votePour(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();

      // $('.btnVote1').hide();
    }).catch(function(err) {
      console.error(err);
    });
  },
  castVoteContre: function() {
    var candidateId = document.activeElement.getAttribute('data-id');

    App.contracts.Election.deployed().then(function(instance) {
      return instance.voteContre(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
      // $('.btnVote1').hide();
    }).catch(function(err) {
      console.error(err);
    });
  },
  confirmerNvlleRegle :function(){

    var inputAjoutTitre = $("#titreAjout").val();
    var inputAjoutDescriptif = $("#descriptifAjout").val();
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addCandidate(inputAjoutTitre,inputAjoutDescriptif, { from: App.account });
    }).then(function(candidatesCount) {

      // var ajoutTemplate ="<tr> <th>" + candidatesCount+1 + "</th><td>" + inputAjoutTitre + "</td><td>" + inputAjoutDescriptif + "</td><td> 0 </td><td>0</td> </tr>"
      //$('#table tbody').append(ajoutTemplate );
      $('#exampleModal').modal('hide');
      return App.render();
    });

  },
  newElection :function(){
    return window.location.href = "http://localhost:3000/newElection.html";
  },

  getVotePerAcccount : function(){
    var tab = new Array(10);
    var electionInstance;
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      var tab = new Array(5);
      return electionInstance.getVotePerAcccount({ from: App.account });
  }).then(function(tab) {
      //alert("ss");
      //alert("tab[0] :" +tab[0]);
    console.log("tab : "+ tab);
  });
}
};

$(function() {
  $(window).load(function() {
    App.init();
    //$('#ajoutResults').hide();
    //$('#AjoutRegleBtn').click(function(){
      //  $('#ajoutResults').show();

    //});

 });
});
