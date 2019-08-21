var savedArticle = [];

$.getJSON('/articles', function (data) {
    if (data.length === 0) {
        $('#NoArticleDiv').show();
    } else {
        $('#NoArticleDiv').hide();
    }
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
        savtBtn.attr('data-id', data[i]._id);

        div.append(title, a, p, savtBtn);
        $('#article').append(div);

    }
});
$('.btnScrapArticlae').on('click', function () {

    $.get('/scrapArticles', function (data) {
        console.log(data);
        alert(`articles scrapped....`)
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#article").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].paragraph + "</p>");
        }

    });
    window.location.reload();

});

$(document).on('click', '.saveBtn', function () {

    var thisId = $(this).attr("data-id");


    $.get('/saveArticle/' + thisId, function (data) {
        console.log(data);
        let article = {
            id: data[0]._id,
            title: data[0].title,
            link: data[0].link,
            paragraph: data[0].paragraph
        }
        savedArticle.push(article);
        console.log(savedArticle);
    });




})