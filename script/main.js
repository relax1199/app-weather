function initMap(x , y, title, z) { 
	if (x==undefined && y==undefined) 
		x=48.990947, y=31.348829, title='', z=5;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(x, y),
        zoom: z
    });
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(x, y),
        map: map,
        draggable: true,
        title: title
    });
}
function tempplus(number){
	if(number > 0) return '+' + number;
		else return number;	
}
function openRes(apiinfo, cityname) {
	var old_day = 0;
	if (apiinfo != undefined && cityname != undefined) { 
		$(".weather:not(.template)").remove();
		$("h2").remove();
		$("h3").remove();
		$(".days").empty();

		$('<h2>' + cityname + '</h2>').appendTo('.right');
		for (var info of apiinfo){
			var date = new Date(info.dt_txt);
			var day = zeroAdd(date.getDate());
			var Month = zeroAdd(date.getMonth()+1);
			var Hours = zeroAdd(date.getHours());
			var Minutes = zeroAdd(date.getMinutes());

			var time_item = (Hours + ':' + Minutes);
			var weather_item = info.weather[0].description;
			var temp_item = tempplus(Math.ceil(info.main.temp-273));
			// var humidity_item = info.main.humidity;
			// var pressure_item = Math.ceil(info.main.pressure*0.00750063755419211*100);
			var daymonth = (day+'.'+Month);
			if (old_day != day) {
				$(`<h3 data-day='${day}' style="display: none"><span>${daymonth}</span></h3>`).appendTo('.right');

				var link = $(`<a data-day='${day}'>${daymonth}</a>`);
				link.click(function(){
					var day = $(this).data('day');
					$('.weather, h3').hide();
					$(`h3[data-day=${day}]`).show();
					$(`.weather[data-day=${day}]`).show();
				});
				$('.days').append(link);
			}

			var send = $('.weather.template').clone();
			send.removeClass('template');

			send.find('.time').html(time_item);
			send.find('.weather_it').html(weather_item);
			send.find('.images').html('<img src="../img/' + info.weather["0"].icon + '.png">');
			send.find('.temp').html(temp_item + '&#176;C');
			// send.find('.humidity').html('Влажность: ' + humidity_item + '%');
			// send.find('.pressure').html('Давление: '+ pressure_item + ' мм.рт. ст.');
			send.attr('data-day', day);
			console.log(day+'.'+Month);
			send.appendTo('.right');
			send.hide();

			old_day = day;
		}
		var date = new Date($('#date').val()); 
		var startday = zeroAdd(date.getDate());
		$(`a[data-day=${startday}]`).click();
	}
}	
function zeroAdd(number) {
	if (number < 10) return '0' + number;
	else return number;
}
$(document).ready(function(){
	$('#send').on('click', function(){

		$('.right').empty();
		$('.days').find('a').remove();
		$.ajax({
			url:"http://api.openweathermap.org/data/2.5/forecast",
			type: "GET",
			data: {
				"q" : $('#city').val(),
				"appid" : "4934a8acfe7e7632fc25391a747ebd16"
				}
			}).done(function(res){
				console.log(res);
				openRes(res.list, res.city.name);
				initMap(res.city.coord.lat ,res.city.coord.lon, res.city.name, 8);
			}).fail(function(err){
				
				switch (err.status) {
					case 400:
					$('<h2>'+'вы не ввели данные'+'</h2>').appendTo('.right');
					break;
					case 404:
					$('<h2>'+'такого города нет в базе'+'</h2>').appendTo('.right');
					break;
					case 500:
					$('<h2>'+'сервер не доступен'+'</h2>').appendTo('.right');
					break;
				}
				console.log(err);					
		})
	})
})
