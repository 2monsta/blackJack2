$(document).ready(function(){
	var playersHand = [];
	var dealersHand = [];
	const freshDeck = createDeck();
	var theDeck;
	var betAmount = 0;
	var letsBet = false;


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
		var image = `<div><img src='images/cards/${whatToPlace}.png'/></div>`
		// $(classSelector).delay(600).queue(function(){
		// 	$(this).html(image);
		// })
		$(classSelector).html(image);
	}

	function calculateTotal(hand, who){
		var handTotal = 0;
		var thisCardsValue = 0;
		for(let i = 0; i<hand.length; i++){
			thisCardsValue = Number(hand[i].slice(0,-1));
			if(thisCardsValue == 1){
				if(handTotal > 10){
					thisCardsValue = 1;
				}else{
					thisCardsValue = 11;
				}
			}else if(thisCardsValue>10){
				thisCardsValue = 10;
			}
			handTotal +=thisCardsValue;
		}
		var classSelector = `.${who}-number`;
		$(classSelector).html(handTotal);
		return handTotal;
	}
	function checkWin(){
		var playersTotal = calculateTotal(playersHand, "player");
		var dealersTotal = calculateTotal(dealersHand, "dealer");
		var betValue = Number($(".bet-pot").html()) * 2;
		var playersTotalAgain = Number($(".player-amount").html()) + betValue; 
		if(playersTotal > 21){
			console.log("you lose");
			$(".black-jack-rule").html("You Lose!");
			$(".bet-pot").html("0");
		}else if(playersTotal == 21 && playersHand.length == 2){
			console.log("blackjack");
			$(".black-jack-rule").html("BlackJack");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else if(dealersTotal > 21){
			console.log("dealer loses");
			$(".black-jack-rule").html("You Win!");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else if(playersTotal < dealersTotal){
			console.log("you lose to dealer");
			$(".black-jack-rule").html("You Lose!");
			$(".bet-pot").html("0");
		}else if (playersTotal > dealersTotal){
			console.log("you win");
			$(".black-jack-rule").html("You Win!");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else{
			console.log("TIE");
			$(".black-jack-rule").html("Tie, try again!");
		}
	}
	function bet(){
		var betValue = Number($(".bet-amount").val());
		var currentValue = Number($(".player-amount").html());
		if(!letsBet){
			// continue;
		}else{
			if(betValue == 0){
				$(".black-jack-rule").html("You must enter an amount to bet");
			}else{
				betAmount += betValue;
				myValue = currentValue - betValue;
				$(".bet-pot").html(betAmount);
				$(".bet-amount").val("");
				$(".player-amount").html(myValue);
			}
		}
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
		// topCard = theDeck.shift();
		// dealersHand.push(topCard);
		placeCard("player", 1, playersHand[0]);
		placeCard("player", 2, playersHand[1]);
		placeCard("dealer", 1, dealersHand[0]);
		// placeCard("dealer", 2, dealersHand[1]);
		placeCard("dealer", 2, "deck");
		calculateTotal(playersHand, "player")
		calculateTotal(dealersHand, "dealer");
		topCard = theDeck.shift();
		dealersHand.push(topCard);
		letsBet = true;
	}));
	
	
	$(".hit-button").click(()=>{
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		placeCard("player", playersHand.length, topCard)
		calculateTotal(playersHand, "player");
		// console.log(topCard);
	});


	$(".stand-button").click(()=>{
		// $("dealer-cards card-2").hide();
		placeCard("dealer", 2, dealersHand[1]);
		calculateTotal(dealersHand, "dealer");
		var dealerTotal = calculateTotal(dealersHand, "dealer");
		while(dealerTotal<17){
			var topCard = theDeck.shift();
			dealersHand.push(topCard);
			placeCard("dealer", dealersHand.length, topCard);
			dealerTotal = calculateTotal(dealersHand, "dealer");
		}
		checkWin();
		letsBet = false;
	});

	$(".bet-button").click(()=>{
		bet();
	})
});