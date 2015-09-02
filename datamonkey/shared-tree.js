function set_shared_tree_handlers (tree) {
    $ ("[data-direction]").on ("click", function (e) {
        var which_function = $(this).data ("direction") == 'vertical' ? tree.spacing_x : tree.spacing_y;
        which_function (which_function () + (+ $(this).data ("amount"))).update();
    }); 


    $(".phylotree-layout-mode").on ("change", function (e) {
        if ($(this).is(':checked')) {
            if (tree.radial () != ($(this).data ("mode") == "radial")) {
                tree.radial (!tree.radial ()).placenodes().update ();
            }
        }
    });

    $(".phylotree-align-toggler").on ("change", function (e) {
        if ($(this).is(':checked')) {
            if (tree.align_tips ($(this).data ("align") == "right")) {
                tree.placenodes().update ();
            }
        }
    });
}
