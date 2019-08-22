var savedArticle = [];

$('.btnScrapArticlae').on('click', function () {

    $.get('/scrapArticles', function (data) {
        // console.log(data);
        alert(`articles scrapped....`);
        // console.log(data);
        generateAtricles(data);
       
    });
    // window.location.reload();

});


$(document).on('click', '.saveBtn', function () {

    // var thisId = $(this).attr("data-id");

    
        let article = {
            title:$(this).parent().find('.articleTitle').text().trim(),
            link: $(this).parent().find('a').attr('href'),
            paragraph : $(this).parent().find('.atricleP').text().trim()
           
        }
            
     console.log(article);   
     $.ajax({
        type: "POST",
        url: "/saveArticle",
        data: {article : article},
       
      }).then(function(data){
        console.log(data);
      });

      $(this).parent().remove();
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
$(document).on('click','.btnAddNotes',function(){
    alert($(this).attr('data-id'));
    let id = $(this).attr('data-id');
    $('#exampleModal').modal('show');
    $('.modal-title').text(`Notes for Atrilce Id : ${id}`)
    // $(this).attr('data-target','#exampleModal');
})
