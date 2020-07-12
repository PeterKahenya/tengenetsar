var previous_lat=$("#address_latitude").val()
var previous_lng=$("#address_longitude").val()

$("#first_step").hide();



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


var place;


function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: -1.3,
            lng: 36.7
        },
        zoom: 13,
        mapTypeId: "roadmap"
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById("pac-input");
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

        $("#address_longitude").val(place.geometry.location.lng())
        $("#address_latitude").val(place.geometry.location.lat())
        $("#delivery_address_alert").html("<small>"+place.name+" "+place.adr_address+"</small>")
        $("#locdonebtn").prop("disabled",false)
            console.log(place.name)
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                                    map: map,
                                    icon: icon,
                                    title: place.name,
                                    position: place.geometry.location
                                    })
            );

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}


function choosePreviousLocation(){
    $("#address_longitude").val(previous_lng)
    $("#address_latitude").val(previous_lat)
    $("#delivery_address_alert").html("Previous Delivery Location")
    $("#locdonebtn").prop("disabled",false)


}



function chooseYourLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

        var lat= position.coords.latitude 
        var long= position.coords.longitude
        $("#address_longitude").val(long)
        $("#address_latitude").val(lat)
        $("#delivery_address_alert").html("Using your Current Location")

        $("#locdonebtn").prop("disabled",false)
        

        });
        } else {

          alert("Geolocation is not supported by this browser.");

        }

}

function deliveryAddressChosen() {
    $("#get_address").hide();
    $("#first_step").show();
}