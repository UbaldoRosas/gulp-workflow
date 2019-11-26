// // Patrón modular para cada sección del sitio
// const section = (() => {

//     // Objeto que guardará como objetos JQuery todos los elementos pertenecientes a la sección
//     const elems = {
//         elem : $('selector')
//     };

//     return {

//         $ : elems

//     };

// })();

$(document).ready(function () {
    $('#btn-menu').click(function() {
        if (!$(this).hasClass('home')) {
            if ($(this).hasClass('fb-open')) {
                $.fancybox.close();
            } else {
                $('#menu').toggleClass('show');
                $(this).toggleClass('open');
                $('body').toggleClass('no-scroll');
            }
        }
    })

    if( $('.section-list').length ) {
        const theme = $('.menu__link').first().data('theme');
        $('body').addClass(theme);
    }

    if (isMobile) {
        $('.grid__item').addClass('mobile');
    }
});

$(window).on('load', () => {

});

$(window).resize(()=> {

});