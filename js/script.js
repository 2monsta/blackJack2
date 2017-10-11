
//TODO: work on stand button
//TODO: work on flip option
//TODO: work on double down function



$(document).ready(function(){
	var playersHand = [];
	var dealersHand = [];
	const freshDeck = createDeck();
	var theDeck;
	var letsBet = false;
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
				if(betValue > currentValue){
					$(".black-jack-rule").html("You Can't Enter More Than You Have!!");
				}else{
					betAmount += betValue;
					var myValue = currentValue - betValue;
					$(".bet-pot").html(betAmount);
					$(".bet-amount").val("");
					$(".player-amount").html(myValue);
				}
			}
		}

	}
	$(".modal-form").submit(()=>{
		$('#myModal').modal('hide');
		var valueName = $(".player-name").val();
		$(".name").html(valueName);
	});
	$(".rule-book").click(()=>{
		$('#myModal').modal('show');
	})
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



		// placeCard("player", 1, "deck");
		// placeCard("player", 2, "deck");
		// placeCard("dealer", 2, "deck");
		// $(".player-cards .card").fadeOut(1000, function(){
		// 	placeCard("player", 1, playersHand[0]);
		// 	placeCard("player", 2, playersHand[1]);
		// 	placeCard("dealer", 1, dealersHand[0]);
		// });
		// $(".player-cards .card").fadeIn(2000, function(){
		// 	placeCard("player", 1, playersHand[0]);
		// 	placeCard("player", 2, playersHand[1]);
		// 	placeCard("dealer", 1, dealersHand[0]);
		reset = true;
		// });
		// placeCard("dealer", 1, dealersHand[0]);

		
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
		letsBet = true;
		$(".hit-button").prop("disabled", false);
		$(".row-two-buttons").show(100);
		$(".reset-button-wrapper").show(100);

	}));
	
	
	$(".hit-button").click(()=>{
		// var topCard = theDeck.shift();
		// playersHand.push(topCard);
		// placeCard("player", playersHand.length, "deck");
		if(card ==3){
			var topCard = theDeck.shift();
			playersHand.push(topCard);
			placeCard("player", playersHand.length, "deck");
			$(".player-cards .card-3").fadeOut(1000, function(){
				placeCard("player", playersHand.length, topCard);
			}).fadeIn(1000);
			card++;
		}else if(card ==4){
			var topCard = theDeck.shift();
			playersHand.push(topCard);
			placeCard("player", playersHand.length, "deck");
			$(".player-cards .card-4").fadeOut(1000, function(){
				placeCard("player", playersHand.length, topCard);
			}).fadeIn(1000);
		}
		calculateTotal(playersHand, "player");
		// console.log(topCard);
	});


	$(".stand-button").click(()=>{
		placeCard("dealer", 2, dealersHand[1]);
		var dealerTotal = calculateTotal(dealersHand, "dealer");
		while(dealerTotal<17){
			var topCard = theDeck.shift();
			dealersHand.push(topCard);
			placeCard("dealer", dealersHand.length, topCard);
			// dealerTotal = calculateTotal(dealersHand, "dealer");
		// if(dealerTotal<17){

		
			// var topCard = theDeck.shift();
			// dealersHand.push(topCard);
			// console.log(dealersHand);
		
			// $(".dealer-cards .card-2").fadeOut(1000,function(){
			// 	placeCard("dealer", dealersHand.length -1, dealersHand[1]);
			// 	console.log(dealersHand.length);
			// }).fadeIn(1000, function(){
			// 	$(".dealer-cards .card-3").fadeOut(500,function(){
			// 		placeCard("dealer", dealersHand.length, topCard);
			// 	}).fadeIn(1000);
			// });
			// setTimeout(function() {
			// 	dealerTotal = calculateTotal(dealersHand, "dealer");
			// }, 1000);
			dealerTotal = calculateTotal(dealersHand, "dealer");
		// }
		}
		checkWin();
		letsBet = false;
		$(".hit-button").prop("disabled", true);
		$(".row-two-buttons").hide(100);
		// $(".reset-button-wrapper").show("slow");
	
	});


	$(".bet-button").click(()=>{
		bet();
	})

	$(".double-down-button").click(()=>{
		var currentPot = $(".bet-pot").html();
		var doubleAmount = Number(currentPot) * 2;
		var playerAmount = $(".player-amount").html();
		// $(".bet-pot").html(doubleAmount);
		// console.log(playerAmount);
		// var doubleDownMoney = playerAmount - doubleAmount;
		// $(".player-amount").html(doubleDownMoney);
		if(doubleAmount > playerAmount){
			$(".black-jack-rule").html("You Cannot Double Down More");
		}else{
			$(".bet-pot").html(doubleAmount);
			// console.log(playerAmount);
			var doubleDownMoney = playerAmount - currentPot;
			$(".player-amount").html(doubleDownMoney);
		}
	});

	$(".surrender-button").click(()=>{
		playersHand =[];
		dealersHand = [];
		var currentPot = $(".bet-pot").html();
		var halfAmount = Number(currentPot) /2;
		var playerAmount = Number($(".player-amount").html());
		var halfOfMoney = playerAmount + halfAmount;
		$(".player-amount").html(halfOfMoney);
		if(reset){
			$(".black-jack-rule").html("Dealer Must Hit Under 17");
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
		if(reset){
			$(".black-jack-rule").html("Dealer Must Hit Under 17");
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
	});

});