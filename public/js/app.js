$(function(){
    // alert('file attached');
    $('.btnScrapArticlae').on('click',function(){
        $.getJSON('/scrapArticles',function(res){
            console.log(res);
        })
    })
})