// JavaScript Document

$( '#index' ).live( 'pageinit',function(event){
	//fatsecret.searchFood();
	data.init();
});

$( '#settings' ).live( 'pagebeforeshow',function(event){
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

/*--- API ---*/

var fatsecret = {
	foodid : "",
	query : "",
	searchFood : function(q) {
		var output = $('#result_list');
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
				txt = txt + ('<h3>' + data.food.food_name + '</h3>');
				$.each(data.food.servings.serving, function() {
					var metric_amount = parseFloat(this.metric_serving_amount);
					//alert(metric_ammount);
					
					if (metric_amount == 100) {
						txt = txt + ('<p>Per ' + metric_amount + 'g:</p><p>Calories: ' + this.calories + '</p>');
						found = true;
					}
				});
				
				if (found !== true) {
					var serving = data.food.servings.serving;
					if($.isArray(serving)) {
						serving = serving[0];
					}
					var metric_amount = parseFloat(serving.metric_serving_amount);
					
					txt = txt + ('<p>Per ' + metric_amount + 'g:</p><p>Calories: ' + serving.calories + '</p>');
					found = true;
				}
				//Ergebnis ausgeben
				output.html(txt);
				output.listview("refresh").hide().fadeIn("slow");
  			}
		});
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
	/*-- Initialise app --*/
	init : function() {
		/*-- Load/create db --*/
		db = new localStorageDB("db");
		/*-- If db is new, create tables and default user --*/
		if( db.isNew() ) {
			
			db.createTable("profile", ["name", "gender", "calorie_cap"]);
			db.createTable("data", ["title", "timestamp", "calories", "metric_ammount"]);
			
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
	},
	/*-- Check if day is changed --*/
	checkTimestamp : function() {
	},
	/*-- Get current timestamp --*/
	getTimestamp : function() {
		return new Date().getTime();
	}
}