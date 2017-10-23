var MatchGame = {};
var cardsFlipped = [];

if (sessionStorage.getItem("computerCounter") == null) {
  sessionStorage.setItem("computerCounter", 0);
  sessionStorage.setItem("userCounter", 0);

  var computerCounter = Number(sessionStorage.getItem("computerCounter"));
  var userCounter = Number(sessionStorage.getItem("userCounter"));

} else {
  var computerCounter = Number(sessionStorage.getItem("computerCounter"));
  var userCounter = Number(sessionStorage.getItem("userCounter"));
}

document.getElementById('computer-counter').innerHTML = computerCounter;
document.getElementById('user-counter').innerHTML = userCounter;

/* Muting the audio */
var volumeActivated = true;
function volume() {
  if (volumeActivated) {
    document.getElementById('start-audio').muted = true;
    volumeActivated = false;
    document.getElementById('volume-button').innerHTML = 'volume_off';
  } else {
    document.getElementById('start-audio').muted = false;
    volumeActivated = true;
    document.getElementById('volume-button').innerHTML = 'volume_up';
  }
}

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

function StartGame() {
  document.getElementById('start-audio').play();
  document.getElementById('StartGameButton').disabled = true;

  setTimeout(() => {
    var $game = $('#game');
    var values = MatchGame.generateCardValues();
    MatchGame.renderCards(values, $game);

    window.scrollTo(0, 1000);

    document.getElementById('StartGameButton').innerHTML = 'Start Again';
    document.getElementById('StartGameButton').style.color = "hsla(0, 100%, 50%, 0.5)";
    var seconds = 60;
    var hasLost;

    var workingSeconds = setInterval(() => {seconds -= 1;}, 1000);
    var writingTime = setInterval(() => {
      document.getElementById('timer').innerHTML = seconds;
      if (seconds == 0) {
        if (cardsFlipped.length !== 16) {
          hasLost = true;

          clearInterval(workingSeconds);
          clearInterval(writingTime);

          document.getElementById('StartGameButton').removeAttribute("disabled");
          document.getElementById('StartGameButton').style.color = "hsla(0, 100%, 50%, 1)";

          cardsFlipped = [];

        };

        if (hasLost == true) {
          computerCounter += 1;
          sessionStorage.computerCounter = computerCounter;
          document.getElementById('computer-counter').innerHTML = computerCounter;

          document.getElementById('game').innerHTML = '<div class="col-12 alert-container"><p>The game has finished!<br>You have lost :(</p></div>';

        } else {
          userCounter += 1;
          sessionStorage.userCounter = userCounter;
          document.getElementById('user-counter').innerHTML = userCounter;

          document.getElementById('game').innerHTML = '<div class="col-12 alert-container"><p>The game has finished!<br>You have won!</p></div>';

        };
      };

      if (cardsFlipped.length == 16) {
        userCounter += 1;
        sessionStorage.userCounter = userCounter;
        document.getElementById('user-counter').innerHTML = userCounter;

        clearInterval(workingSeconds);
        clearInterval(writingTime);

        document.getElementById('StartGameButton').removeAttribute("disabled");
        document.getElementById('StartGameButton').style.color = "hsla(0, 100%, 50%, 1)";
        cardsFlipped = [];

        document.getElementById('game').innerHTML = '<div class="col-12 alert-container"><p>YOU HAVE WON!</p></div>';

      };
    }, 10);

    setTimeout(() => {clearInterval(writingTime)}, 61000);

  }, 2000);
}

  /*
  Generates and returns an array of matching card values.
  */

  MatchGame.generateCardValues = function () {
    var inOrderCards = [];
    for (var i = 1; i <= 8; i++) {
      inOrderCards.push(i);
      inOrderCards.push(i);
    }

    var cardValues = [];
    while (inOrderCards.length > 0) {
      var randomIndex = Math.floor(Math.random() * inOrderCards.length);
      cardValues.push(inOrderCards[randomIndex]);
      inOrderCards.splice(randomIndex, 1);
    }

    return cardValues;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  $game.data('flippedCards', []);

  var colors = [
      'hsl(25, 85%, 65%)',
      'hsl(55, 85%, 65%)',
      'hsl(90, 85%, 65%)',
      'hsl(160, 85%, 65%)',
      'hsl(220, 85%, 65%)',
      'hsl(265, 85%, 65%)',
      'hsl(310, 85%, 65%)',
      'hsl(360, 85%, 65%)'];

  $game.empty();

  for (var j = 0; j < cardValues.length; j++) {
    var $newCard = $('<div class="col-3 card"><p class="number"></p></div>');
    $newCard.data('value', cardValues[j]);
    $newCard.data('flipped', false);
    $newCard.data('color', colors[cardValues[j] - 1]);
    $game.append($newCard);
  }

  $('.card').click(function() {
    MatchGame.flipCard($(this), $('#game'));
  });
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  if ($card.data('flipped')) {
    return;}

  $card.data('flipped', true);
  $card.css('background-color', $card.data('color'));
  $card.children('.number').text($card.data('value'));

  var flippedCards = $game.data('flippedCards');
  flippedCards.push($card);

  if (flippedCards.length === 2) {
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      flippedCards[0].css({backgroundColor: 'rgb(153, 153, 153)', color: 'rgb(204, 204, 204)'});
      flippedCards[1].css({backgroundColor: 'rgb(153, 153, 153)', color: 'rgb(204, 204, 204)'});

      cardsFlipped.push(true, true);
    } else {

      setTimeout(function(){
      // Fisrt card
      flippedCards[0].css('background-color', 'rgb(32, 64, 86)');
      flippedCards[0].children('.number').text('');
      flippedCards[0].data('flipped', false);

      // Second card
      flippedCards[1].css('background-color', 'rgb(32, 64, 86)');
      flippedCards[1].children('.number').text('');
      flippedCards[1].data('flipped', false);
    }, 500);
    }

    $game.data('flippedCards', []);
  }

};
