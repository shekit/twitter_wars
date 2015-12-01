$(document).ready(function(){
	console.log('hello')

	var socket = io();

	var contestantCount = 0;

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
			var contestantOne = $(".contestant-one").attr('data-val');
			var contestantTwo = $(".contestant-two").attr('data-val');
			socket.emit('contestants',{'contestantOne':contestantOne,'contestantTwo': contestantTwo})
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

	$("#socket-fight").on('click', function(event){
		event.preventDefault();
		socket.emit('fight','yes')
	})

	$("#socket-stop-fight").on('click', function(event){
		event.preventDefault();
		socket.emit('stop','yes')
	})
})