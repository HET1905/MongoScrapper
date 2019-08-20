$(function(){
    // alert('file attached');
    $('.btnScrapArticlae').on('click',function(){
        $.get('/scrapArticles',function(data){
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
              }
        })
    })
})