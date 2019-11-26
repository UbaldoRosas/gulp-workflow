// Función que incluye utilidades generales.
var util = (() => {

    let browser = navigator.userAgent;

    // Variables para detectar navegadores, de ser requeridas pueden retornarse como métodos
    let is_chrome   = browser.indexOf('Chrome') > -1;
    let is_explorer = browser.indexOf('MSIE') > -1;
    let is_firefox  = browser.indexOf('Firefox') > -1;
    let is_safari   = browser.indexOf('Safari') > -1;
    let is_opera    = browser.toLowerCase().indexOf('op') > -1;

    if (is_chrome && is_safari ) is_safari = false;
    if (is_chrome && is_opera )  is_chrome = false;

    return {

        // Detecta si la visualización del sitio web ocurre en un entorno móvil
        isMobile: () => {
            let check = false;
            (a => {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },

        // Indica si el navegador que utilizamos es safari
        isSafari : is_safari,

        // Un input es correo electronico
        isEmail : function(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        },

        // Un nodo html está vacío
        isEmpty : function(el) {
            return !$.trim(el.html())
        },

        // Sanear string
        cleanString : function(s) {
            // Definimos los caracteres que queremos eliminar
            var specialChars = "!@#$^&%*()+=[]\/{}|:<>?,";
            
            // Los eliminamos todos
            for (var i = 0; i < specialChars.length; i++) {
                s= s.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
            }   
            
            // Lo queremos devolver limpio en minusculas
            s = s.toLowerCase();
            
            // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
            s = s.replace(/ /g,"_");
            s = s.replace(/-/g,"_");
            
            // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
            s = s.replace(/á/gi,"a");
            s = s.replace(/é/gi,"e");
            s = s.replace(/í/gi,"i");
            s = s.replace(/ó/gi,"o");
            s = s.replace(/ú/gi,"u");
            s = s.replace(/ñ/gi,"n");
            return s;
        },

        // Permite tener un video de fondo que ocupe el 100% de su contenedor manteniendo relación de aspecto
        adjustVideo: (selector) => {
            const player       = $(selector);
            const mediaAspect  = 16 / 9;
            const windowW      = $(window)[0].innerWidth;
            const windowH      = $(window).height();
            const windowAspect = windowW / windowH;

            if (windowAspect < mediaAspect) {

                player.css({
                    top    : 0,
                    left   : -(windowH * mediaAspect - windowW) / 2,
                    height : windowH,
                    width  : windowH * mediaAspect
                });

            } else {

                player.css({
                    top    : -(windowW / mediaAspect - windowH) / 2,
                    left   : 0,
                    height : windowW / mediaAspect,
                    width  : windowW
                });

            }
        },

        // Mantiene un video en su relación de aspecto 16:9
        ratioVideo : function(selector) {

            if ( $(selector).length ) {

                $(selector).each(function(index, el) {
                    let $videos = $(this);
                    let ratio   = 16/9;
                    let wVideo  = $(this).width();
                    let hVideo  = Math.ceil( wVideo / ratio);

                    $videos.css( 'height', `${hVideo}px` );
                });
            }
        },
    };
})();

// Variables útiles
const isMobile = util.isMobile();
const isSafari = util.isSafari;

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

class API {

    static filter_products(filter) {
        if(filter != "todos") {
            products.hide();
            products.filter('[data-categoria="'+filter+'"]').show();
        } else {
            products.show();
        }
    }

    static add_product() {
        dialog_buttons.prop('disabled', true);
        dialog_line.open();

        let form = $('#product-form')[0];

        let formData = new FormData(form);
            formData.append('tipo', form.tipo.value);

        $.ajax({
            type: "POST",
            url: "/api/add-producto",
            data: formData,
            contentType: false,  
            cache: false,  
            processData: false,
            success: function (response) {

                if (response) {

                    let product = JSON.parse(response);

                    $('.cards-container').prepend(API.product_card(product));
                    
                    API.filter_products($('.mdc-tab--active').data('filter'));

                    dialog_line.close();
                    edit_dialog.close();
                    
                    snackbar.labelText = 'Producto agregado';
                    snackbar.open();
                    
                    // Reasignar eventos de click
                    $('.product-card__edit-button')
                        .off('click')
                        .click(function() {
                            API.get_product($(this).data('id'));
                        })

                    // Reasignar eventos de click
                    products = $('.product');
                    $('.product-card__delete-button')
                        .off('click')
                        .click(function() {
                            $(this).addClass('active');
                            dialog_buttons.prop('disabled', false)
                            delete_dialog.open();
                        })

                }
                    
            }
        });
    }

    static get_product(id) {
        
        $('#add-product-form-button').hide();
        $('#edit-product-form-button').show();

        $.ajax({
            type: "POST",
            url: "/api/get-product",
            data: {id : id},
            success: function (response) {
                let product = JSON.parse(response);


                API.clear_dialog_content();

                $('#product-image-folder').val(product.folder);
                $('#product-form-category').val(product.categoria);
                $('#product-form-unit').val(product.unidad);
                $('#product-form-name').val(product.nombre);
                $('#product-form-type').find('option[value="'+product.tipo.toLowerCase()+'"]').prop('selected', true);
                $('#product-form-description').val(product.descripcion);
                $('#product-form-peso-pieza').val(product.peso_pieza);
                $('#product-form-peso-caja').val(product.peso_caja);
                $('#product-form-temperatura').val(product.temperatura);
                $('#product-form-temperatura-transp').val(product.temperatura_transp);
                $('#product-form').attr('data-id', product.id);

                if (product.imagen !== "") {

                    $('#product-form-media').append(API.get_product_images(product))

                    $('.product-image__card').eq(0).find('.hover-image-field').addClass('hide');


                    if ( $('.product-image__card').length > 1 && product.hover_image == "1" ) {

                        $('.product-image__card').eq(1).find('.hover-image-check').prop('checked', true).addClass('active');

                    }

                    $('.main-image-check').change(function(event) {
                        $('.hover-image-field').removeClass('hide');

                        $(this).parentsUntil('.product-image__card')
                            .find('.hover-image-field').addClass('hide')
                            .find('.hover-image-check').removeClass('active').prop('checked', false);

                    });

                }

                $('.product-image__card-delete').click(function() {
                    API.delete_dialog_image($(this));
                })


                let rapidin_checkbox = $('#product-form-rapidin');

                if (API.check_is_pollo()) {

                    $('#product-form-subcategory')
                        .find('option[value="'+product.subcategoria+'"]').attr('selected', true);

                    $('label[for="product-form-subcategory"]').addClass('mdc-floating-label--float-above');

                    product.rapidin == "1" ? 
                        rapidin_checkbox.prop('checked', true) 
                        :
                        rapidin_checkbox.prop('checked', false) 

                } else {

                    rapidin_checkbox.prop('check', false) 

                }

                $('.hover-image-check').change(function() { API.set_hover_image($(this)) });

                $('#product-form-category').val()  == "huevo" ? 
                    $('option[value="congelado"]').prop({
                        hidden : true,
                        selected : false,
                        disabled : true
                    }).prev().prop('selected', true).parent().val('fresco')
                    : 
                    $('option[value="congelado"]').prop({
                        hidden : false,
                        disabled : false
                    });

                
                dialog_buttons.prop('disabled', false);
                dialog_line.close();

                edit_dialog.open();


                /*==================================================
                =            Resetear estilos de inputs            =
                ==================================================*/
                
                    $('.mdc-dialog').find('.mdc-text-field__input').each(function (index, element) {
                        let $this = $(element);
                        let label =  $this.next().find('label')

                        label.parent().removeAttr('style');

                        if ($this.val() !== "") {
                            label.addClass('mdc-floating-label--float-above')
                        } else {
                            label.removeClass('mdc-floating-label--float-above');
                        }

                    });
                
                /*=====  End of Resetear estilos de inputs  ======*/

            }
        });
    }

    static edit_product(id) {

        dialog_buttons.prop('disabled', true);
        dialog_line.open();

        let dialog_images = API.get_dialog_images();

        let form = $('#product-form')[0];

        let formData = new FormData(form);
            formData.append('id', id);

        if (dialog_images) {
            formData.append( 'curr_images', dialog_images.all );

            if (dialog_images.hover != "") {
                formData.append( 'hover_image', "1");
            } else {
                formData.append('hover_image', "");
            }

        } else {
            formData.append('curr_images', "");
            formData.append('hover_image', "");
        }


        $.ajax({
            type: "POST",
            url: "/api/edit-product",
            data: formData,
            contentType: false,  
            cache: false,  
            processData: false,
            
            success: function (response) {
                
                if(response) {
                    
                    let active_filter = $('.mdc-tab--active').data('filter');
                    let product_card = $('.product').filter('[data-id="'+id+'"]');
                    
                    let src_image = "";

                    if (dialog_images) {
                        src_image += dialog_images.default;
                    }

                    if (product_card.length < 1) {
                        let product = JSON.parse(response);

                        $('.cards-container').prepend(API.product_card(product));

                        setTimeout(() => {
    
                            dialog_line.close();
                            edit_dialog.close();
    
                            snackbar.labelText = 'Producto agregado';
                            snackbar.open();
    
                        }, 1500);

                        $('.product-card__edit-button')
                            .off('click')
                            .click(function() {
                                API.get_product($(this).data('id'));
                            })

                        products = $('.product');
                        $('.product-card__delete-button')
                            .off('click')
                            .click(function() {
                                $(this).addClass('active');
                                dialog_buttons.prop('disabled', false)
                                delete_dialog.open();
                            })

                    } else {
                        setTimeout(() => {
    
                            product_card.attr('data-categoria', form.categoria.value);
                            product_card.find('img').attr('src', `/assets/img/catalogo/${id}/${src_image}`);
                            product_card.find('.product-name').text(form.nombre.value);
                            product_card.find('.product-unidad').text(form.unidad.value);
    
                            API.filter_products(active_filter);
    
                            dialog_line.close();
                            edit_dialog.close();
    
                            snackbar.labelText = 'Producto actualizado';
                            snackbar.open();
    
                        }, 1000);

                    }


                }
            }
        });
    }

    static delete_product(id) {
        $.ajax({
            type: "POST",
            url: "/api/delete-product",
            data: {id:id},
            success: function (response) {

                snackbar.labelText = 'Producto eliminado';
                snackbar.open();

                $('.product[data-id="'+id+'"]').remove();
            }
        });
    }

    static update_product_order(prod_id, index) {

        let data = {
            id : prod_id,
            order : index
        }

        $.ajax({
            type: "post",
            url: "/api/update-prod-order",
            data: data,
            success: function (response) {
                console.log('response', response);
            }
        });

    }

    static get_uploaded_images(return_array = false) {
        let images = [];

        let images_object = $('#product-form-imagenes')[0].files;

        for (const image in images_object) {
            if (images_object.hasOwnProperty(image)) {
                const image_name = images_object[image].name;
                images.push(image_name);
            }
        }

        return return_array ? images : images.join(', ');
    }

    static get_product_images(product) {
        let cards = "";
        let arr_images = product.imagen.split(",");

        for (let i = 0; i < arr_images.length; i++) {
            const image = util.cleanString(arr_images[i]);
            const src = `/assets/img/catalogo/${product.id}/${image}`;

            // si la imágen no fue eliminada del dialog
            if (deleted_images.indexOf(image) == -1) {

                cards += this.dialog_image_card(src, image, i);

            }
        }

        return cards;
    }

    static update_product_images(product) {
        let cards = this.get_product_images(product);

        $('.product-image__card').remove();

        $('#product-form-media').append(cards);

        $('.product-image__card').eq(0).find('.hover-image-field').addClass('hide');

        if (product.hover_image == "1") {
            $('.product-image__card').eq(1).find('.hover-image-check').addClass('active').prop('checked', true);
        }

        $('.hover-image-check').change(function() { API.set_hover_image($(this)) });

        $('.main-image-check').change(function(event) {
            $('.hover-image-field').removeClass('hide');

            $(this).parentsUntil('.product-image__card')
                .find('.hover-image-field').addClass('hide')
                .find('.hover-image-check').removeClass('active').prop('checked', false);

        });

        $('.product-image__card-delete').click(function() {
            API.delete_dialog_image($(this));
        })
    }

    static product_card(product) {
        let folder = product.id ;
        let image = "";

        if (product.imagenes) {
            image = product.imagenes.split(",")[0];
        }

        return `<div class="product-card__container product" data-id="${product.id}" data-categoria="${product.categoria}">
                    <div class="mdc-card product-card">
                        <div tabindex="0">
                            <div class="mdc-card__media mdc-card__media--16-9 product-card__media">
                                <img src="/assets/img/catalogo/${folder}/${image}" alt="">
                            </div>
                            <div class="product-card__primary">
                                <h2 class="product-card__title product-name mdc-typography mdc-typography--headline6" data-nombre>${product.nombre}</h2>
                                <h3 class="product-card__subtitle product-unidad secondary-text mdc-typography mdc-typography--body2" data-unidad>${product.unidad}</h3>
                            </div>
                        </div>
                        <div class="mdc-card__actions">
                            <div class="mdc-card__action-buttons d-flex flex-justify-between min-w-full">
                                <button class="mdc-button mdc-card__action mdc-card__action--button product-card__edit-button" data-id="${product.id}">Editar</button>
                                <span class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon product-card__delete-button" title="Delete" data-id="${product.id}">delete</span>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    static dialog_image_card(src, image, forloop_index) {

        let checked = forloop_index == 0 ? 'checked' : '';

        return `
            <div class="mdc-card product-card product-image__card" data-image="${image}">
                <div tabindex="0">
                    <div class="mdc-card__media mdc-card__media--16-9" style="background-image: url('${src}');"></div>
                    <div class="mdc-card__actions">
                        <div class="mdc-card__action-buttons min-w-full d-flex flex-justify-between">
                            <div>
                                <div class="mdc-form-field main-image-field">
                                    <div class="mdc-radio">
                                        <input class="mdc-radio__native-control main-image-check" type="radio" id="${image}" name="default_image" value="${image}" ${checked}>
                                        <div class="mdc-radio__background">
                                            <div class="mdc-radio__outer-circle"></div>
                                            <div class="mdc-radio__inner-circle"></div>
                                        </div>
                                    </div>
                                    <label for="${image}">Principal</label>
                                </div>
                                <div class="mdc-form-field hover-image-field">
                                    <div class="mdc-checkbox">
                                        <input type="checkbox" name="hover_image" value="${image}" class="mdc-checkbox__native-control hover-image-check" id="hover-image-${image}"/>
                                        <div class="mdc-checkbox__background">
                                            <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                                            </svg>
                                            <div class="mdc-checkbox__mixedmark"></div>
                                        </div>
                                    </div>
                                    <label for="hover-image-${image}">Hover</label>
                                </div>
                            </div>
                            <span class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon product-image__card-delete" title="Delete">delete</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static get_dialog_images() {

        if ( $('.product-image__card').length > 0 ) {

            let default_image = $('.product-image__card').find('.mdc-radio__native-control:checked')[0].value;
            let hover_image = $('.hover-image-check:checked').length > 0 ? $('.hover-image-check:checked')[0].value : "" ;

            let images = {
                default : default_image,
                hover : hover_image,
                all : default_image + (hover_image != "" ? ","+hover_image : "" )
            };

            $('.product-image__card').each(function() {
                const image = $(this).data('image');
    
                if (image !== default_image && image !== hover_image)
                    images.all += `,${image}`;
    
            })

    
            return images;
        } 

        return false;
            
    }

    static delete_dialog_image(button) {
        
        let item_is_checked = button.prev().find('.mdc-radio__native-control:checked').length > 0;

        let image_card = button.parentsUntil('.product-card').parent();

        deleted_images.push(image_card.attr('data-image'));

        image_card.remove();


        if( item_is_checked ) {
            $('.product-image__card').eq(0)
                // Seleccionar como predeterminada la imágen que quede como primera
                .find('.mdc-radio__native-control').prop('checked', true)
                // Ocultar checkbox de hover
                .parentsUntil('.mdc-card__action-buttons').siblings('.hover-image-field').addClass('hide')
                // Quitar selección del checkbox de hover
                .find('.hover-image-check').removeClass('active').addClass('hide').prop('checked', false)
        }

    }

    static clear_dialog_content() {
        product_form.trigger('reset');
        $('#product-form-media').html('');
        $('#info-imagenes').text('');
        $('option[value="congelado"]').prop({
            hidden : false,
            disabled : false
        });
    }

    static check_is_pollo() {
        let pollo_options = $('#product-form-pollo-options');
        let subcategory_hidden_option = $('#product-form-subcategory-option-hidden');

        if ($('#product-form-category').find('option:selected').val() == "pollo") {

            subcategory_hidden_option.prop('hidden', true).attr('selected', false);

            show(pollo_options);

            return true;

        } else {

            subcategory_hidden_option.prop('hidden', false).attr('selected', true);

            hide(pollo_options);

            return false;

        }

    }

    static set_hover_image(checkbox) {

        if ( checkbox.hasClass('active') ) {

            checkbox
                .removeClass('active')
                .prop('checked', false);

        } else {

            $('.hover-image-check')
                .removeClass('active')
                .prop('checked', false);

            checkbox
                .addClass('active')
                .prop('checked', true);

        }
    }
}