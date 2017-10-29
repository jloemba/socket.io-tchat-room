/*  --------------------------------------------------------------------------------------------------------------------------------------------
                                                          NOTRE CLIENT
 --------------------------------------------------------------------------  -------------------------------------------------------------------  */



/* --------- CONNEXION AU SERVEUR  --------- */

var socket = io.connect('http://localhost:4000');

/*    --------- REQUÊTES DE DOM ---------

  On récupère les 'id' des élèments HTML via des QuerySelector

*/
var message = document.getElementById('message'),  //CHAMPS DE SAISIE DU MESSAGE
    send = document.getElementById('send'),        //BOUTON 'Envoyer'
    output = document.getElementById('output'),    //CONTENEUR DES MESSAGES
    feedback = document.getElementById('feedback'); //CONTENEUR DU FEEDBACK
    //test = document.getElementById('test');
    //handle = document.title ;



/*   ----------------------   OUVERTURE DU CLIENT : 'message'  -----------------------

  Lorsque le client s'ouvre(Chrome, Edge, Safari,etc..) , on affiche le nom du client sur le nom de l'onglet

*/

    socket.on('message', function(data) {
      //On attribut le nom du client dans le tag 'title'
      document.title = data.nameClient;
   });


/*      ------------------------------ ENVOYER UN MESSAGE AVEC LE BOUTON 'Envoyer' : 'click'   ------------------------------

    Lorsque l'on clique sur le bouton 'Send'(#send),
    on envoie au serveur le nom du client(handle.value) et son message(message.value)

*/

function sendMessage() {
  if(message.value !== "") {
    var key;
    // le client transmet le message au serveur.
    socket.emit('chat',{
      message: message.value,
      handle: document.title,
      key: socket.id
    });
    message.value = "";
  }
}

send.addEventListener('click',function(){

  //On récupère donc leurs valeurs(message et nom de l'utilisateur) ci-dessus
  //Pour les envoyer vers le serveur qui les recevra (data) si les champs de
  // saisie ne sont pas vides.
  sendMessage();
});


/*          ------------------------------  GESTIONNAIRE DU CLAVIER : 'keypress' ------------------------------

    -> ENVOYER UN MESSAGE AVEC LA TOUCHE 'Entrée' SI LE CHAMPS N'EST PAS VIDE
    -> FEEDBACK côté CLIENT  pt1. ('Joris est en train d'écrire ..')
    Lorsque le client saisie une touche , le nom du client est envoyé au serveur(handle.value)

*/

  // message.onkeydown()

  /**
   * Preparing some namespaces
   * They will be used to display typing message
   */
  var messageValue;
  var timeout;

  /**
   * This function sets a timeout
   * It also says the user is no more typing
   */
  function timeoutFunction() {
    typing = false;
    socket.emit("saisie", false);
  }

  message.addEventListener('input', function(e) {
     messageValue = message.value;
        console.log(message.value);
        socket.emit('saisie', {handle:document.title, typing: true, messageValue});
        clearTimeout(timeout);
        timeout = setTimeout(timeoutFunction, 1000);
  });

  message.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) { sendMessage(); }
  })

  /*  ------------------------------  LE FEEDBACK côté CLIENT pt2. : 'saisie'  ------------------------------

      Sur l'évènement 'saisie' , On affiche un texte dans la page HTML.

  */
  socket.on('saisie', function(data) {
    if(data.typing && data.messageValue.trim() !== "") {
      feedback.innerHTML = '<strong>'+ data.handle +' écrit un message...</strong>';
    } else {
      feedback.innerHTML = "";
    }
  });

/*     --------------------------------- AFFICHER UN MESSAGE : 'chat'   --------------------------------------

    Sur l'évènement 'chat' , le feedback(voir plus bas) s'efface
    et la div #output affiche le nom du client(data.handle) et son msg(data.message).

    L'apparence du message change selon le client via l'ID de ce dernier :
    -> S'il s'agit d'un msg envoyé : le nom de l'envoyeur apparaît en BLEU
    -> S'il s'agit d'un msg reçu : le nom de l'envoyeur apparaît en ROUGE

*/

socket.on('chat', function(data){

    //Si l'ID de l'envoyeur est différent de celui de ce client
    if (data.distinct != socket.id) {

      //Alors c'est le message , c'est le message d'une autre personne
      //feedback.innerHTML = "";
      //output.innerHTML += '<p><strong style="color:red;">'+ data.clientMessage + ' (' + data.heureMessage +')'+ ' : </strong>' + data.messageBroadcast +'</p>';

      feedback.innerHTML = "";
      output.innerHTML += '<div class="message message-left" ><div class="message-text-wrapper"><div class="message-text">'+data.messageBroadcast+'</div>'+ data.heureMessage +'</div></div>';

    }
    else{
      //Sinon , il s'agit de mon propre message
      //feedback.innerHTML = "";
      //output.innerHTML += '<p><strong>'+ data.clientMessage + ' (' + data.heureMessage +')'+ ' : </strong>' + data.messageBroadcast +'</p>';

      feedback.innerHTML = "";
      output.innerHTML += '<div class="row"><div class="message message-right pull-right" ><div class="message-text-wrapper " style="color:rgb(166, 172, 175);"><div class="message-text ">'+data.messageBroadcast+'</div>'+ data.heureMessage +'</div></div></div>';
    }

    /*
        Permet de faire le scroll automatique vers le bas de la  file de la conversation
        output.scrollTop => Retourne la valeur du scroll par rapport au top de la page en pixel.
        output.scrollHeight => Retourne la hauteur de l'élément output.
    */
    output.scrollTop = output.scrollHeight;

});




/*  --------------------------------------------------------------------------------------------------------------------------------------------
                                                          FIN DE NOTRE CLIENT
 --------------------------------------------------------------------------  -------------------------------------------------------------------  */
