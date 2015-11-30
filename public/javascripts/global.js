$(document).ready(function(){
	console.log('hello')

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
})