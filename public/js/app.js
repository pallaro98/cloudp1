$(document).ready(function() {
  position = 0;
  images = [];

  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    displayModal();
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }	
  });
  
  function displayModal() {
    $(  "#myModal").modal('show');
    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      renderQueryResults(data);
    });
  }
  
  $("#next").click( function(e) {
    pos++;
    $("#img0").attr("src", images[pos]);	
    $("#img0").show();
    $("#previous").show();
    if((images.length-1)<=pos) $(this).hide();
  });
  
  $("#previous").click( function(e) {
    pos--;
    $("#img0").attr("src", images[pos]);
    $("#img0").show();
    $("#next").show();
    if(pos==0)$(this).hide()
  });

  function renderQueryResults(data) {
    
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
    } else {
      pos=0;
      $("#status").html(""+data.num_results+" result(s)");
      images = data.results;
      $("#img0").attr("src", images[pos]);
      if(data.num_results>1)$("#next").show();
     }
   }
});
