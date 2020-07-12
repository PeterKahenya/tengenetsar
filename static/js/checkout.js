console.log($('#address_longitude').val())
$("#first_step").hide();

if ($('#address_longitude').val()==="None") {
    console.log("address_longitude")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
      console.log("geolocation supported")

      var lat= position.coords.latitude 
      var long= position.coords.longitude
      $("#address_longitude").val(long)
      $("#address_latitude").val(lat)
      $("#get_address").hide();
      $("#first_step").show();

    });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}else{
  $("#get_address").hide();
  $("#first_step").show();
}

var interval = NaN;
function checkStatus() {
  fetch("https://eawaterspayments.herokuapp.com/ispaid?purpose=course")
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return;
        }
      })
    .then((res) => {
      if (res.status === 0) {
        var msg = res.body;
        if (msg.BillRefNumber === $("#phone_no_val").val()) {
          $("#paymentstatus").html(
            "Thank You Payment Received for " + msg.BillRefNumber
          );
          $("#paymentstatus").removeClass("alert-primary");
          $("#paymentstatus").addClass("alert-success");

          $("#mpesa_code").val(msg.TransID);
          $("#mpesa_name").val(msg.BillRefNumber);
          $("#mpesa_amount").val(msg.TransAmount);

          $("#finishbtn").removeClass("btn-secondary");
          $("#finishbtn").addClass("btn-primary");

          $("#finishbtn").prop("disabled", false);
          clearInterval(interval);
        }
      } else {
        console.log(".");
      }
    });
}
$("#second_step").hide();

function update_number() {
  $("#final_number").html(
    "254" + $("#phone_number").val().replace(/^0+/, "")
  );
  $("#phone_number_label").html(
    "254" + $("#phone_number").val().replace(/^0+/, "")
  );
  $("#phone_no_val").val(
    "254" + $("#phone_number").val().replace(/^0+/, "")
  );
}
function confirm_number() {
  $("#staticBackdrop").modal("hide");
  $("#first_step").fadeOut();
  $("#second_step").fadeIn();
  interval = setInterval(checkStatus, 1000);
}


























