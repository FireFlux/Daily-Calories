// JavaScript Document

/*--- page #index ---*/

$( '#index' ).live( 'pageinit',function(event){
	//fatsecret.searchFood();
	data.init();
	//graph.init();
});


$( '#index' ).live( 'pagebeforeshow',function(event){
	$('#index_user_name').text(profile.name);
	graph.draw(data.actualDate);
});

/*--- page #settings ---*/

$( '#settings' ).live( 'pagebeforeshow',function(event){
	if(data.initialised == false) {
		data.init();
	}
	
	$('#user_name_form_settings').val(profile.name);
	
	var radios = $('input[name=gender_radio_settings]');
	if(profile.gender == "female") {
		radios.filter('[value="female"]').attr('checked', true).checkboxradio("refresh");
		radios.filter('[value="male"]').attr('checked', false).checkboxradio("refresh");
	}else {
		radios.filter('[value="male"]').attr('checked', true).checkboxradio("refresh");
		radios.filter('[value="female"]').attr('checked', false).checkboxradio("refresh");
	}
	
	$('#calorie_cap_form_settings').val(profile.calorieCap);
});

/*--- page #add_food ---*/

$( '#add_food' ).live( 'pagebeforeshow',function(event){
	if(data.initialised == false) {
		data.init();
	}
});

/*--- page #add_food_manual ---*/

$( '#add_food_manual' ).live( 'pagebeforeshow',function(event){
	if(data.initialised == false) {
		data.init();
	}
});

/*--- page #view_food ---*/

$( '#view_food' ).live( 'pagebeforeshow',function(event){
	if(data.initialised == false) {
		data.init();
	}
	
	$('#portion_slider').val(0).slider("refresh");
	$('#calculated_calories').text(0 + ' kcal');
});

/*--- page #list_food ---*/
$( '#list_food' ).live( 'pagebeforeshow',function(event){
	if(data.initialised == false) {
		data.init();
	}
	presentation.dayFoodList(data.actualDate);
});

/*--- Graph ---*/

var graph = {
	chart : "",
	stat_chart : "",
	stat_chart_detail : "",
	arrayCalories : [],
	arrayCaloriesStat : [],
	arrayCap : [],
	arrayCapStat : [],
	arrayTime : [],
	arrayTimeStat : [],
	
	init : function() {
	 	graph.chart = new Highcharts.Chart({
			chart: {
				renderTo: 'index_graph',
				type: 'scatter',
				margin: [70, 50, 60, 80],
			},
			title: {
				text: 'Daily Statistic'
			},
			subtitle: {
				text: 'Statistic of the Calories today.'
			},
			credits: {
				enabled: false
			},
			xAxis: {
				categories: graph.arrayTime
			},
			yAxis: {
				title: {
					text: 'Calories'
				},
				tickInterval: 200,
				minPadding: 0.2,
				maxPadding: 0.2,
				maxZoom: 60,
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			legend: {
				enabled: true
			},
			exporting: {
				enabled: false
			},
			plotOptions: {
				series: {
					lineWidth: 1,
					}
			},
        	tooltip: {
            	formatter: function() {
                	return 'The value after your <b>'+ (this.x+1) +
                    	'. Meal</b> was <b>'+ this.y +'</b>';
            	}
        	},
			series: [{
				data: graph.arrayCalories,
				name: 'Calories today'
			}, {
				data: graph.arrayCap,
				name: 'Calorie Cap'
			}]
			
		});
		
			graph.stat_chart = new Highcharts.Chart({
			chart: {
				renderTo: 'stat_graph',
				type: 'scatter',
				margin: [70, 50, 60, 80],
			},
			title: {
				text: 'Daily Statistic'
			},
			subtitle: {
				text: 'Statistic of the Calories today.'
			},
			credits: {
				enabled: false
			},
			xAxis: {
				categories: graph.arrayTimeStat
			},
			yAxis: {
				title: {
					text: 'Calories'
				},
				tickInterval: 200,
				minPadding: 0.2,
				maxPadding: 0.2,
				maxZoom: 60,
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			legend: {
				enabled: true
			},
			exporting: {
				enabled: false
			},
			plotOptions: {
				series: {
					lineWidth: 1,
					}
			},
        	tooltip: {
            	formatter: function() {
                	return 'The value after your <b>'+ (this.x+1) +
                    	'. Meal</b> was <b>'+ this.y +'</b>';
            	}
        	},
			series: [{
				data: graph.arrayCaloriesStat,
				name: 'Calories today'
			}, {
				data: graph.arrayCapStat,
				name: 'Calorie Cap'
			}]
		});
	},
	
	draw : function(date) {
		var count = 0;
		var list = db.query("data", {date: date});
		var time = new Date();
		graph.arrayCalories = [];
		graph.arrayCap = [];
		$.each(list, function() {
			count = count + parseInt(this.calories);
			//alert(count);
			graph.arrayCalories.push(count);
			graph.arrayCap.push(parseInt(this.calorie_cap));
			time.setTime(this.timestamp);
			graph.arrayTime.push(time.toLocaleString());
			
		});
		var count_output = $("#count");
		count_output.text(count);
		if(count>=profile.calorieCap) {
			count_output.css("color","#C00");
		}else {
			count_output.css("color","#0C0");
		}
		graph.chart.series[0].setData(graph.arrayCalories);
		graph.chart.series[1].setData(graph.arrayCap);
		graph.chart.xAxis[0].categories = graph.arrayTime;
		graph.chart.redraw();
	},
	
		draw_stat : function(date) {
		var count = 0;
		var theDate = date;
		var time = new Date();
		var list = db.query("data", {date: theDate});
		graph.arrayCaloriesStat = [];
		graph.arrayCapStat = [];
		$.each(list, function() {
			count = count + parseInt(this.calories);
			//alert(count);
			graph.arrayCaloriesStat.push(count);
			graph.arrayCapStat.push(parseInt(this.calorie_cap));
			time.setTime(this.timestamp);
			graph.arrayTimeStat.push(time.toLocaleString());
		});
		var count_output = $("#count");
		count_output.text(count);
		if(count>=profile.calorieCap) {
			count_output.css("color","#C00");
		}else {
			count_output.css("color","#0C0");
		}
		graph.stat_chart.series[0].setData(graph.arrayCaloriesStat);
		graph.stat_chart.series[1].setData(graph.arrayCapStat);
		graph.stat_chart.xAxis[0].categories = graph.arrayTimeStat;
		graph.stat_chart.redraw();
	},
}

/*--- API ---*/

var fatsecret = {
	foodid : "",
	query : "",
	searchFood : function(q) {
		var output = $('#search_result_list');
		output.html('<img class="ajax_loader" src="images/ajax-loader-kit.gif"/>');
		
		fatsecret.query = q;
		var queryUrl = apiUrls.searchFood + encodeURI(q) + ".json";
		//jQuery Ajax Request
		$.ajax({
			//Methode GET
			type: "GET",
			//API-URL Search
  			url: queryUrl,
			//Antwort in jsonp
			dataType: "jsonp",
			//Error handling
			error: function(jqXHR, textStatus, errorThrown) {
				alert('HttpRequest=' + jqXHR.responseText + '\n' + textStatus + ': ' + errorThrown);	
			},
			//Callbackfunktion
  			success: function(data) {
				var txt = "";
				//Ergebnis iterieren und filtern
				$.each(data.foods.food, function() {
					txt = txt + ('<li><a href="#view_food" onclick="fatsecret.viewFood(' + this.food_id + ')"><h3>' + this.food_name + '</h3><p>' + this.food_description + '</p></a></li>');
				});
				//Ergebnis ausgeben
				output.html(txt);
				output.listview("refresh").hide().fadeIn("slow");
  			}
		});
	},
	viewFood : function(id) {
		var output = $('#food_list');
		output.html('<img class="ajax_loader" src="images/ajax-loader-kit.gif"/>');
		
		var queryUrl = apiUrls.getFood + encodeURI(id) + ".json";
		//jQuery Ajax Request
		$.ajax({
			//Methode GET
			type: "GET",
			//API-URL Food
  			url: queryUrl,
			//Antwort in jsonp
			dataType: "jsonp",
			//Error handling
			error: function(jqXHR, textStatus, errorThrown) {
				alert('HttpRequest=' + jqXHR.responseText + '\n' + textStatus + ': ' + errorThrown);	
			},
			//Callbackfunktion
  			success: function(data) {
				var txt = "";
				var found = false;
				//Ergebnis iterieren und filtern
				txt = txt + ('<div id="food_list_head"><h3>' + data.food.food_name + '</h3>');
				$.each(data.food.servings.serving, function() {
					var metric_amount = parseFloat(this.metric_serving_amount);
					//alert(metric_ammount);
					
					if (metric_amount == 100) {
						txt = txt + ('<p>Per ' + metric_amount + ' g:</p></div><div class="ui-grid-b" id="nutrition_table"><div class="ui-block-a"><div class="nutrition_table_element"><h4>Calories:</h4><p>' + this.calories + ' kcal</p></div></div><div class="ui-block-b"><div class="nutrition_table_element"><h4>Protein:</h4><p>' + this.protein + ' g</p></div></div><div class="ui-block-c"><div class="nutrition_table_element"><h4>Carb:</h4><p>' + this.carbohydrate + ' g</p></div></div><div class="ui-block-a"><div class="nutrition_table_element"><h4>Fat:</h4><p>' + this.fat + ' g</p></div></div><div class="ui-block-b"><div class="nutrition_table_element"><h4>Fibre:</h4><p>' + this.fiber + ' g</p></div></div><div class="ui-block-c"><div class="nutrition_table_element"><h4>Iron:</h4><p>' + this.iron + ' g</p></div></div></div>');
						
						portion.init(data.food.food_name, metric_amount, parseFloat(this.calories));
						found = true;
					}
				});
				
				if (found !== true) {
					var serving = data.food.servings.serving;
					if($.isArray(serving)) {
						serving = serving[0];
					}
					var metric_amount = parseFloat(serving.metric_serving_amount);
					
					txt = txt + ('<p>Per ' + metric_amount + ' g:</p></div><div class="ui-grid-b" id="nutrition_table"><div class="ui-block-a"><div class="nutrition_table_element"><h4>Calories:</h4><p>' + this.calories + ' kcal</p></div></div><div class="ui-block-b"><div class="nutrition_table_element"><h4>Protein:</h4><p>' + this.protein + ' g</p></div></div><div class="ui-block-c"><div class="nutrition_table_element"><h4>Carb:</h4><p>' + this.carbohydrate + ' g</p></div></div><div class="ui-block-a"><div class="nutrition_table_element"><h4>Fat:</h4><p>' + this.fat + ' g</p></div></div><div class="ui-block-b"><div class="nutrition_table_element"><h4>Fibre:</h4><p>' + this.fiber + ' g</p></div></div><div class="ui-block-c"><div class="nutrition_table_element"><h4>Iron:</h4><p>' + this.iron + ' g</p></div></div></div>');
					
					portion.init(data.food.food_name, metric_amount, parseFloat(serving.calories));
					found = true;
				}
				//Ergebnis ausgeben
				output.html(txt);
				output.hide().fadeIn("slow");
  			}
		});
	}
}

/*--- Portion ---*/

var portion = {
	actualFood : "",
	actualAmount : 0,
	actualCalories : 0,
	caloriesPerGram : 0,
	init : function(food, amount, calories) {
		portion.actualFood = food;
		portion.actualAmount = amount;
		portion.actualCalories = calories;
		
		portion.calcGram();
	},
	calcGram : function() {
		portion.caloriesPerGram = portion.actualCalories / portion.actualAmount;
		//alert(portion.actualCalories +" / "+ portion.actualAmount +" = "+ portion.caloriesPerGram);
	},
	setPortion : function() {
		portion.actualAmount = $('#portion_slider').val();
		
		portion.actualCalories = (portion.actualAmount * portion.caloriesPerGram).toFixed(0);
		//portion.actualCalories = portion.actualAmount * portion.caloriesPerGram
		
		$('#calculated_calories').text(portion.actualCalories + ' kcal');
	},
	setPortionManually : function() {
		food = $('#food_name_form');
		amount = $('#food_amount_form');
		calories = $('#food_calories_form');
		
		if(food.val() == "") {
			alert("Please enter food name!");
		}else if(amount.val()!="" && calories.val()!="" && /^[0-9]*(?:\.[0-9]*)?$/.test(amount.val()) && /^[0-9]*(?:\.[0-9]*)?$/.test(calories.val())) {
			portion.actualFood = food.val();
			portion.actualCalories = parseFloat(calories.val()).toFixed(0);
			portion.actualAmount = parseFloat(amount.val()).toFixed(0);
		
			portion.calcGram();
		
			portion.savePortion();
		
			food.val("");
			amount.val("");
			calories.val("");
		}else {
			alert("Please enter valid data!");
			amount.val("");
			calories.val("");
		}
	},
	savePortion : function() {
		data.timestamp = data.getTimestamp();
		data.actualDate = data.getActualDate();
		
		
		db.insert("data", {title: portion.actualFood, timestamp: data.timestamp, date: data.actualDate, calories: portion.actualCalories, metric_amount: portion.actualAmount, calorie_cap: profile.calorieCap});

		
		db.commit();
		$.mobile.changePage("#add_food");
	},
	deletePortion : function(portionId) {
		db.deleteRows("data", {ID: portionId});
		db.commit();
		presentation.dayFoodList(presentation.settedDate);
	}
}

/*--- Presentation ---*/

var presentation = {
	settedDate : "",
	dayFoodList : function(theDate) {
		$('#day_food_date').html('<h3>' + theDate + '</h3>');
		
		var output = $('#day_food_list');
		output.html('<img class="ajax_loader" src="images/ajax-loader-kit.gif"/>');
		presentation.settedDate = theDate;
		var txt = "";
		
		var list = db.query("data", {date: theDate});
		
		$.each(list, function() {
			txt = txt + ('<li><a href=""><h3>' + this.title + '</h3><p>' + this.metric_amount + ' g: ' + this.calories + ' kcal</p></a><a href="" onClick="portion.deletePortion(' + this.ID + ')" data-icon="delete"></a></li>');
		});
		
		output.html(txt);
		graph.draw_stat(theDate);
		output.listview("refresh").hide().fadeIn("slow");
	}
}

/*---- Statistik ----*/
var statistik = {
	
	/*---- Switch to previous Day ----*/
	previous : function() {
		var date = data.getPreviousDate();
		presentation.dayFoodList(date);
	},
	/*---- Switch to next Day ----*/
	next : function() {
		var date = data.getNextDate();
		presentation.dayFoodList(date);
	}
}

/*--- Profile ---*/

var profile = {
	name : "",
	gender : "",
	calorieCap : "",
	/*-- Load user data on startup --*/
	init : function(user) {
		profile.name = user.name;
		profile.gender = user.gender;
		profile.calorieCap = user.calorie_cap;
	},
	/*-- Initial set user (#initial_settings) --*/
	setUser : function() {
		profile.name = $('#user_name_form').val();
		profile.gender = $('input[name=gender_radio]:checked').val();
		if (profile.gender == "female") {
			profile.calorieCap = 2000;
		}else {
			profile.calorieCap = 2500;
		}
		
		profile.save();
		$.mobile.changePage("#index");
	},
	/*-- Update user (#settings) --*/
	updateUser : function() {
		profile.name = $('#user_name_form_settings').val();
		profile.gender = $('input[name=gender_radio_settings]:checked').val();
		profile.calorieCap = $('#calorie_cap_form_settings').val();
		
		profile.save();
	},
	/*-- Save changes to db --*/
	save : function() {
		db.update("profile", {ID: 1}, function(row){
			row.name = profile.name;
			row.gender = profile.gender;
			row.calorie_cap = profile.calorieCap;
			return row;	
		});
		db.commit();
	}
}

/*--- Data ---*/

var db;

var data = {
	timestamp : 0,
	actualDate : "",
	initialised : false,
	actual : 0,
	/*-- Initialise app --*/
	init : function() {
		/*-- Load/create db --*/
		db = new localStorageDB("db");
		/*-- If db is new, create tables and default user --*/
		if( db.isNew() ) {
			
			db.createTable("profile", ["name", "gender", "calorie_cap"]);
			//db.createTable("data", ["title", "timestamp", "date", "calories", "metric_amount"]);
			db.createTable("data", ["title", "timestamp", "date", "calories", "metric_amount", "calorie_cap"]);
			
			db.insert("profile", {name: "default", gender: "female", calorie_cap: 2000});
			db.commit();
		}
		
		var user = db.query("profile", {ID: 1})[0];
		/*-- Load user data or if not available redirect to #initial_settings --*/
		if (user.name == "default") {
			$.mobile.changePage("#initial_settings");
		}else {
			profile.init(user);
		}
		/*-- Set current timestamp --*/
		data.timestamp = data.getTimestamp();
		data.actualDate = data.getActualDate();
		graph.init();
		
		data.initialised = true;
	},
	/*-- Check if day is changed --*/
	checkTimestamp : function() {
	},
	getActualDate : function() {
		var time = new Date();
		actual = new Date();
		var day = time.getDate();
		if(day<10)day="0"+day;
		var month = time.getMonth() + 1;
		if(month<10)month="0"+month;
		var year = time.getFullYear();
		
		return (day + "/" + month + "/" + year);
	},
	
	getPreviousDate : function() {
		
		actual.setDate(actual.getDate()-1);
		var day = actual.getDate();
		if(day<10)day="0"+day;
		var month = actual.getMonth() + 1;
		if(month<10)month="0"+month;
		var year = actual.getFullYear();
		return (day + "/" + month + "/" + year);
	},
	
	getNextDate : function() {
	
		actual.setDate(actual.getDate()+1);
		var day = actual.getDate();
		if(day<10)day="0"+day;
		var month = actual.getMonth() + 1;
		if(month<10)month="0"+month;
		var year = actual.getFullYear();
		return (day + "/" + month + "/" + year);
	},
	/*-- Get current timestamp --*/
	getTimestamp : function() {
		return new Date().getTime();
	},
	deleteCalorieData : function() {
		db.deleteRows("data");
		db.commit();
	}
}