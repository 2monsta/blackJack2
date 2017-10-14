
//TODO: split option to count the hands and add div to make sure the hands are accounted for.




$(document).ready(function(){
	var playersHand = [];
	var playersHandSplitOne = [];
	var playersHandSplitTwo = [];
	var dealersHand = [];
	const freshDeck = createDeck();
	var theDeck;
	var reset = false;
	var betAmount = 0;
	var card = 3;
	$(".row-two-buttons").hide();
	$(".reset-button-wrapper").hide();
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});
	$('#myModal').modal('show');
	$('.collapse').collapse("hide");
	$(".onbutton").prop("disabled", true);

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
			$(".black-jack-message").html("You Lose!");
			$(".bet-pot").html("0");
		}else if(playersTotal == 21 && playersHand.length == 2){
			console.log("blackjack");
			$(".black-jack-message").html("BlackJack");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else if(dealersTotal > 21){
			console.log("dealer loses");
			$(".black-jack-message").html("You Win!");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else if(playersTotal < dealersTotal){
			console.log("you lose to dealer");
			$(".black-jack-message").html("You Lose!");
			$(".bet-pot").html("0");
		}else if (playersTotal > dealersTotal){
			console.log("you win");
			$(".black-jack-message").html("You Win!");
			$(".player-amount").html(playersTotalAgain);
			$(".bet-pot").html("0");
		}else{
			console.log("TIE");
			$(".black-jack-message").html("Tie, try again!");
		}
	}
	function deal(){
		theDeck = freshDeck.slice();
		theDeck = shuffleDeck(theDeck);
		playersHand = [];
		dealersHand = [];
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		playersHandSplitOne.push(topCard);
		topCard = theDeck.shift();
		dealersHand.push(topCard);
		topCard = theDeck.shift();
		playersHand.push(topCard);
		playersHandSplitTwo.push(topCard);
		reset = true;
		$(".player-cards .card-1").addClass("dealt1");
		placeCard("player", 1, playersHand[0]);
		setTimeout(function() {
			$(".dealer-cards .card-1").addClass("dealerDealt1");
			placeCard("dealer", 1, dealersHand[0]);
		}, 800);
		setTimeout(function(){
			$(".player-cards .card-2").addClass("dealt2");
			placeCard("player",2 ,playersHand[1]);
		}, 1600);
		setTimeout(function() {
			$(".dealer-cards .card-2").addClass("dealerDealt2");
			placeCard("dealer", 2, "deck");
			setTimeout(function() {
				$(".dealer-cards .card-2").removeClass("dealerDealt2");
			}, 2400);
		}, 2400);

		calculateTotal(playersHand, "player")
		calculateTotal(dealersHand, "dealer");
		topCard = theDeck.shift();
		dealersHand.push(topCard);
	}
	function bet(){
		var betValue = Number($(".bet-amount").val());
		var currentValue = Number($(".player-amount").html());

		if(betValue == 0){
			$(".black-jack-message").html("You must enter an amount to bet");
		}else{
			if(betValue > currentValue){
				$(".black-jack-message").html("You Can't Enter More Than You Have!!");
			}else{
				betAmount += betValue;
				var myValue = currentValue - betValue;
				$(".bet-pot").html(betAmount);
				$(".bet-amount").val("");
				$(".player-amount").html(myValue);
			}
		}
	}
	function stand(){
		placeCard("dealer", 2, dealersHand[1]);
		var dealerTotal = calculateTotal(dealersHand, "dealer");
		while(dealerTotal<17){
			var topCard = theDeck.shift();
			dealersHand.push(topCard);
			placeCard("dealer", dealersHand.length, topCard);

			dealerTotal = calculateTotal(dealersHand, "dealer");
		}
	}
	function hit(card){
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		placeCard("player", card, "deck");
		$(`.player-cards .card-${card}`).fadeOut(1000, function(){
			placeCard("player", card, topCard);
		}).fadeIn(1000);
	}
	function hitSplitHandOne(card){
		var topCard = theDeck.shift();
		playersHandSplitOne.push(topCard);
		placeCard("player", card, "deck");
		$(`.player-cards .card-${card}`).fadeOut(1000, function(){
			placeCard("player", card, topCard);
		}).fadeIn(1000);
	}
	function hitSplitHandTwo(card){
		var topCard = theDeck.shift();
		playersHandSplitTwo.push(topCard);
		placeCard("player", card, "deck");
		$(`.player-cards .card-${card}`).fadeOut(1000, function(){
			placeCard("player", card, topCard);
		}).fadeIn(1000);
	}

	function doubleDown(){
		var currentPot = $(".bet-pot").html();
		var doubleAmount = Number(currentPot) * 2;
		var playerAmount = $(".player-amount").html();
		stand();

		if(doubleAmount > playerAmount){
			$(".black-jack-message").html("You Cannot Double Down More");
		}else{
			$(".bet-pot").html(doubleAmount);
			// console.log(playerAmount);
			var doubleDownMoney = playerAmount - currentPot;
			$(".player-amount").html(doubleDownMoney);
		}
		var topCard = theDeck.shift();
		playersHand.push(topCard);
		placeCard("player", 3, topCard);
		checkWin();
	}



	$(".modal-form").submit(()=>{
		$('#myModal').modal('hide');
		var valueName = $(".player-name").val();
		$(".name").html(valueName);
	});

	$(".submit-button").click(()=>{
		$('#myModal').modal('hide');
		var valueName = $(".player-name").val();
		$(".name").html(valueName);
	});
	$(".rule-book").click(()=>{
		$('#myModal').modal('show');
	})
	$(".deal-button").click((()=>{
		deal();
		$(".hit-button").prop("disabled", false);
		$(".row-two-buttons").show(100);
		$(".reset-button-wrapper").show(100);


	
		$(".split-button").prop("disabled", false);
		$(".deal-button").prop("disabled", false);
		$(".double-down-button").prop("disabled", false);
		$(".surrender-button").prop("disabled", false);

	}));
	$(".hit-button").click(()=>{
		if(card ==3){
			hit(card);
			card++;
		}else if(card ==4){
			hit(card);
		}
		calculateTotal(playersHand, "player");

	});


	$(".stand-button").click(()=>{
		$(".onbutton").prop("disabled", true);
		stand();
		checkWin();
		letsBet = false;
		$(".hit-button").prop("disabled", true);
		$(".row-two-buttons").hide(100);
		// $(".reset-button-wrapper").show("slow");
	
	});


	$(".bet-button").click(()=>{
		bet();
		$(".onbutton").prop("disabled", false);
	})

	$(".double-down-button").click(()=>{
		doubleDown();
		$(".row-two-buttons").hide(100);
	});


	$(".split-button").click(()=>{
		// $(".player-cards .card-2").addClass("player-move-card");
		var card2 = $(".player-cards .card-2").html();
		$(".player-cards .card-3").html(card2);
		$(".player-cards .card-2").html("-");
		hitSplitHandOne(2);
		hitSplitHandTwo(4);
		calculateTotal(playersHandSplitOne, "player");



		$(".black-jack-rule").html("Hand One");




		$(".split-button").prop("disabled", true);
		$(".deal-button").prop("disabled", true);
		$(".double-down-button").prop("disabled", true);
		$(".surrender-button").prop("disabled", true);

	})

	$(".surrender-button").click(()=>{
		playersHand =[];
		dealersHand = [];
		playersHandSplitOne = [];
		playersHandSplitTwo = [];
		var currentPot = $(".bet-pot").html();
		var halfAmount = Number(currentPot) /2;
		var playerAmount = Number($(".player-amount").html());
		var halfOfMoney = playerAmount + halfAmount;
		$(".player-amount").html(halfOfMoney);
		if(reset){
			$(".black-jack-message").html("Dealer Must Hit Under 17");
			$(".card").html("-");
			$(".row-two-buttons").hide(100);
			$(".reset-button-wrapper").hide(100);
		}
		card = 3;
		$(".player-number").html("0");
		$(".dealer-number").html("0");
		$(".bet-pot").html("0");
		betAmount =0;
	});

	
	$(".reset-button").click(()=>{
		playersHand =[];
		dealersHand = [];
		playersHandSplitOne = [];
		playersHandSplitTwo = [];
		if(reset){
			$(".black-jack-message").html("Dealer Must Hit Under 17");
			$(".card").html("-");
			$(".row-two-buttons").hide(100);
			$(".reset-button-wrapper").hide(100);
			$(".player-cards .card-1").removeClass("dealt1");
			$(".player-cards .card-2").removeClass("dealt2");
			$(".dealer-cards .card-1").removeClass("dealerDealt1");
			$(".dealer-cards .card-2").removeClass("dealerDealt2");
		}
		card = 3;
		$(".player-number").html("0");
		$(".dealer-number").html("0");
		betAmount = 0;
		$(".onbutton").prop("disabled", false);
	});

});