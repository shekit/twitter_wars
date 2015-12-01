$(document).ready(function(){
	console.log('hello')

	var socket = io();

	var contestantCount = 0;

	var contestantOne = null;
	var contestantTwo = null;

	var contestantOneScore = 0;
	var contestantTwoScore = 0;

	var prediction = null;

	$(".contestant").on('click', function(event){
		event.preventDefault();

		if(contestantCount < 2){	
			contestantCount++;
			console.log('Contestant Count: ', contestantCount);

			var value = $(this).attr('data-val')

			if(contestantCount==1){
				$(this).addClass('contestant-one')
			} else if(contestantCount == 2){
				$(this).addClass('contestant-two')
			}
			console.log(value)
		} else {
			console.log('TWO CONTESTANTS SELECTED')
		}
	})


	$("#fight").on('click', function(event){
		event.preventDefault();
		if(contestantCount == 2){
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
	})

	socket.on('two', function(msg){
		contestantTwoScore++;

	})

	function updatePredictionValues(){
		console.log("update")
		$(".bet-one").html(contestantOne);
		$(".bet-two").html(contestantTwo);
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