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