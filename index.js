/*  --------------------------------------------------------------------------------------------------------------------------------------------
                                                              NOTRE SERVEUR
 ------------------------------------------------------------------------------------------------------------------------------------------------  */




/*
  Appel de la librairie EXPRESS
*/
var express = require('express');

//Appel de la librairie SOCKET.IO
 var socket = require('socket.io');

//Stockage de la librairie dans une variable 'app'
var app = express();

//Démarrage du serveur sur le port 4000(ce port était libre sur ma machine donc je l'ai utilsé)
var server = app.listen(4000,function(){
  console.log('Le port 4000 est sur écoute');
});

/* On définit le repertoire de fichiersstatiques qui sera utilisé
lors du lancement du serveur. Ici , il s'agira du folder 'public' */
app.use(express.static('public'));

/*  Notre Driver pour contenir la librairie SOCKET.IO
et permettre la connexion entre le serveur et le(s) client(s).
  ----
On définit premièrement le Serveur   */
var io = socket(server);  //Le Driver de Socket
 //L'indice du nombre de client connecté
var numSocket = 0;

    //Notre liste de nom pour les clients


/*

  LA CONNEXION D'UN CLIENT SUR LE SERVEUR
  Sur l'éveènement 'connection' , On indique 'socket' en paramètre qui correspond au client

*/
io.on('connection',function(socket){


  /*
    Lorsqu'un client se connecte ,
    le cmd affichera le message ci-dessus avec l'id du client.
  */
        console.log('-----  -----');
        console.log('Connexionn du socket établie avec le client',socket.id);
        numSocket++;
        console.log(numSocket+' client(s) connecté(s)');



      /* ----------- ATTRIBUTION DU NOM DU CLIENT CONNECTE -----------



       */


       function getRandomArbitrary(min, max) {
         return Math.random() * (max - min) + min;
       }


     //Notre liste de nom à attribuer aux sockets
     var  listName = ["Joris","Joé","Jordan","Josh","Johan","Joseph","Joshua","Joakim","Joël","Joey","Joffrey","John","Jonas","Jordy","Johnny"];


     //La liste de tous les sockets connectés
      var sockets = io.sockets.sockets;

      //Nombre de sockets connectés
      var nbClient = Object.keys(io.sockets.sockets).length;

       //Indice pour parcourir la liste listUser
      var indiceListUser = 0;

      /*On tirera un nombre au hasard entre 0 et la taille de la liste des noms. Ce nombre/chiffre sera l'indice utilisé
      pour choisir le nom du socket  */
      var indice = Math.round(Math.random() * listName.length - 0);

      //S'il y a quelqu'un sur le serveur,
      if(nbClient > 0){

        //Si le nom de ce socket est indéfini,
        if (socket.nickname === undefined){

          //On affecte le nom provenant de la liste qui a été tiré au hasard .
          socket.nickname = listName[indice] ;

        }

        //FIN SI
      }


      //On envoie maintenant ce nom au client via l'event 'message'.
      socket.emit('message', {nameClient :socket.nickname});

  /* ------ LA DECONNEXION D'UN CLIENT -------

  */

  socket.on('disconnect', function(){
      numSocket--;
      console.log('Le client'+socket.id+' vient de se déconnecter.');
      console.log(nbClient);
  });




  /*  ----------------  LA RECEPTION DU MESSAGE PAR LE CLIENT PUIS SON ENVOI AUX AUTRES CLIENTS  ----------------
  Sur l'évènement 'chat' , on envoie le message reçu à tous les clients par broadcast.
  On s'attend à recevoir le message saisie , le nom de celui qu'il la saisie ainsi que l'heure d'envoi.
   */


        /* L'HEURE DU MESSAGE: Fonction pour rajouter un Zero à la dizaine */
        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

  socket.on('chat',function(data){

     var temps = new Date();
     var heure = addZero(temps.getHours());
     var minutes = addZero(temps.getMinutes());
     temps = heure+":"+minutes;

     io.sockets.emit('chat', {messageBroadcast: data.message, clientMessage: data.handle, heureMessage: temps, distinct:data.key});
  });

  /*  --  LE FEEDBACK côté SERVEUR('Joris est en train d'écrire ..')  --
      Sur l'évènement 'saisie' , On envoie une donnée aux clients.
  */
  socket.on('saisie',function(data){
    socket.broadcast.emit('saisie',data);
  });

});




/*  --------------------------------------------------------------------------------------------------------------------------------------------
                                                          FIN DU SERVEUR
 --------------------------------------------------------------------------  -------------------------------------------------------------------  */

/*  PETITE DOC
-> EXPRESS : Module de NODE.JS pour toutes les requêtes (POST,GET ,etc.) et la mise du place du serveur.
*/
