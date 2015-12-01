$(document).ready(function(){
	console.log('hello')

	var socket = io();

	var contestantCount = 0;

	var contestantOne = null;
	var contestantTwo = null;

	var contestantOneScore = 0;
	var contestantTwoScore = 0;

	var contestantOneSelected = false;
	var contestantTwoSelected = false;

	var prediction = null;

	var scoreOne = $("#scoreOne");
	var scoreTwo = $("#scoreTwo");

	resetScores();

	$(".contestant").on('click', function(event){
		event.preventDefault();
		var self = $(this);
		resetScores();

		if(self.hasClass('contestant-one')){
			//contestantCount--;
			console.log("Removing contestant one");
			contestantOneSelected = false;
			self.removeClass('contestant-one')
			console.log("REshow contestants");
			return
		} else if(self.hasClass('contestant-two')){
			//contestantCount--;
			console.log("Removing contestant two");
			contestantTwoSelected = false;
			self.removeClass('contestant-two')
			console.log("REshow contestants");
			return
		}


		if(contestantOneSelected == false && contestantTwoSelected == false){
			contestantOneSelected = true;
			self.addClass('contestant-one');
			console.log('Selected contestant one')
			return
		} else if(contestantOneSelected == true && contestantTwoSelected == false){
			contestantTwoSelected = true;
			self.addClass('contestant-two');
			console.log('Selected contestant two')
			console.log("Hide the other things or blur them out");
			return
		} else if(contestantOneSelected == false && contestantTwoSelected == true){
			contestantOneSelected = true;
			self.addClass('contestant-one');
			console.log('Re selected contestant one')
			return
		} else {
			console.log("2 contestants selected")
			return
		}

	})
		// if(contestantCount < 2){	
		// 	contestantCount++;
		// 	console.log('Contestant Count: ', contestantCount);
		// 	var self = $(this);
		// 	var value = self.attr('data-val')

		// 	if(contestantCount==1 && contestantOneSelected==false){
		// 		// do this if its the first time selecting contestant one
		// 		contestantOneSelected = true;
		// 		self.addClass('contestant-one')
		// 	} else if(contestantCount == 2 && contestantTwoSelected == false){
		// 		// do this if its the first time selecting contestant two
		// 		contestantTwoSelected = true;
		// 		self.addClass('contestant-two')
		// 	} else if(contestantCount==1 && contestantOneSelected==true){
		// 		// do this if it contestant two is unselected and a new one is selected 
		// 		contestantTwoSelected = true;
		// 		self.addClass('contestant-two')
		// 	} else if(contestantCount == 1 && contestantTwoSelected == true){
		// 		// do this if it contestant one is unselected and a new one is selected
		// 		contestantOneSelected = true;
		// 		self.addClass('contestant-one')
		// 	}
		// 	console.log(value)
			
		// } else {
		// 	console.log('TWO CONTESTANTS SELECTED')
		// }


	

	// $("body").on('click','.fighter', function(event){
	// 	event.preventDefault();

	// 	var self = $(this)
	// 	var contestantName = self.attr('data-val')

	// 	if(self.hasClass('contestant-one')){
	// 		contestantCount--;
	// 		contestantOneSelected = false;
	// 		self.removeClass('.contestant-one')
	// 	}
	// 	var contestant1 = $(this).attr('data-val');
	// 	contestantCount--;
	// 	contestantOneSelected = false;
	// 	$(this).removeClass('.contestant-one');
	// 	console.log("removed: "+contestant1)
	// 	console.log("Contestant count: "+contestantCount)
	// })

	// $("body").on('click','.contestant-two', function(event){
	// 	event.preventDefault();
	// 	var contestant2 = $(this).attr('data-val');
	// 	contestantCount--;
	// 	contestantTwoSelected = false;
	// 	$(this).removeClass('.contestant-two');
	// 	console.log("removed: "+contestant2)
	// 	console.log("Contestant count: "+contestantCount)
	// })

	$("#fight").on('click', function(event){
		event.preventDefault();
		if(contestantOneSelected && contestantTwoSelected){
			contestantOne = $(".contestant-one").attr('data-val');
			contestantTwo = $(".contestant-two").attr('data-val');
			socket.emit('contestants',{'contestantOne':contestantOne,'contestantTwo': contestantTwo})
			updatePredictionValues();
		} else {
			alert('select contestants')
		}
		//only make request if two contestants are selected
		/*if(contestantCount == 2) {
			var contestantOne = $(".contestant-one").attr('data-val');
			var contestantTwo = $(".contestant-two").attr('data-val');

			$.ajax({
				"url": 'http://localhost:3000/fight',
				"method": 'POST',
				"data": {
					'contestantOne':contestantOne,
					'contestantTwo': contestantTwo
				}
			})
			.done(function(resp){
				console.log(resp)
			})
			.error(function(resp){
				console.log("Error: "+resp)
			})
		} else {
			alert('select two contestants')
		}*/
	})

	$("body").on('click','.bet', function(event){
		event.preventDefault();
		prediction = $(this).attr('data-val')
		console.log(prediction)
	})

	$("#socket-fight").on('click', function(event){
		event.preventDefault();
		socket.emit('fight','yes')
	})

	$("#socket-stop-fight").on('click', function(event){
		event.preventDefault();
		socket.emit('stop','yes');
		checkWinner();
	})

	socket.on('one', function(msg){
		contestantOneScore++;
		scoreOne.html(contestantOneScore);
	})

	socket.on('two', function(msg){
		contestantTwoScore++;
		scoreTwo.html(contestantTwoScore);
	})

	function updatePredictionValues(){
		console.log("update")
		$(".bet-one").html(contestantOne);
		$(".bet-two").html(contestantTwo);
	}

	function resetScores(){
		console.log('resetScore')
		contestantOneScore = 0;
		contestantTwoScore = 0;
		scoreOne.html(contestantOneScore);
		scoreTwo.html(contestantTwoScore);
		prediction = null;
	}

	function checkWinner(){
		if(contestantOneScore > contestantTwoScore && prediction == 'contestantOne'){
			alert('you win contestant one won');
		} else if(contestantOneScore < contestantTwoScore && prediction == 'contestantOne') {
			alert('you lose contestant one lost')
		} else if(contestantTwoScore > contestantOneScore && prediction == 'contestantTwo') {
			alert('you win, contestant two won')
		} else if(contestantTwoScore < contestantOneScore && prediction == 'contestantTwo') {
			alert('you lose contestant two lost')
		} else {
			alert('its a tie!')
		}

		console.log('CONTESTANT ONE SCORE: '+contestantOneScore);
		console.log('CONTESTANT TWO SCORE: '+contestantTwoScore)
	}
})