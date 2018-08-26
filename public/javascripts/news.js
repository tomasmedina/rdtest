$('.tableRow').on('click',function(event){

    window.open($(this).attr('data-href'));
});

$('.deleteArticle').on('click',function(event){
    event.stopPropagation();
    var btn = $(this);
    var storyId = btn.parent().parent().attr("data-id");
    $.ajax({
        url: '/delete',
        type: "POST",
        data: {
            id:storyId
        },
        success: function (response) {

            if(response == "OK"){
                btn.parent().parent().remove();
            }

        },
        error: function (response) {
            console.log(response.responseText);
        },
    });
})