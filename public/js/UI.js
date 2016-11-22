$(document).ready(function(){
    const $hotelMenu = $('#hotel-choices');
    hotels.forEach(function(hotel){
    	$hotelMenu.append($(`<option id=${hotel.id}>${hotel.name}</option>`));
    });

    const $restMenu = $('#restaurant-choices');
    restaurants.forEach(function(restaurant){
    	$restMenu.append($(`<option id=${restaurant.id}>${restaurant.name}</option>`));
    });

    const $activityMenu = $('#activity-choices');
    activities.forEach(function(activity){
    	$activityMenu.append($(`<option id=${activity.id}>${activity.name}</option>`));
    });
    let counter = 0;
	$('.btn-primary').on('click', function(e){
    	const $button = $(this);
    	const $select = $button.siblings('select');
    	const value = $select.val();
    	const type = $select.data('type');

    	const row = $select.children(`:selected`);
    	const id = row.attr('id');

    	let $divToAdd = $('<div class="itinerary-item"></div>');
    	const $spanToAdd = $(`<span class="title" id=${counter}>${value}</span>`);
    	const $btnToAdd = $('<button class="btn btn-xs btn-danger remove btn-circle">x</button>');
    	$divToAdd = $divToAdd.append($spanToAdd).append($btnToAdd);

    	$(`.${type}s`).append($divToAdd);
    	if (type === 'hotel') drawMarker(type, hotels[id - 1].place.location, counter);
    	else if (type === 'restaurant') drawMarker(type, restaurants[id - 1].place.location, counter);
    	else if (type === 'activity') drawMarker(type, activities[id - 1].place.location, counter);

    	counter++;
    });

    $('ul').on('click', 'button', function(e){
    	const $button = $(this);
    	const $span = $button.siblings('span');
    	const id = $span.attr('id');
    	markers[id].setMap(null);
    	markers[id] = null;
    	$button.parent().remove();
    	//const type = $select.data('type');
    });

    $('#day-add').on('click', function(e){
    	const $button = $(this);
    	const count = $button.siblings().length;
    	const $newBtn = $(`<button class="btn btn-circle day-btn">${count + 1}</button>`);
    	$button.before($newBtn);
    });

 })

//marker.setMap(null)     to remove markers