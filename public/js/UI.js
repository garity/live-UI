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

    //add item
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

        var bounds = new google.maps.LatLngBounds();
        markers.forEach(function(marker){
            bounds.extend(marker.position);
        });
        currentMap.fitBounds(bounds);

    	counter++;
    });

    //remove item
    $('ul').on('click', 'button', function(e){
    	const $button = $(this);
    	const $span = $button.siblings('span');
    	const id = $span.attr('id');
    	markers[id].setMap(null);
    	markers[id] = null;
    	$button.parent().remove();
    });
    let itineraryData = [];
    itineraryData[1] = {};

    //add day
    $('#day-add').on('click', function(e){
    	const $button = $(this);
    	const count = $button.siblings().length;
    	const $newBtn = $(`<button class="btn btn-circle day-btn day-num">${count + 1}</button>`);
    	$button.before($newBtn);

        const dayData = {};
        itineraryData[count + 1] = dayData;
    });


    //switch day
    $('.day-buttons').on('click', '.day-num', function(e){
        const $button = $(this);
        const $prevButton = $('.current-day');
        const count = $prevButton.text();
        const currNum = $button.text();

        $('#day-title').children('span').text(`Day ${currNum}`);
        $('#day-title').children('span').attr('id', currNum);

        const $hotels = $('.hotels').children();
        const $restaurants = $('.restaurants').children();
        const $activitys = $('.activitys').children();

        itineraryData[count].hotels = $hotels;
        itineraryData[count].restaurants = $restaurants;
        itineraryData[count].activitys = $activitys;
        itineraryData[count].markers = markers.slice();
        //console.log($hotels);

        $hotels.remove();
        $restaurants.remove();
        $activitys.remove();
        markers.forEach(function(marker){marker.setMap(null);});
        //markers = [];

        $prevButton.removeClass('current-day');
        $button.addClass('current-day');

        if (itineraryData[currNum].hotels) $('.hotels').append(itineraryData[currNum].hotels);
        if (itineraryData[currNum].restaurants) $('.restaurants').append(itineraryData[currNum].restaurants);
        if (itineraryData[currNum].activitys) $('.activitys').append(itineraryData[currNum].activitys);
        markers = itineraryData[currNum].markers || [];
        if (markers.length === 0) {
            currentMap.setCenter(new google.maps.LatLng(40.705086, -74.009151));
            currentMap.setZoom(13);
        }
        else {
            markers.forEach(function(marker){marker.setMap(currentMap);});
            var bounds = new google.maps.LatLngBounds();
            markers.forEach(function(marker){
                bounds.extend(marker.position);
            });
            currentMap.fitBounds(bounds);
        }
    });

    //remove day
    $('#day-title').on('click', 'button', function(e){
        const $button = $(this);
        const $span = $button.siblings('span');
        const id = $span.attr('id');
        const siblingCount = $('#day-add').siblings().length;
        const $currDay = $('.current-day');

        $('.hotels').children().remove();
        $('.restaurants').children().remove();
        $('.activitys').children().remove();
        markers.forEach(function(marker){marker.setMap(null);});

        if (siblingCount === 1) {
            itineraryData[1] = {};
        }
        else {
            itineraryData.splice(id, 1);

            const $prevButton = $currDay.prev();
            if ($currDay.text() !== '1') {
                $currDay.removeClass('current-day');
                $prevButton.addClass('current-day');
            }
            $('#day-add').prev().remove();
            $('#day-title').children('span').text(`Day ${$prevButton.text() || 1}`);
            $('#day-title').children('span').attr('id', $prevButton.text() || 1);
            if (itineraryData[id - 1].hotels) $('.hotels').append(itineraryData[id - 1].hotels);
            if (itineraryData[id - 1].restaurants) $('.restaurants').append(itineraryData[id - 1].restaurants);
            if (itineraryData[id - 1].activitys) $('.activitys').append(itineraryData[id - 1].activitys);
            markers = itineraryData[id - 1].markers || [];
            if (markers.length === 0) {
                currentMap.setCenter(new google.maps.LatLng(40.705086, -74.009151));
                currentMap.setZoom(13);
            }
            else {
                markers.forEach(function(marker){marker.setMap(currentMap);});
                var bounds = new google.maps.LatLngBounds();
                markers.forEach(function(marker){
                    bounds.extend(marker.position);
                });
                currentMap.fitBounds(bounds);
            }
        }
    });

 })
