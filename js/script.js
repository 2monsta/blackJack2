$(document).ready(function(){
	var playersHand = [];
	var dealersHand = [];
	const freshDeck = createDeck();
	var theDeck;
	var betAmount = 0;
	var letsBet = false;

	$(".hidden-image").hide();


	function createDeck(){
		var newDeck = [];
		const suits = ["h", "s", "d", "c"];
		for(let s = 0; s<suits.length; s++){
			for(let c = 1; c<=13; c++){
				newDeck.push(c + suits[s]);
			}
		}
		return newDeck;
	}
	function shuffleDeck(deck){
		for(let i = 0; i<50000; i++){
			var rand1 = Math.floor(Math.random()* deck.length);
			var rand2 = Math.floor(Math.random()* deck.length);
			var temp = deck[rand1];
			deck[rand1] = deck[rand2];
			deck[rand2] = temp;
		}
		return deck;
	}
	function placeCard(who, where, whatToPlace){
		var classSelector = `.${who}-cards .card-${where}`;
		var image = `<div class="image-load"><img src='images/cards/${whatToPlace}.png'/></div>`
		// $(classSelector).delay(600).queue(function(){
		// 	$(this).html(image);
		// })
		$(classSelector).html(image);
	}

	function placeCardImage(who, where, whatToPlace){
		var classSelector = `.${who}-cards .card-${where}`;
		var image = `<div class="image-load"><img id="image" src='images/cards/${whatToPlace}.png'/></div>`
		// $(classSelector).delay(600).queue(function(){
		// 	$(this).html(image);
		// })
		$(classSelector).html(image);
	}
	$(".deal-button").click((()=>{
		theDeck = freshDeck.slice();
		theDeck = shuffleDeck(theDeck);
		playersHand = [];
		dealersHand = [];
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		topCard = theDeck.shift();
		dealersHand.push(topCard);
		topCard = theDeck.shift();
		playersHand.push(topCard);
		topCard = theDeck.shift();
		dealersHand.push(topCard);

		placeCard("player", 1, playersHand[0]);
		placeCard("player", 2, playersHand[1]);
		placeCard("dealer", 1, dealersHand[0]);

		// placeCardImage("dealer", 1, "deck");

	}))
});