var savedArticle = [];

// $.getJSON('/articles', function (data) {
//     if (data.length === 0) {
//         $('#NoArticleDiv').show();
//     } else {
//         $('#NoArticleDiv').hide();
//     }
//     console.log(data);
//     generateAtricles(data);
    
// });
$('.btnScrapArticlae').on('click', function () {

    $.get('/scrapArticles', function (data) {
        console.log(data);
        alert(`articles scrapped....`);
        console.log(data);
        generateAtricles(data);
       
    });
    // window.location.reload();

});

$('.btnSavedArticle').on('click',function(){
    // alert('it works');
    $.get('/allSavedArticles',function(data){
        console.log(data);
        generateAtricles(data);
    })
})

$(document).on('click', '.saveBtn', function () {

    // var thisId = $(this).attr("data-id");

    
        let article = {
            title:$(this).parent().find('.articleTitle').text().trim(),
            link: $(this).parent().find('a').attr('href').trim(),
            paragraph : $(this).parent().find('.atricleP').text().trim()
           
        }
            // savedArticle.push(article);
            // console.log(savedArticle);
     console.log(article);   
     $.ajax({
        type: "POST",
        url: "/saveArticle",
        data: {article : article},
       
      }).then(function(data){
        console.log(data);
      });



});

function generateAtricles(data){
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        let num = i + 1;
        let div = $('<div>');
        let title = $('<h2>');
        let a = $('<a>');
        let p = $('<p>');
        let savtBtn = $('<button>')


        div.attr('class', 'dynamicArticle');
        title.text(data[i].title);
        title.attr('class', 'articleTitle');

        a.text( data[i].link);
        a.attr('href', data[i].link);
        a.attr('class', 'linkTag');
        p.text(data[i].paragraph);
        p.attr('class', 'atricleP');
        savtBtn.attr('class', 'saveBtn btn btn-primary float-right');
        savtBtn.text('Save Article');
        // savtBtn.attr('data-id', );

        div.append(title, a, p, savtBtn);
        $('#article').append(div);

    }
}