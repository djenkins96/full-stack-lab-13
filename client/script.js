var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');


$chirpField.on('input', function(){
    var isEmpty = $chirpField.val().length === 0;
    // if(isEmpty){
    //     $chripButton.prop('disabled', true);{
    //     } else {
    //         $chirpButton.prop('disabled', false);
    //     }
    // }
    $chirpButton.prop('disabled', isEmpty);
});

$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        user: 'Derrick',
        timestamp: new Date().toISOString()
    };
    $.ajax({
        method:'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success){
        $chirpField.val(''); 
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err){
        console.log(err);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps){
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++){
            var $chirpDiv = $('<div class="chirp"></div>');
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            
            $message.text(chirps[i].message);
            $user.text(chirps[i].user);
            $timestamp.text(new Date(chirps[i].timestamp).toLocaleString());

            $message.appendTo($chirpDiv);
            $user.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);

            $chirpDiv.appendTo($chirpList);
        }
    }, function(err) {
        console.log(err);
    });
}

getChirps();



// $.ajax({
//     method: 'GET',
//     url: 'http://localhost:3000/api/chirps'
// }).then(function (success) {
//     for (var i = 0; i < success.length; i++) {
//         var $div = $('<div></div>');
//         $div.text(success[i].message);
//         $('body').append($div);
//     }
// }, function (err) {
//     console.log(err);
// });

// $('#btn').click(function () {
//     $.ajax({
//         method: 'POST',
//         url: 'http://localhost:3000/'
//     }).then(function () {
//         var $div =$('<div></div>');
//         $('body').append($div);
//     }
//     }, function (err) {
//         console.log(err);
//     });
// });

    // $( "#btn" ).click(function() {
    //     $.ajax({
    //         method: 'POST',
    //         url: 'http://localhost:3000/api/chirps'
    //     }).then(function(success){

    //         }
    //     }, function(err) {
    //         console.log(err);
    //     });
    // });
