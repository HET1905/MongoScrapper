$(function () {
   
    $('.btnScrapArticlae').on('click', function () {
       
        $.get('/scrapArticles', function (data) {
            alert(`articles scrapped....`);
            generateAtricles(data);

        });

    });

  
    $(document).on('click', '.saveBtn', function () {

        let article = {
            title: $(this).parent().find('.articleTitle').text().trim(),
            link: $(this).parent().find('a').attr('href'),
            paragraph: $(this).parent().find('.atricleP').text().trim()

        }

        $.ajax({
            type: "POST",
            url: "/saveArticle",
            data: {
                article: article
            },

        }).then(function (data) {
        });

        $(this).parent().remove();
    });

    function generateAtricles(data) {
        $('#article').empty();
        $('h1').text('New Scrapped Articles');
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

            a.text(data[i].link);
            a.attr('href', data[i].link);
            a.attr('class', 'linkTag');
            p.text(data[i].paragraph);
            p.attr('class', 'atricleP');
            savtBtn.attr('class', 'saveBtn btn btn-primary float-right');
            savtBtn.text('Save Article');

            div.append(title, a, p, savtBtn);
            $('#article').append(div);
        }
    }

    $(document).on('click', '.btnDeleteArticle', function () {
        let id = $(this).attr('data-id');
        $.ajax({
                method: "DELETE",
                url: "/api/Articles/" + id
            })
            .then(function (data) {

            });
        alert('Record deleted');
        location.reload();
    });

    $(document).on('click', '.btnAddNotes', function () {

        let id = $(this).attr('data-id');
        $('#exampleModal').modal('show');
        $('#exampleModalLabel').text(id)
        $('#listOfNotes').empty();
        $('#txtNotes').val('');
        $.get('/api/notes/' + id, function (data) {
            if (data.length === 0) {
                $('#listOfNotes').append('<p class=articleNoteNum > No Notes for this article </p>');
            } else {
                for (var i = 0; i < data.length; i++) {
                    let num = i + 1;
                    $('#listOfNotes').append('<p class=articleNoteNum > Article Note : ' + num + "<span><i class='fa fa-trash'></i></span></p>")
                }
            }

        })
    });

    $('.btnSaveNotes').on('click', function () {
        let id = $('#exampleModalLabel').text().trim();
        let note = $('#txtNotes').val().trim();
        let noteObj = {
            articleId: id,
            body: note
        };

        $.ajax({
            type: "POST",
            url: "/saveNote/" + id,
            data: {
                note: noteObj
            },

        }).then(function (data) {
            console.log(data);
        });

        $('#exampleModal').modal('hide');
    });

});