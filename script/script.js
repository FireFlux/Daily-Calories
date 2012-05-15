// JavaScript Document

$( '#index' ).live( 'pagecreate',function(event){
	//fatsecret.searchFood();
});

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
				//Ergebnis iterieren und filtern
				txt = txt + ('<h3>' + data.food.food_name + '</h3>');
				$.each(data.food.servings.serving, function() {
					var metric_ammount = parseFloat(this.metric_serving_amount);
					
					if (this.metric_ammount == "100.000") {
						txt = txt + ('<p>Per ' + metric_ammount + 'g:</p><p>Calories: ' + this.calories + '</p>');
					}
				});
				//Ergebnis ausgeben
				output.html(txt);
				output.listview("refresh").hide().fadeIn("slow");
  			}
		});
	}
}