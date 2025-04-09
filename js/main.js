products = 
[ 
    { id: 1, img: 'top-4.webp', name: 'Крем брюле', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 2, img: 'top-1.webp', name: 'Пломбир', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 3, img: 'top-5.jpg', name: 'Дынька медовая', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 4, img: 'top-2.jpg', name: 'Пломбир шоколадный', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 5, img: 'top-3.jpg', name: 'Ванильное', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 6, img: 'tab-1.png', name: 'Пломбир Ялтинский', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 7, img: 'tab-2.png', name: 'Пломюир Ялтиский шоколадный', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 8, img: 'tab-4.png', name: 'Пломбир Симферопольский', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 9, img: 'tab-6.png', name: 'Пломбир 100%', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 10, img: 'tab-7.png', name: 'Пломбир ванильный', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 11, img: 'tab-8.png', name: 'Мохито', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 12, img: 'banner-1.webp', name: 'Земляничное', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 13, img: 'banner-2.webp', name: 'Семейное', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 14, img: 'lp-1.jpg', name: 'С клубничным джемом', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 15, img: 'lp-2.jpg', name: 'Пломбир арахисовый', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 16, img: 'lp-3.jpg', name: 'Молочное', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 17, img: 'lp-4.jpg', name: 'Клубничное', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 18, img: 'lp-5.jpg', name: 'Фисташковое', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
    { id: 19, img: 'lp-6.jpg', name: 'Шоколадная крошка', price: 100, quantity: 0, description: '', top: false, recomended: false, sale: false, new: false },
];

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(".humberger__open").on('click', function () {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on('click', function () {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*-----------------------
        Categories Slider
    ------------------------*/
    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });


    $('.hero__categories__all').on('click', function(){
        $('.hero__categories ul').slideToggle(400);
    });

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------------
        Product Discount Slider
    -------------------------------*/
    $(".product__discount__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            320: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 2,
            },

            992: {
                items: 3,
            }
        }
    });

    /*---------------------------------
        Product Details Pic Slider
    ----------------------------------*/
    $(".product__details__pic__slider").owlCarousel({
        loop: true,
        margin: 20,
        items: 4,
        dots: true,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });

    /*-----------------------
		Price Range Slider
	------------------------ */
    var rangeSlider = $(".price-range"),
        minamount = $("#minamount"),
        maxamount = $("#maxamount"),
        minPrice = rangeSlider.data('min'),
        maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function (event, ui) {
            minamount.val(ui.values[0] + ' р');
            maxamount.val(ui.values[1] + ' р');
        }
    });
    minamount.val(rangeSlider.slider("values", 0) + ' р');
    maxamount.val(rangeSlider.slider("values", 1) + ' р');

    /*--------------------------
        Select
    ----------------------------*/
    $("select").niceSelect();

    /*------------------
		Single Product
	--------------------*/
    $('.product__details__pic__slider img').on('click', function () {

        var imgurl = $(this).data('imgbigurl');
        var bigImg = $('.product__details__pic__item--large').attr('src');
        if (imgurl != bigImg) {
            $('.product__details__pic__item--large').attr({
                src: imgurl
            });
        }
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
    });

})(jQuery);