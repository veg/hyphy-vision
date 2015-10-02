var root = this;

var datamonkey = function () {};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Datamonkey;
  }
  exports.datamonkey = datamonkey;
} else {
  root.datamonkey = datamonkey;
}

datamonkey.errorModal = function (msg) {
  $('#modal-error-msg').text(msg);
  $('#errorModal').modal();
}

datamonkey.export_csv_button = function(data) {
  data = d3.csv.format(data);
  if (data != null) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    pom.setAttribute('download', 'export.csv');
    pom.className = 'btn btn-default btn-sm';
    pom.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Download CSV';
    $("body").append(pom);
    pom.click();
    pom.remove();
  }
}

datamonkey.save_image = function(type, container) {

  var prefix = {
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    svg: "http://www.w3.org/2000/svg"
  }

  function get_styles(doc) {

    function process_stylesheet(ss) {
      try {
        if (ss.cssRules) {
          for (var i = 0; i < ss.cssRules.length; i++) {
            var rule = ss.cssRules[i];
            if (rule.type === 3) {
              // Import Rule
              process_stylesheet(rule.styleSheet);
            } else {
              // hack for illustrator crashing on descendent selectors
              if (rule.selectorText) {
                if (rule.selectorText.indexOf(">") === -1) {
                  styles += "\n" + rule.cssText;
                }
              }
            }
          }
        }
      } catch (e) {
        console.log('Could not process stylesheet : ' + ss);
      }
    }

    var styles = "",
        styleSheets = doc.styleSheets;

    if (styleSheets) {
      for (var i = 0; i < styleSheets.length; i++) {
        process_stylesheet(styleSheets[i]);
      }
    }

    return styles;

  }

  var convert_svg_to_png = function(image_string) {

    var image = document.getElementById("chart-image");

    image.onload = function() {
      var canvas = document.getElementById("chart-canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.fillStyle = "#FFFFFF";
      context.fillRect(0,0,image.width,image.height);
      context.drawImage(image, 0, 0);

      var img = canvas.toDataURL("image/png");
      var pom = document.createElement('a');
      pom.setAttribute('download', 'image.png');
      pom.href = canvas.toDataURL("image/png");     
      $("body").append(pom);
      pom.click();
      pom.remove();
    }

    image.src = image_string;

  }

  var svg = $(container).find("svg")[0];
  if (!svg) {
    svg = $(container)[0];
  }

  var styles = get_styles(window.document);

  svg.setAttribute("version", "1.1");

  var defsEl = document.createElement("defs");
  svg.insertBefore(defsEl, svg.firstChild); 

  var styleEl = document.createElement("style")
  defsEl.appendChild(styleEl);
  styleEl.setAttribute("type", "text/css");


  // removing attributes so they aren't doubled up
  svg.removeAttribute("xmlns");
  svg.removeAttribute("xlink");

  // These are needed for the svg
  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
  }

  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
  }

  var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
  var rect = svg.getBoundingClientRect();
  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
  var to_download = [doctype + source]
  var image_string = 'data:image/svg+xml;base66,' + encodeURIComponent(to_download);

  if(type == "png") {
    convert_svg_to_png(image_string);
  } else {
    var pom = document.createElement('a');
    pom.setAttribute('download', 'image.svg');
    pom.setAttribute('href', image_string);
    $("body").append(pom);
    pom.click();
    pom.remove();
  }

}

datamonkey.jobQueue = function(container) {

  // Load template
  _.templateSettings = {
    evaluate    : /\{\%(.+?)\%\}/g,
    interpolate : /\{\{(.+?)\}\}/g,
    variable    : "rc"
  };

  d3.json( '/jobqueue', function(data) {

    var job_queue = _.template(
      $("script.job-queue").html()
    );

    var job_queue_html = job_queue(data);
    $("#job-queue-panel").find('table').remove();
    $(container).append(job_queue_html);

  });

}

datamonkey.status_check = function () {

  // Check if there are any status checkers on the page
  if($(".status-checker").length) {
    // Check health status and report back to element
    var url = "/clusterhealth";
    d3.json(url, function(data) {
      // Add appropriate class based on result
      if (data["successful_connection"]) {
        d3.select('.status-checker').classed({'status-healthy': true, 'status-troubled': false})
        $(".status-checker").attr( "title", 'Cluster Status : Healthy');
      } else {
        d3.select('.status-checker').classed({'status-healthy': false, 'status-troubled': true})
        $(".status-checker").attr( "title", 'Cluster Status : Troubled; ' + data.msg.description);
      }
    });
  }
}

datamonkey.validate_date = function () {

  // Check that it is not empty
  if($(this).val().length == 0) {
    $(this).next('.help-block').remove();
    $(this).parent().removeClass('has-success');
    $(this).parent().addClass('has-error');

    jQuery('<span/>', {
          class: 'help-block',
          text : 'Field is empty'
      }).insertAfter($(this));

  } else if(isNaN(Date.parse($(this).val()))) {
    $(this).next('.help-block').remove();
    $(this).parent().removeClass('has-success');
    $(this).parent().addClass('has-error');

    jQuery('<span/>', {
          class: 'help-block',
          text : 'Date format should be in the format YYYY-mm-dd'
      }).insertAfter($(this));

  } else {
    $(this).parent().removeClass('has-error');
    $(this).parent().addClass('has-success');
    $(this).next('.help-block').remove();
  }

}

$( document ).ready( function () {
  $(function () {$('[data-toggle="tooltip"]').tooltip()});
  $('#datamonkey-header').collapse ();
  
  var initial_padding = $("body").css("padding-top");
  
  $("#collapse_nav_bar").on ("click", function (e) {
    $('#datamonkey-header').collapse ('toggle');
    $(this).find ("i").toggleClass ("fa-times-circle fa-eye");
    var new_padding =  $("body").css("padding-top") == initial_padding ? "5px" : initial_padding;
    d3.select ("body").transition ().style ("padding-top", new_padding);
  });
});


function datamonkey_alignment_viewer(options) {

  var self = this;

 function initialize(options) {
    if (!options) options = {};

    //-- Public
    self.container = $('div.seq-viewer');
    self.dataset = [];
    self.cell_size = 30;
    self.zoom = { low: 0.0, high: 1.0 };

    self.dataset = [
      "TREESPARROW_HENAN_1_2004",
      "HUMAN_VIETNAM_CL105_2005", 
      "TREESPARROW_HENAN_4_2004",
      "CHICKEN_HEBEI_326_2005",
      "CHICKEN_HONGKONG_915_97",
      "VIETNAM_3062_2004",
      "GOOSE_HONGKONG_W355_97",
      "DUCK_HONGKONG_Y283_97",
      "DUCK_VIETNAM_376_2005",
      "MALLARD_VIETNAM_16_2003",
      "CHICKEN_THAILAND_KANCHANABURI_CK_160_2005",
      "DUCK_GUANGZHOU_20_2005",
      "CK_HK_WF157_2003",
      "SWINE_ANHUI_2004",
      "DUCK_VIETNAM_272_2005",
      "HONGKONG_97_98",
      "GOOSE_SHANTOU_2216_2005",
      "TREESPARROW_HENAN_3_2004",
      "PEREGRINEFALCON_HK_D0028_2004",
      "TREESPARROW_HENAN_2_2004",
      "HONGKONG_538_97"
    ]

    //-- Private
    //self.xScale; 
    //self.yScale;
    //self.mean = 0;
    //self.tooltip;
    //self.infotip;

    draw();

  };


  function draw() {

    var width = $(window).width();
    var height = $(window).height() - Math.floor($('.navbar').height()*1.1);
    var offset = 15;
  
    //initial draw
    self.paper = d3.selectAll( self.container.selector )
      .append('svg')
        .attr("width", width)
        .attr("height", height);

    // Y Legend 
    var yAxisAttrs = { 'class'  : 'yAxis',
                       'height' : height,
                       'width'  : width
                     };

    self.yAxis = self.paper
      .append('g')
        .attr(yAxisAttrs);


    self.yAxisLabels = self.yAxis
      .append('g')
        .attr('class', 'sequence-labels');

    var legenedHLabel = self.yAxisLabels
        .selectAll('sequence-label')
          .data(self.dataset);

    var legenedHLabelAttrs = { 'class' : 'sequence-label',
                               'y' : function (d, i) { return i * self.cell_size + offset; },
                               'fill' : '#333',
                               'dominant-baseline' : 'central',
                               'text-anchor' : 'right',
                               'font-family' : '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif', };

    legenedHLabel.enter()
      .append('text')
        .attr(legenedHLabelAttrs)
        .text(function(d) { return d; });

    legenedHLabel.exit()
      .remove();

    self.xScale = d3.scale.linear()
        .domain([
                (function() {
                  if(d3.min(values) < 0) {
                    return (d3.min(values));
                  } else {
                    return (d3.max(values));
                  }
                })(),

                 (d3.max(values) + maxMean)*self.zoom.high
                 ])
        .range([0, width]);


    // X Legend 
    self.xAxis = d3.svg.axis()
        .scale(self.xScale)
        .orient('top')

    var xAxisHeaderAttrs = { 'class'     : 'xAxis header',
                             'height'    : 20,
                             'width'     : 2000,
                             'transform' : 'translate('+ (width) +', 0)', 
                           }

    self.xAxisHeader = self.paper
      .append('g')
        .attr(xAxisHeaderAttrs);

    self.xAxisHeader
      .style('fill', 'none')
      .call(self.xAxis);

    self.yScale = d3.scale.ordinal()
      .domain( d3.range(self.dataset.length) )
      .rangeRoundBands([0, height], 0.25);

    var xGridAttrs = { 'transform' : 'translate(0,'+ self.yScale(self.dataset.length) +')',
                       'fill' : '#ccc',
                       'font-size' : '12px',
                       'font-family' : '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif', };

    self.xAxisHeader
      .append('g')
        .attr('class', 'guide_lines_x')
        .call( self.xAxis.tickFormat('').tickSize(-height,0,0));

    var xAxisHeaderStyles = { 'fill' : '#000',
                              'font-size' : 12,
                              'font-family' : '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif'};

    self.xAxisHeader.selectAll('g.xAxis.header g text').style(xAxisHeaderStyles);
    var xAxisTickLineStyles = { 'stroke' : '#CCC', };
    self.xAxisHeader.selectAll('g.guide_lines_x g line').style(xAxisTickLineStyles);

  }


  initialize(options);
  return this;

}

datamonkey.alignment_viewer = datamonkey_alignment_viewer;

function datamonkey_cancel(self) {
    $(self).show().next().remove();
}

function datamonkey_change(value, self) {
    $(self).text (value)
        .show()
        .next().remove();
}

function datamonkey_check_valid_value (value, value_list, previous) {
    if (value.length) {
        if (value == previous) {
            return true;
        }
        if (value_list) {
            return !(value in value_list);
        }
        return true;
    }
    return false;
}

function datamonkey_editable(self, value_list, edit_group) {
    $(self).hide();
    
    if (edit_group) {
        edit_group.filter (function (d) {return d[1];}).forEach (function (d) {datamonkey_cancel (d[0]);});
        edit_group.forEach (function (d) {d[1] = d[0] === self;});
    }

    var div            = d3.select ($(self).parent()[0]).append ("div").classed ("input-group", true);
        text_field     = div.append ("input").style ("margin-right","1em"),
        button_ok      = div.append ("button").classed ("btn btn-primary btn-xs", true),
        button_cancel  = div.append ("button").classed ("btn btn-primary btn-xs", true),
        current_value  = $(self).text();

    button_ok.append ("i").classed ("glyphicon glyphicon-ok", true);
    button_cancel.append ("i").classed ("glyphicon glyphicon-remove", true);


    $(text_field[0]).val(current_value).on ("input propertychange", function (event) {
        button_ok.property ("disabled", !datamonkey_check_valid_value ($(this).val(), value_list,current_value));
    });

    button_ok.on ("click", function (event, datum) {
        datamonkey_change ($(text_field[0]).val(), self);
    });

    button_cancel.on ("click", function (event, datum) {
        datamonkey_cancel (self);
    });
}

datamonkey.editable = datamonkey_editable;

function datamonkey_get_styles(doc) {
  var styles = "",
      styleSheets = doc.styleSheets;

  if (styleSheets) {
    for (var i = 0; i < styleSheets.length; i++) {
      processStyleSheet(styleSheets[i]);
    }
  }

  function processStyleSheet(ss) {
    if (ss.cssRules) {
      for (var i = 0; i < ss.cssRules.length; i++) {
        var rule = ss.cssRules[i];
        if (rule.type === 3) {
          // Import Rule
          processStyleSheet(rule.styleSheet);
        } else {
          // hack for illustrator crashing on descendent selectors
          if (rule.selectorText) {
            if (rule.selectorText.indexOf(">") === -1) {
              styles += "\n" + rule.cssText;
            }
          }
        }
      }
    }
  }
  return styles;
}


function datamonkey_save_newick_to_file() {
  var top_modal_container = "#neighbor-tree-modal";
  var nwk = $(top_modal_container).data("tree");
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/octet-stream;charset=utf-8,' + encodeURIComponent(nwk));
  pom.setAttribute('download', 'nwk.txt');
  $("body").append(pom);
  pom.click();
  pom.remove();
}

function datamonkey_convert_svg_to_png(image_string) {
  var image = document.getElementById("image");
  image.src = image_string;

  image.onload = function() {
    var canvas = document.getElementById("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,image.width,image.height);
    context.drawImage(image, 0, 0);
    var img = canvas.toDataURL("image/png");

    var pom = document.createElement('a');
    pom.setAttribute('download', 'phylotree.png');
    pom.href = canvas.toDataURL("image/png");     
    $("body").append(pom);
    pom.click();
    pom.remove();
  }
}

function datamonkey_save_newick_tree(type) {

  var prefix = {
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    svg: "http://www.w3.org/2000/svg"
  }

  var tree_container = "#tree_container";
  var svg = $("#tree_container").find("svg")[0];
  var styles = datamonkey_get_styles(window.document);

  svg.setAttribute("version", "1.1");

  var defsEl = document.createElement("defs");
  svg.insertBefore(defsEl, svg.firstChild); 

  var styleEl = document.createElement("style")
  defsEl.appendChild(styleEl);
  styleEl.setAttribute("type", "text/css");


  // removing attributes so they aren't doubled up
  svg.removeAttribute("xmlns");
  svg.removeAttribute("xlink");

  // These are needed for the svg
  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
  }

  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
  }

  var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
  var rect = svg.getBoundingClientRect();
  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
  var to_download = [doctype + source]
  var image_string = 'data:image/svg+xml;base66,' + encodeURIComponent(to_download);

  if(type == "png") {
    datamonkey_convert_svg_to_png(image_string)
  } else {
    var pom = document.createElement('a');
    pom.setAttribute('download', 'phylotree.svg');
    pom.setAttribute('href', image_string);
    $("body").append(pom);
    pom.click();
    pom.remove();
  }

}

function datamonkey_validate_email(email) {
  if($(this).find("input[name='receive_mail']")[0].checked) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(regex.test($(this).find("input[name='mail']").val())) {
       // Give them green. They like that.
      $(this).removeClass('has-error');
      $(this).addClass('has-success');
      $(this).next('.help-block').remove();
    } else {
      $(this).next('.help-block').remove();
      $(this).removeClass('has-error');
      $(this).removeClass('has-success');
      $(this).addClass('has-error');
      var span = jQuery('<span/>', {
            class: 'help-block col-lg-9 pull-right',
            text : 'Invalid Email'
        }).insertAfter($(this));
    }
  } else {
    $(this).removeClass('has-error');
    $(this).removeClass('has-success');
    $(this).next('.help-block').remove();
  }

}

function datamonkey_describe_vector (vector, as_list) {

    vector.sort (d3.ascending);

    var d = {'min' : d3.min (vector),
             'max' : d3.max (vector),
             'median' : d3.median (vector),
             'Q1' : d3.quantile (vector, 0.25),
             'Q3' : d3.quantile (vector, 0.75),
             'mean': d3.mean (vector)};
             
    if (as_list) {
        
        d = "<pre>Range  :" + d['min'] + "-" + d['max'] + "\n"
            +    "IQR    :" + d['Q1'] + "-" + d['Q3'] + "\n"
            +    "Mean   :" + d['mean'] + "\n"
            +    "Median :" + d['median'] + "\n"
            + "</pre>";
        
        /*d =   
        "<dl class = 'dl-horizontal'>" + 
        "<dt>Range</dt><dd>" + d['min'] + "-" + d['max'] + "</dd>" + 
        "<dt>IQR</dt><dd>" + d['Q1'] + "-" + d['Q3'] +  "</dd>" +
        "<dt>Mean</dt><dd>" + d['mean'] +  "</dd>" +
        "<dt>Median</dt><dd>" + d['median'] + "</dd></dl>";*/
    }
    
    return d;
    
}

function datamonkey_export_handler (data, filename, mimeType) {
    var link = $('body').add('a');
    link.attr('download', filename || "download.tsv")
        .attr('href', 'data:' + (mimeType || 'text/plain')  +  ';charset=utf-8,' + encodeURIComponent(data))
        .click()
        .detach(); 
}
    

function datamonkey_table_to_text (table_id, sep) {
    sep = sep || "\t";
    var header_row = [];
    d3.select (table_id + " thead").selectAll ("th").each (function () {header_row.push (d3.select(this).text())});
    var data_rows = [];
    d3.select (table_id + " tbody").selectAll ("tr").each (function (d,i) {data_rows.push ([]); d3.select (this).selectAll ("td").each (function () {data_rows[i].push (d3.select(this).text())})});
    
    return header_row.join (sep) + "\n" +
           data_rows.map (function (d) {return d.join (sep);}).join ("\n");
}

function datamonkey_capitalize(s) {
  if(s.length > 0) {
    return s[0].toUpperCase() + s.slice(1);
  } else {
    return s;
  }
}

datamonkey.helpers = new Object;
datamonkey.helpers.save_newick_to_file = datamonkey_save_newick_to_file;
datamonkey.helpers.convert_svg_to_png = datamonkey_convert_svg_to_png;
datamonkey.helpers.save_newick_tree = datamonkey_save_newick_tree;
datamonkey.helpers.validate_email = datamonkey_validate_email;
datamonkey.helpers.describe_vector = datamonkey_describe_vector;
datamonkey.helpers.table_to_text = datamonkey_table_to_text;
datamonkey.helpers.export_handler = datamonkey_export_handler;
datamonkey.helpers.capitalize = datamonkey_capitalize;

function set_tree_handlers(tree_object) {
    $("[data-direction]").on("click", function(e) {
        var which_function = $(this).data("direction") == 'vertical' ? tree_object.spacing_x : tree_object.spacing_y;
        which_function(which_function() + (+$(this).data("amount"))).update();
    });


    $(".phylotree-layout-mode").on("change", function(e) {
        if ($(this).is(':checked')) {
            if (tree_object.radial() != ($(this).data("mode") == "radial")) {
                tree_object.radial(!tree_object.radial()).placenodes().update();
            }
        }
    });

    $(".phylotree-align-toggler").on("change", function(e) {
        if ($(this).is(':checked')) {
            if (tree_object.align_tips($(this).data("align") == "right")) {
                tree_object.placenodes().update();
            }
        }
    });

    $("#sort_original").on("click", function(e) {
        tree_object.resort_children(function(a, b) {
            return a["original_child_order"] - b["original_child_order"];
        });

        e.preventDefault();

    });

    $("#sort_ascending").on("click", function(e) {
        sort_nodes(true);
        e.preventDefault();
    });

    $("#sort_descending").on("click", function(e) {
        sort_nodes(false);
        e.preventDefault();
    });

    function sort_nodes(asc) {
        tree_object.traverse_and_compute(function(n) {
            var d = 1;
            if (n.children && n.children.length) {
                d += d3.max(n.children, function(d) {
                    return d["count_depth"];
                });
            }
            n["count_depth"] = d;
        });
        tree_object.resort_children(function(a, b) {
            return (a["count_depth"] - b["count_depth"]) * (asc ? 1 : -1);
        });
    }
}
var root = this;

if (!datamonkey) {
  datamonkey = function() {};
}

datamonkey.busted = function () {};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = datamonkey.busted;
  }
  exports.datamonkey.busted = datamonkey.busted;

} else {
  root.datamonkey.busted = datamonkey.busted;
}


function busted_render_summary(json) {

  var fit_format = d3.format (".2f"),
      prop_format = d3.format (".2p"),
      omega_format = d3.format (".3r");

  var format_run_time = function(seconds) {

    var duration_string = "";
    seconds = parseFloat (seconds);
    var split_array = [Math.floor (seconds/(24*3600)) ,Math.floor (seconds/3600) % 24, Math.floor (seconds/60) % 60,seconds % 60],
        quals = ["d.", "hrs.", "min.", "sec."];
        
    split_array.forEach (function (d,i) {
        if (d) {
            duration_string += " " + d + " " + quals[i];
        }
    });
    
    return duration_string;

  }

  var branch_p_values = {};
  
  var rate_distro_by_branch = {},
      branch_count = 0,
      selected_count = 0,
      tested_count = 0;
  
  var for_branch_table = [];
  
  //var tree_info = render_bs_rel_tree (json, "Unconstrained model");
  
  //var branch_lengths   = tree_info[0],
  //    tested_branches  = {};
  
  //var branch_omegas = tree_info[1];
  
  for (var p in json["test results"]) {
    branch_p_values[p] = json["test results"]["p"];
    if (branch_p_values[p] <= 0.05) {
        selected_count++;
    }
  }
  
  var fitted_distributions = json["fits"]["Unconstrained model"]["rate distributions"];
  
  for (var b in fitted_distributions) {
     //for_branch_table.push ([b + (tested_branches[b] ? "" : ""),branch_lengths[b],0,0,0]);
     try {
          for_branch_table[branch_count][2] = json["test results"][b]["LRT"];
          for_branch_table[branch_count][3] = json["test results"][b]["p"];
          for_branch_table[branch_count][4] = json["test results"][b]["uncorrected p"];
     } catch (e) {
     }
     
     var rateD = fitted_distributions[b];
     rate_distro_by_branch[b] = rateD; 
     //for_branch_table[branch_count].push (branch_omegas[b]['distro']);
     branch_count+=1;
  }
  
  // render summary data
  var total_tree_length =  d3.format("g")(json["fits"]["Unconstrained model"]["tree length"]); 
  
  for_branch_table = for_branch_table.sort (function (a,b) {return a[4]-b[4];});

  d3.select ('#summary-test-result').text (json['test results']['p'] <= 0.05 ? "evidence" : "no evidence");
  d3.select ('#summary-test-pvalue').text (d3.format(".3f")(json['test results']['p']));
  d3.select ('#summary-pmid').text ("PubMed ID " + json['PMID'])
                             .attr ("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);
  d3.select ('#summary-total-runtime').text (format_run_time(json['timers']['overall']));
  d3.select ('#summary-total-branches').text (branch_count);
  d3.select ('#summary-tested-branches').text (tested_count);
  d3.select ('#summary-selected-branches').text (selected_count);
  
  has_background = json['background'];
      
  var model_rows = [[],[]];
  
  if (has_background) {
      model_rows.push ([]);
  }
  
  for (k = 0; k < 2 + has_background; k++)  {

      var access_key,
          secondary_key,
          only_distro = 0;
          
      if (k == 0) {

          access_key = 'Unconstrained model';
          secondary_key = 'FG';
          model_rows[k].push ('Unconstrained Model');
          only_distro = 0;

      } else {

          if (has_background && k == 1) {
              model_rows[k].push ('(background branches)');
              secondary_key = 'BG';
              only_distro = 1;
          } else {
              access_key = 'Constrained model';
              if (! (access_key in json['fits'])) {
                break;
              }
              model_rows[k].push ('Constrained Model');                    
              secondary_key = 'FG';
              only_distro = 0;
          }
      }
      
      try {
        model_rows[k].push (only_distro ? '' : fit_format(json['fits'][access_key]['log-likelihood']));
        model_rows[k].push (only_distro ? '' : json['fits'][access_key]['parameters']);
        model_rows[k].push (only_distro ? '' : fit_format(json['fits'][access_key]['AIC-c']));
        model_rows[k].push (only_distro ? '' : format_run_time(json['fits'][access_key]['runtime']));
        model_rows[k].push (only_distro ? '' : fit_format(json['fits'][access_key]['tree length']));

        for (j = 0; j < 3; j++) {
         model_rows[k].push (   omega_format(json['fits'][access_key]['rate distributions'][secondary_key][j][0]) + " (" +
                                prop_format(json['fits'][access_key]['rate distributions'][secondary_key][j][1]) + ")");
        }
      } catch(e) {
        datamonkey.errorModal(e);
      }
  }
                             
  model_rows = d3.select ('#summary-model-table').selectAll ("tr").data (model_rows);
  model_rows.enter().append ('tr');
  model_rows.exit().remove ();
  model_rows = model_rows.selectAll ("td").data (function (d) {return d;});
  model_rows.enter().append ("td");
  model_rows.html (function (d) {return d;});
  
}

datamonkey.busted.render_summary = busted_render_summary;


var root = this;

datamonkey.hivtrace = function () {};

if (typeof exports !== 'undefined') {

  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = datamonkey.hivtrace;
  }

  exports.datamonkey.hivtrace = datamonkey.hivtrace;

} else {

  root.datamonkey.hivtrace = datamonkey.hivtrace;

}

if (!datamonkey) {
    var datamonkey = new Object;
}

datamonkey.absrel = function() {

    var width = 800, //$(container_id).width(),
        height = 600, //$(container_id).height()
        color_scheme = d3.scale.category10(),
        branch_omegas = {},
        branch_p_values = {},
        alpha_level = 0.05,
        omega_format = d3.format(".3r"),
        prop_format = d3.format(".2p"),
        fit_format = d3.format(".2f"),
        branch_table_format = d3.format(".4f"),
        render_color_bar = true,
        which_model = "Full model",
        color_legend_id = 'color_legend',
        self = this,
        container_id = 'tree_container';


    self.tree = d3.layout.phylotree("body")
        .size([height, width])
        .separation(function(a, b) {
            return 0;
        });

    self.analysis_data = null;

    self.svg = d3.select("#" + container_id).append("svg").attr("width", width)
        .attr("height", height);

    var scaling_exponent = 0.33;

    var omega_color = d3.scale.pow().exponent(scaling_exponent)
        .domain([0, 0.25, 1, 5, 10])
        .range(["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"])
        .clamp(true);


    // *** PHYLOTREE HANDLERS ***

    set_tree_handlers(self.tree);


    $("#datamonkey-absrel-color-or-grey").on("click", function(e) {
        if ($(self).data('color-mode') == 'gray') {
            $(self).data('color-mode', 'color');
            omega_color.range(["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"]);
        } else {
            $(self).data('color-mode', 'gray');
            omega_color.range(["#EEE", "#BBB", "#999", "#333", "#000"]);
        }
        branch_omegas = render_bs_rel_tree(self.analysis_data, which_model)[1];
        self.tree.update();
        render_color_scheme(color_legend_id);
    });

    $("#datamonkey-absrel-show-color-bar").on("click", function(e) {
        render_color_bar = !render_color_bar;
        if ($(self).data('color-bar') == 'on') {
            $(self).data('color-mode', 'off');
        } else {
            $(self).data('color-mode', 'on');
        }
        render_color_scheme(color_legend_id);
    });



    // *** MODEL HANDLERS ***
    $("#datamonkey-absrel-show-model").on("click", function(e) {
        if ($(self).data('model') == 'MG94') {
            $(self).data('model', 'Full model');
        } else {
            $(self).data('model', 'MG94');
        }
        which_model = $(self).data('model');
        branch_omegas = render_bs_rel_tree(self.analysis_data, which_model)[1];
        self.tree.layout();
    });

    function default_tree_settings() {
        self.tree.branch_length(null);
        self.tree.branch_name(null);
        self.tree.node_span('equal');
        self.tree.options({
            'draw-size-bubbles': false,
            'selectable': false,
            'transitions': false
        }, false);
        self.tree.font_size(18);
        self.tree.scale_bar_font_size(14);
        self.tree.node_circle_size(0);
        self.tree.spacing_x(35, true);

        //self.tree.style_nodes (node_colorizer);
        self.tree.style_edges(edge_colorizer);
        //self.tree.selection_label (current_selection_name);
    }

    function render_color_scheme(svg_container) {

        var svg = d3.select("#" + svg_container).selectAll("svg").data([omega_color.domain()]);
        svg.enter().append("svg");
        svg.selectAll("*").remove();

        if (render_color_bar) {
            var bar_width = 70,
                bar_height = 300,
                margins = {
                    'bottom': 30,
                    'top': 15,
                    'left': 40,
                    'right': 2
                };

            svg.attr("width", bar_width)
                .attr("height", bar_height);



            this_grad = svg.append("defs").append("linearGradient")
                .attr("id", "_omega_bar")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            var omega_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, 1]),
                axis_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, bar_height - margins['top'] - margins['bottom']]);


            omega_color.domain().forEach(function(d) {
                this_grad.append("stop")
                    .attr("offset", "" + omega_scale(d) * 100 + "%")
                    .style("stop-color", omega_color(d));
            });

            var g_container = svg.append("g").attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");

            g_container.append("rect").attr("x", 0)
                .attr("width", bar_width - margins['left'] - margins['right'])
                .attr("y", 0)
                .attr("height", bar_height - margins['top'] - margins['bottom'])
                .style("fill", "url(#_omega_bar)");


            var draw_omega_bar = d3.svg.axis().scale(axis_scale)
                .orient("left")
                .tickFormat(d3.format(".1r"))
                .tickValues([0, 0.01, 0.1, 0.5, 1, 2, 5, 10]);

            var scale_bar = g_container.append("g");
            scale_bar.style("font-size", "14")
                .attr("class", "omega-bar")
                .call(draw_omega_bar);

            scale_bar.selectAll("text")
                .style("text-anchor", "right");

            var x_label = _label = scale_bar.append("g").attr("class", "omega-bar");
            x_label = x_label.selectAll("text").data(["\u03C9"]);
            x_label.enter().append("text");
            x_label.text(function(d) {
                    return d
                })
                .attr("transform", "translate(" + (bar_width - margins['left'] - margins['right']) * 0.5 + "," + (bar_height - margins['bottom']) + ")")
                .style("text-anchor", "middle")
                .style("font-size", "18")
                .attr("dx", "0.0em")
                .attr("dy", "0.1em");
        }
    }

    function render_error(e) {
        $("#datamonkey-absrel-error-hide").on("click", function(e) {
            d3.select("#datamonkey-absrel-error").style("display", "none");
            e.preventDefault();
        });

        d3.select("#datamonkey-absrel-error-text").text(e);
        d3.select("#datamonkey-absrel-error").style('display', 'block');
        //console.log(e);
    }

    function make_plot_data(omegas, weights) {
        var data_to_plot = [],
            norm = weights.reduce(function(p, c) {
                return p + c;
            }, 0),
            mean = 0.;

        for (var i = 0; i < omegas.length; i++) {
            if (omegas[i] == null || weights[i] == null) {
                return;
            }

            var this_class = {
                'omega': omegas[i],
                'weight': weights[i] / norm
            };
            data_to_plot.push(this_class);
        }
        return data_to_plot;
    }

    function drawDistribution(node_name, omegas, weights, settings) {

        var svg_id = settings["svg"] || "primary_omega_plot",
            tag_id = settings["tag"] || "primary_omega_tag";

        var legend_id = settings["legend"] || null;
        var do_log_plot = settings["log"] || false;

        var dimensions = settings["dimensions"] || {
            "width": 600,
            "height": 400
        };

        var margins = {
                'left': 50,
                'right': 15,
                'bottom': 35,
                'top': 35
            },
            plot_width = dimensions["width"] - margins['left'] - margins['right'],
            plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

        var k_p = settings["k"] || null;


        var domain = settings["domain"] || d3.extent(omegas);


        var omega_scale = (do_log_plot ? d3.scale.log() : d3.scale.linear())
            .range([0, plot_width]).domain(domain).nice().clamp(true),
            proportion_scale = d3.scale.linear().range([plot_height, 0]).domain([0, 1]);




        // compute margins -- circle AREA is proportional to the relative weight
        // maximum diameter is (height - text margin)


        var data_to_plot = make_plot_data(omegas, weights);

        d3.select("#" + tag_id).text(node_name);

        var svg = d3.select("#" + svg_id).attr("width", dimensions.width)
            .attr("height", dimensions.height),
            plot = svg.selectAll(".container");

        if (plot.empty()) {
            plot = svg.append("g").attr("class", "container");
        }


        plot.attr("transform", "translate(" + margins["left"] + " , " + margins["top"] + ")");



        var omega_lines = plot.selectAll(".omega-line").data(data_to_plot);

        omega_lines.enter().append("line");
        omega_lines.exit().remove();
        omega_lines.transition().attr("x1", function(d) {
                return omega_scale(d.omega);
            })
            .attr("x2", function(d) {
                return omega_scale(d.omega);
            })
            .attr("y1", function(d) {
                return proportion_scale(0);
            })
            .attr("y2", function(d) {
                return proportion_scale(d.weight);
            })
            .style("stroke", function(d) {
                return omega_color(d.omega);
            })
            .attr("class", "omega-line");


        var neutral_line = plot.selectAll(".neutral-line").data([1]);
        neutral_line.enter().append("line").attr("class", "neutral-line");
        neutral_line.exit().remove();
        neutral_line.transition().attr("x1", function(d) {
                return omega_scale(d);
            })
            .attr("x2", function(d) {
                return omega_scale(d);
            })
            .attr("y1", 0)
            .attr("y2", plot_height);



        var xAxis = d3.svg.axis()
            .scale(omega_scale)
            .orient("bottom");



        if (do_log_plot) {
            xAxis.ticks(10, ".1r");
        }


        var x_axis = svg.selectAll(".x.axis");
        var x_label;
        if (x_axis.empty()) {
            x_axis = svg.append("g")
                .attr("class", "x axis");

            x_label = x_axis.append("g").attr("class", "axis-label x-label");
        } else {
            x_label = x_axis.select(".axis-label.x-label");
        }



        x_axis.attr("transform", "translate(" + margins["left"] + "," + (plot_height + margins["top"]) + ")")
            .call(xAxis);
        x_label = x_label.attr("transform", "translate(" + plot_width + "," + margins["bottom"] + ")")
            .selectAll("text").data(["\u03C9"]);
        x_label.enter().append("text");
        x_label.text(function(d) {
                return d
            })
            .style("text-anchor", "end")
            .attr("dy", "0.0em");



        var yAxis = d3.svg.axis()
            .scale(proportion_scale)
            .orient("left")
            .ticks(10, ".1p");

        var y_axis = svg.selectAll(".y.axis");
        var y_label;
        if (y_axis.empty()) {
            y_axis = svg.append("g")
                .attr("class", "y axis");

            y_label = y_axis.append("g").attr("class", "axis-label y-label");
        } else {
            y_label = y_axis.select(".axis-label.y-label");
        }



        y_axis.attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")")
            .call(yAxis);
        y_label = y_label.attr("transform", "translate(" + (-margins["left"]) + "," + 0 + ")")
            .selectAll("text").data(["Proportion of sites"]);
        y_label.enter().append("text");
        y_label.text(function(d) {
                return d
            })
            .style("text-anchor", "start")
            .attr("dy", "-1em")

    }

    function edge_colorizer(element, data) {

        var coloration = branch_omegas[data.target.name];
        if (coloration) {
            if ('color' in coloration) {
                element.style('stroke', coloration['color']);
            } else {
                element.style('stroke', 'url(#' + coloration['grad'] + ')');
                if (self.tree.radial()) {
                    d3.select('#' + coloration['grad']).attr("gradientTransform", "rotate(" + data.target.angle + ")");
                } else {
                    d3.select('#' + coloration['grad']).attr("gradientTransform", null);
                }
            }
            $(element[0][0]).tooltip({
                'title': coloration['tooltip'],
                'html': true,
                'trigger': 'hover',
                'container': 'body',
                'placement': 'auto'
            });
        }

        element.style('stroke-width', branch_p_values[data.target.name] <= alpha_level ? '12' : '5')
            .style('stroke-linejoin', 'round')
            .style('stroke-linecap', 'round');

    }

    function create_gradient(svg_defs, grad_id, rateD, already_cumulative) {
        var this_grad = svg_defs.append("linearGradient")
            .attr("id", grad_id);

        var current_weight = 0;
        rateD.forEach(function(d, i) {
            if (d[1]) {
                var new_weight = current_weight + d[1];
                this_grad.append("stop")
                    .attr("offset", "" + current_weight * 100 + "%")
                    .style("stop-color", omega_color(d[0]));
                this_grad.append("stop")
                    .attr("offset", "" + new_weight * 100 + "%")
                    .style("stop-color", omega_color(d[0]));
                current_weight = new_weight;
            }
        });
    }

    function render_bs_rel_tree(json, model_id) {

        self.tree(json["fits"][model_id]["tree string"]).svg(self.svg);

        var svg_defs = self.svg.selectAll("defs");
        if (svg_defs.empty()) {
            svg_defs = self.svg.append("defs");
        }
        svg_defs.selectAll("*").remove();

        gradID = 0;
        var local_branch_omegas = {};

        var fitted_distributions = json["fits"][model_id]["rate distributions"];

        for (var b in fitted_distributions) {
            // Quick inf and nan quick fix 
            fitted_distributions[b] = fitted_distributions[b].replace(/inf/g, '1e+9999');
            fitted_distributions[b] = fitted_distributions[b].replace(/-nan/g, 'null');
            fitted_distributions[b] = fitted_distributions[b].replace(/nan/g, 'null');

            var rateD = JSON.parse(fitted_distributions[b]);
            if (rateD.length == 1) {
                local_branch_omegas[b] = {
                    'color': omega_color(rateD[0][0])
                };
            } else {
                gradID++;
                var grad_id = "branch_gradient_" + gradID;
                create_gradient(svg_defs, grad_id, rateD);
                local_branch_omegas[b] = {
                    'grad': grad_id
                };
            }
            local_branch_omegas[b]['omegas'] = rateD;
            local_branch_omegas[b]['tooltip'] = "<b>" + b + "</b>";
            local_branch_omegas[b]['distro'] = "";
            rateD.forEach(function(d, i) {
                var omega_value = d[0] > 1e20 ? "&infin;" : omega_format(d[0]),
                    omega_weight = prop_format(d[1]);

                local_branch_omegas[b]['tooltip'] += "<br/>&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
                    " (" + omega_weight + ")";
                if (i) {
                    local_branch_omegas[b]['distro'] += "<br/>";
                }
                local_branch_omegas[b]['distro'] += "&omega;<sub>" + (i + 1) + "</sub> = " + omega_value +
                    " (" + omega_weight + ")";
            });
            local_branch_omegas[b]['tooltip'] += "<br/><i>p = " + omega_format(json["test results"][b]["p"]) + "</i>";
        }

        self.tree.style_edges(function(element, data) {
            edge_colorizer(element, data);
        });
        branch_lengths = {};
        self.tree.get_nodes().forEach(function(d) {
            if (d.parent) {
                branch_lengths[d.name] = self.tree.branch_length()(d);
            }
        });

        return [branch_lengths, local_branch_omegas];
    }

    var render_bs_rel = function(json) {

        try {
            d3.select("#datamonkey-absrel-error").style('display', 'none');

            self.analysis_data = json;

            function make_distro_plot(d) {
                if (Object.keys(rate_distro_by_branch).indexOf(d[0]) != -1) {
                    drawDistribution(d[0],
                        rate_distro_by_branch[d[0]].map(function(r) {
                            return r[0];
                        }),
                        rate_distro_by_branch[d[0]].map(function(r) {
                            return r[1];
                        }), {
                            'log': true,
                            'legend': false,
                            'domain': [0.00001, 10],
                            'dimensions': {
                                'width': 400,
                                'height': 400
                            }
                        });
                }
            }

            default_tree_settings();



            branch_p_values = {};

            var rate_distro_by_branch = {},
                branch_count = 0,
                selected_count = 0,
                tested_count = 0;

            var for_branch_table = [];

            var tree_info = render_bs_rel_tree(json, "Full model");

            var branch_lengths = tree_info[0],
                tested_branches = {};

            branch_omegas = tree_info[1];

            for (var p in json["test results"]) {
                branch_p_values[p] = json["test results"][p]["p"];
                if (branch_p_values[p] <= 0.05) {
                    selected_count++;
                }
                if (json["test results"][p]["tested"] > 0) {
                    tested_branches[p] = true;
                    tested_count += 1;
                }
            }

            var fitted_distributions = json["fits"]["Full model"]["rate distributions"];

            for (var b in fitted_distributions) {
                for_branch_table.push([b + (tested_branches[b] ? "" : " (not tested)"), branch_lengths[b], 0, 0, 0]);
                try {
                    for_branch_table[branch_count][2] = json["test results"][b]["LRT"];
                    for_branch_table[branch_count][3] = json["test results"][b]["p"];
                    for_branch_table[branch_count][4] = json["test results"][b]["uncorrected p"];
                } catch (e) {}

                var rateD = (JSON.parse(fitted_distributions[b]));
                rate_distro_by_branch[b] = rateD;
                for_branch_table[branch_count].push(branch_omegas[b]['distro']);
                branch_count += 1;
            }



            render_color_scheme(color_legend_id);

            // render summary data

            var total_tree_length = json["fits"]["Full model"]["tree length"];

            for_branch_table = for_branch_table.sort(function(a, b) {
                return a[4] - b[4];
            });
            make_distro_plot(for_branch_table[0]);

            for_branch_table = d3.select('#table-branch-table').selectAll("tr").data(for_branch_table);
            for_branch_table.enter().append('tr');
            for_branch_table.exit().remove();
            for_branch_table.style('font-weight', function(d) {
                return d[3] <= 0.05 ? 'bold' : 'normal';
            });
            for_branch_table.on("click", function(d) {
                make_distro_plot(d);
            });
            for_branch_table = for_branch_table.selectAll("td").data(function(d) {
                return d;
            });
            for_branch_table.enter().append("td");
            for_branch_table.html(function(d) {
                if (typeof d == "number") {
                    return branch_table_format(d);
                }
                return d;
            });


            d3.select('#summary-method-name').text(json['version']);
            d3.select('#summary-pmid').text("PubMed ID " + json['PMID'])
                .attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);
            d3.select('#summary-total-runtime').text(format_run_time(json['timers']['overall']));
            d3.select('#summary-complexity-runtime').text(format_run_time(json['timers']['overall']));
            d3.select('#summary-complexity-runtime').text(format_run_time(json['timers']['Complexity analysis']));
            d3.select('#summary-testing-runtime').text(format_run_time(json['timers']['Testing']));
            d3.select('#summary-total-branches').text(branch_count);
            d3.select('#summary-tested-branches').text(tested_count);
            d3.select('#summary-selected-branches').text(selected_count);

            var model_rows = [
                [],
                []
            ];

            for (k = 0; k < 2; k++) {
                var access_key;
                if (k == 0) {
                    access_key = 'MG94';
                    model_rows[k].push('Branch-wise &omega; variation (MG94)');
                } else {
                    access_key = 'Full model';
                    model_rows[k].push('Branch-site &omega; variation');
                }
                model_rows[k].push(fit_format(json['fits'][access_key]['log-likelihood']));
                model_rows[k].push(json['fits'][access_key]['parameters']);
                model_rows[k].push(fit_format(json['fits'][access_key]['AIC-c']));
                model_rows[k].push(format_run_time(json['fits'][access_key]['runtime']));
            }

            model_rows = d3.select('#summary-model-table').selectAll("tr").data(model_rows);
            model_rows.enter().append('tr');
            model_rows.exit().remove();
            model_rows = model_rows.selectAll("td").data(function(d) {
                return d;
            });
            model_rows.enter().append("td");
            model_rows.html(function(d) {
                return d;
            });

            d3.select('#summary-tree-length').text(fit_format(json["fits"]["Full model"]["tree length"]));
            d3.select('#summary-tree-length-mg94').text(fit_format(json["fits"]["MG94"]["tree length"]));


            var by_rate_class_count = {};
            self.tree.get_nodes().forEach(function(d) {
                if (d.parent) {
                    var rc = rate_distro_by_branch[d.name].length;
                    if (!(rc in by_rate_class_count)) {
                        by_rate_class_count[rc] = [rc, 0, 0, 0];
                    }
                    by_rate_class_count[rc][1]++;
                    by_rate_class_count[rc][2] += self.tree.branch_length()(d);
                    if (json["test results"][d.name]["p"] <= 0.05) {
                        by_rate_class_count[rc][3]++;
                    }
                }
            });
            var by_rate_class_count_array = [];
            for (k in by_rate_class_count) {
                d = by_rate_class_count[k];
                by_rate_class_count_array.push([d[0], d[1], prop_format(d[1] / branch_count), prop_format(d[2] / total_tree_length), d[3]]);
            };

            by_rate_class_count_array = by_rate_class_count_array.sort(function(a, b) {
                return a[0] - b[0];
            });
            by_rate_class_count_array = d3.select('#summary-tree-table').selectAll("tr").data(by_rate_class_count_array);
            by_rate_class_count_array.enter().append('tr');
            by_rate_class_count_array.exit().remove();
            by_rate_class_count_array = by_rate_class_count_array.selectAll("td").data(function(d) {
                return d;
            });
            by_rate_class_count_array.enter().append("td");
            by_rate_class_count_array.html(function(d) {
                return d;
            });

            self.tree.layout();

        } catch (e) {
            render_error(e.message);
        }

    }

    function format_run_time(seconds) {
        var duration_string = "";
        seconds = parseFloat(seconds);
        var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
            quals = ["d.", "hrs.", "min.", "sec."];

        split_array.forEach(function(d, i) {
            if (d) {
                duration_string += " " + d + " " + quals[i];
            }
        });

        return duration_string;
    }



    return render_bs_rel;

}

function busted_draw_distribution(node_name, omegas, weights, settings) {

  var make_plot_data = function(omegas, weights) {

    var data_to_plot = [],
        norm  = weights.reduce (function (p, c) {return p + c;}, 0),
        mean  = 0.;
                
    for (var i = 0; i < omegas.length; i++) {

      if (omegas[i] == null || weights[i] == null) {
          return;
      }

      var this_class = {'omega' : omegas[i], 'weight' : weights[i]/norm};
      data_to_plot.push (this_class);

    }

    return data_to_plot;

  }


  var svg_id = settings["svg"] || "primary-omega-plot",
      tag_id = settings["tag"] || "primary-omega-tag";

  var legend_id   = settings["legend"] || null;
  var do_log_plot = settings["log"]    || false;

  var dimensions = settings["dimensions"] || {
    "width"  : 300,
    "height" : 200
  };

  var margins = {
      'left'   : 50,
      'right'  : 15,
      'bottom' : 35,
      'top'    : 35
    },

    plot_width = dimensions["width"] - margins['left'] - margins['right'],
    plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

  var k_p = settings["k"] || null;
  var domain = settings["domain"] || d3.extent(omegas);

  var omega_scale = (do_log_plot ? d3.scale.log() : d3.scale.linear())
    .range([0, plot_width]).domain(domain).nice().clamp(true),
    proportion_scale = d3.scale.linear().range([plot_height, 0]).domain([0, 1]);

  // compute margins -- circle AREA is proportional to the relative weight
  // maximum diameter is (height - text margin)
  var data_to_plot = make_plot_data(omegas, weights);

  d3.select("#" + tag_id).text(node_name);

  var svg = d3.select("#" + svg_id).attr("width", dimensions.width)
    .attr("height", dimensions.height),
    plot = svg.selectAll(".container");

  if (plot.empty()) {
    plot = svg.append("g").attr("class", "container");
  }


  plot.attr("transform", "translate(" + margins["left"] + " , " + margins["top"] + ")");

  var scaling_exponent = 0.33;       
  var omega_color = d3.scale.pow().exponent(scaling_exponent)                    
                      .domain([0, 0.25, 1, 5, 10])
                      .range([ "#5e4fa2", "#3288bd", "#e6f598","#f46d43","#9e0142"])
                      .clamp(true);


  var omega_lines = plot.selectAll(".omega-line").data(data_to_plot);
  omega_lines.enter().append("line");
  omega_lines.exit().remove();
  omega_lines.transition().attr("x1", function(d) {
    return omega_scale(d.omega);
  })
  .attr("x2", function(d) {
    return omega_scale(d.omega);
  })
  .attr("y1", function(d) {
    return proportion_scale(0);
  })
  .attr("y2", function(d) {
    return proportion_scale(d.weight);
  })
  .style("stroke", function(d) {
    return omega_color(d.omega);
  })
  .attr("class", "omega-line");

  var neutral_line = plot.selectAll(".neutral-line").data([1]);
  neutral_line.enter().append("line").attr("class", "neutral-line");
  neutral_line.exit().remove();
  neutral_line.transition().attr("x1", function(d) {
    return omega_scale(d);
  })
    .attr("x2", function(d) {
      return omega_scale(d);
    })
    .attr("y1", 0)
    .attr("y2", plot_height);



  var xAxis = d3.svg.axis()
    .scale(omega_scale)
    .orient("bottom");



  if (do_log_plot) {
    xAxis.ticks(10, ".1r");
  }


  var x_axis = svg.selectAll(".x.axis");
  var x_label;
  if (x_axis.empty()) {
    x_axis = svg.append("g")
      .attr("class", "x axis");

    x_label = x_axis.append("g").attr("class", "axis-label x-label");
  } else {
    x_label = x_axis.select(".axis-label.x-label");
  }



  x_axis.attr("transform", "translate(" + margins["left"] + "," + (plot_height + margins["top"]) + ")")
    .call(xAxis);
  x_label = x_label.attr("transform", "translate(" + plot_width + "," + margins["bottom"] + ")")
    .selectAll("text").data(["\u03C9"]);
  x_label.enter().append("text");
  x_label.text(function(d) {
    return d
  })
    .style("text-anchor", "end")
    .attr("dy", "0.0em");



  var yAxis = d3.svg.axis()
    .scale(proportion_scale)
    .orient("left")
    .ticks(10, ".1p");

  var y_axis = svg.selectAll(".y.axis");
  var y_label;
  if (y_axis.empty()) {
    y_axis = svg.append("g")
      .attr("class", "y axis");

    y_label = y_axis.append("g").attr("class", "axis-label y-label");
  } else {
    y_label = y_axis.select(".axis-label.y-label");
  }

  y_axis.attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")")
    .call(yAxis);
  y_label = y_label.attr("transform", "translate(" + (-margins["left"]) + "," + 0 + ")")
    .selectAll("text").data(["Proportion of sites"]);
  y_label.enter().append("text");
  y_label.text(function(d) {
    return d
  })
    .style("text-anchor", "start")
    .attr("dy", "-1em")

}

datamonkey.busted.draw_distribution = busted_draw_distribution;

function busted_render_histogram(c, json) {

  var self = this;

  // Massage data for use with crossfilter
  if (d3.keys (json ["evidence ratios"]).length == 0) { // no evidence ratios computed
    d3.selectAll (c).style ("display", "none");
    d3.selectAll (".dc-data-table").style ("display", "none");
    d3.selectAll ('[id^="export"]').style ("display", "none");
    d3.selectAll ("#er-thresholds").style ("display", "none");
    d3.selectAll ("#apply-thresholds").style ("display", "none");
    return;
  } else {
    d3.selectAll (c).style ("display", "block");
    d3.selectAll (".dc-data-table").style ("display", "table");
    d3.selectAll ('[id^="export"]').style ("display", "block");
    d3.selectAll ("#er-thresholds").style ("display", "block");
    d3.selectAll ("#apply-thresholds").style ("display", "block");
  }

  var erc = json["evidence ratios"]["constrained"][0];
  erc = erc.map(function(d) { return Math.log(d)})

  var test_set = json["test set"].split(",");
  var model_results = [];

  erc.forEach(function(elem, i) { 
    model_results.push({
      "site_index"          : i + 1,
      "unconstrained"       : json["profiles"]["unconstrained"][0][i],
      "constrained"         : json["profiles"]["constrained"][0][i],
      "optimized_null"      : json["profiles"]["optimized null"][0][i],
      "er_constrained"      : Math.log(json["evidence ratios"]["constrained"][0][i]),
      "er_optimized_null"   : Math.log(json["evidence ratios"]["optimized null"][0][i])
    })

  });

  var data = crossfilter(model_results);
  var site_index = data.dimension(function(d) { return d["site_index"]; });

  var sitesByConstrained = site_index.group().reduce(
    function (p, v) {
      p.constrained_evidence += +v["er_constrained"];
      p.optimized_null_evidence += +v["er_optimized_null"];
      return p;
    },
    function (p, v) {
      p.constrained_evidence -= +v["er_constrained"];
      p.optimized_null_evidence -= +v["er_optimized_null"];
      return p;
    },
    function () {
      return { constrained_evidence : 0, optimized_null_evidence : 0 };
    }
  );

  var sitesByON = site_index.group().reduce(
    function (p, v) {
      p.optimized_null_evidence += +v["er_optimized_null"];
      return p;
    },
    function (p, v) {
      p.optimized_null_evidence -= +v["er_optimized_null"];
      return p;
    },
    function () {
      return { optimized_null_evidence : 0 };
    }
  );
  
  // Set up new crossfilter dimensions to slice the table by constrained or ON evidence ratio.
  var er_constrained = data.dimension(function(d) { return d["er_constrained"]; });
  var er_optimized_null = data.dimension(function(d) { return d["er_optimized_null"]; });
  self.er_constrained = er_constrained
  self.er_optimized_null = er_optimized_null


  var composite = dc.compositeChart(c);

  composite
      .width(1170)
      .height(300)
      .dimension(site_index)
      .x(d3.scale.linear().domain([1, erc.length]))
      .yAxisLabel("2 * Ln Evidence Ratio")
      .xAxisLabel("Site Location")
      .legend(dc.legend().x(1020).y(20).itemHeight(13).gap(5))
      .renderHorizontalGridLines(true)
      .compose([
        dc.lineChart(composite)
          .group(sitesByConstrained, "Constrained")
          .colors(d3.scale.ordinal().range(['green']))
          .valueAccessor(function(d) {
              return 2 * d.value.constrained_evidence;
          })
          .keyAccessor(function(d) {
              return d.key;
          }), 
        dc.lineChart(composite)
          .group(sitesByON, "Optimized Null")
          .valueAccessor(function(d) {
              return 2 * d.value.optimized_null_evidence;
          })
          .keyAccessor(function(d) {
              return d.key;
          })
          .colors(d3.scale.ordinal().range(['red']))
      ]);

  composite.xAxis().ticks(50);

  var numberFormat = d3.format(".4f");

  // Render the table
  dc.dataTable(".dc-data-table")
      .dimension(site_index)
      // data table does not use crossfilter group but rather a closure
      // as a grouping function
      .group(function (d) {
        return site_index.bottom(1)[0].site_index + " - " + site_index.top(1)[0].site_index;
      })
      .size(site_index.groupAll().reduceCount().value()) // (optional) max number of records to be shown, :default = 25
      // dynamic columns creation using an array of closures
      .columns([
          function (d) {
              return d.site_index;
          },
          function (d) {
              return numberFormat(d["unconstrained"]);
          },
          function (d) {
              return numberFormat(d["constrained"]);
          },
          function (d) {
              return numberFormat(d["optimized_null"]);
          },
          function (d) {
              return numberFormat(d["er_constrained"]);
          },
          function (d) {
              return numberFormat(d["er_optimized_null"]);
          },

      ])

      // (optional) sort using the given field, :default = function(d){return d;}
      .sortBy(function (d) {
          return d.site_index;
      })

      // (optional) sort order, :default ascending
      .order(d3.ascending)

      // (optional) custom renderlet to post-process chart using D3
      .renderlet(function (table) {
          table.selectAll(".dc-table-group").classed("info", true);
      });

  $("#export-csv").on('click', function(e) { datamonkey.export_csv_button(site_index.top(Infinity)); } );

  $("#export-chart-svg").on('click', function(e) { 
    // class manipulation for the image to display correctly
    $("#chart-id").find("svg")[0].setAttribute("class", "dc-chart");
    datamonkey.save_image("svg", "#chart-id"); 
    $("#chart-id").find("svg")[0].setAttribute("class", "");
  });

  $("#export-chart-png").on('click', function(e) { 
    // class manipulation for the image to display correctly
    $("#chart-id").find("svg")[0].setAttribute("class", "dc-chart");
    datamonkey.save_image("png", "#chart-id"); 
    $("#chart-id").find("svg")[0].setAttribute("class", "");
  });
  $("#apply-thresholds").on('click', function(e) { 
    var erConstrainedThreshold = document.getElementById("er-constrained-threshold").value;
    var erOptimizedNullThreshold = document.getElementById("er-optimized-null-threshold").value;
    self.er_constrained.filter(function(d) { return d >= erConstrainedThreshold; });
    self.er_optimized_null.filter(function(d) { return d >= erOptimizedNullThreshold; });
    dc.renderAll();
  });


  dc.renderAll();

}

datamonkey.busted.render_histogram = busted_render_histogram;

function busted_render_tree(container_id, container, json) {

  var width  = 600,
      height = 600,
      color_scheme = d3.scale.category10(),
      branch_omegas = {},
      branch_p_values = {},
      alpha_level = 0.05,
      omega_format = d3.format (".3r"),
      prop_format = d3.format (".2p"),
      branch_table_format = d3.format (".4f"),
      analysis_data = null,
      render_color_bar = true,
      which_model = "Constrained model",
      color_legend_id = 'color_legend';

  var tree = d3.layout.phylotree(container)
      .size([height, width])
      .separation (function (a,b) {return 0;});


  var svg = d3.select(container_id).append("svg")
      .attr("width", width)
      .attr("height", height);

  var scaling_exponent = 0.33;       

  var omega_color = d3.scale.pow().exponent(scaling_exponent)                    
                      .domain([0, 0.25, 1, 5, 10])
                      .range([ "#5e4fa2", "#3288bd", "#e6f598","#f46d43","#9e0142"])
                      .clamp(true);


  $("#expand_spacing").on("click", function (e) {
    tree.spacing_x(tree.spacing_x() + 1).update(true);
  });

  $("#compress_spacing").on ("click", function (e) {
    tree.spacing_x(tree.spacing_x() - 1).update(true);
  })

  $("#color_or_grey").on("click", function (e) {

    if ($(this).data ('color-mode') == 'gray') {
      $(this).data ('color-mode', 'color');
      d3.select (this).text ("Use grayscale");
      omega_color.range([ "#5e4fa2", "#3288bd", "#e6f598","#f46d43","#9e0142"]);
    } else {
      $(this).data ('color-mode', 'gray');
      d3.select (this).text ("Use color");
      omega_color.range(["#EEE", "#BBB","#999","#333","#000"]);    
    }

    branch_omegas = render_bs_rel_tree(analysis_data, which_model)[1];

    tree.update();
    e.preventDefault();

  });

  $("#show_color_bar").on("click", function (e) {

     render_color_bar = !render_color_bar;

     if ($(this).data ('color-bar') == 'on') {
        $(this).data ('color-mode', 'off');
        d3.select (this).html ("Show &omega; color legend");
    } else {
        $(this).data ('color-mode', 'on');
        d3.select (this).html ("Hide &omega; color legend");
    }

    render_color_scheme(color_legend_id);
    e.preventDefault();

  });

  $("#show_model").on ("click", function (e) {
     if ($(this).data ('model') == 'Unconstrained') {
        $(this).data ('model', 'Unconstrained model');
        d3.select (this).html ("Show Unconstrained model Model");
    } else {
        $(this).data ('model', 'Constrained model');
        d3.select (this).html("Show Branch-site Model");
    }
    which_model = $(this).data ('model');
    branch_omegas = render_bs_rel_tree(analysis_data, which_model)[1];
    tree.layout();
    e.preventDefault();
  });

  function render_color_scheme(svg_container) {
      console.log(omega_color);
      var svg = d3.select ("#" + svg_container).selectAll ("svg").data ([omega_color.domain()]);
      svg.enter().append ("svg");
      svg.selectAll ("*").remove();
     
      if (render_color_bar) {
          var bar_width  = 70,
              bar_height = 300,
              margins = {'bottom' : 30,
                         'top'    : 15,
                         'left'   : 40,
                         'right'  : 2};
                         
          svg.attr ("width", bar_width)
             .attr ("height", bar_height);
         
         
      
          this_grad = svg.append ("defs").append ("linearGradient")
                      .attr ("id", "_omega_bar")
                      .attr ("x1", "0%")
                      .attr ("y1", "0%")
                      .attr ("x2", "0%")
                      .attr ("y2", "100%");
         
          var omega_scale = d3.scale.pow().exponent(scaling_exponent)                    
                           .domain(d3.extent (omega_color.domain()))
                           .range ([0,1]),
              axis_scale = d3.scale.pow().exponent(scaling_exponent)                    
                           .domain(d3.extent (omega_color.domain()))
                           .range ([0,bar_height - margins['top']-margins['bottom']]);
                       
                      
         omega_color.domain().forEach (function (d) { 
          this_grad.append ("stop")
                   .attr ("offset",  "" + omega_scale (d) * 100 + "%")
                   .style ("stop-color", omega_color (d));
         });
     
         var g_container = svg.append ("g").attr ("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");
     
         g_container.append ("rect").attr ("x", 0)
                            .attr ("width", bar_width - margins['left']-margins['right'])
                            .attr ("y", 0)
                            .attr ("height", bar_height - margins['top']-margins['bottom'])
                            .style ("fill", "url(#_omega_bar)");
   
     
          var draw_omega_bar  =  d3.svg.axis().scale(axis_scale)
                                   .orient ("left")
                                   .tickFormat (d3.format(".1r"))
                                   .tickValues ([0,0.01,0.1,0.5,1,2,5,10]);
                               
          var scale_bar = g_container.append("g");
          scale_bar.style ("font-size", "14")
                         .attr  ("class", "omega-bar")
                         .call (draw_omega_bar);
                     
          scale_bar.selectAll ("text")
                         .style ("text-anchor", "right");
                     
          var x_label =_label = scale_bar.append ("g").attr("class", "omega-bar");
          x_label = x_label.selectAll("text").data(["\u03C9"]);
          x_label.enter().append ("text");
          x_label.text (function (d) {return d})
                  .attr  ("transform", "translate(" + ( bar_width - margins['left']-margins['right'])*0.5 + "," + (bar_height - margins['bottom']) + ")")
                  .style ("text-anchor", "middle")
                  .style ("font-size", "18")
                  .attr ("dx", "0.0em")
                  .attr ("dy", "0.1em");
      }               
  }        

  function render_bs_rel_tree(json, model_id) {

    tree(json["fits"][model_id]["tree string"]).svg(svg);
   
    var svg_defs = svg.selectAll ("defs");

    if (svg_defs.empty()) {
      svg_defs = svg.append ("defs");
    }

    svg_defs.selectAll ("*").remove();
    gradID = 0;

    var local_branch_omegas = {};
    var fitted_distributions = json["fits"][model_id]["rate distributions"];
    
    for (var b in fitted_distributions) {       

       var rateD = fitted_distributions[b];

       if (rateD.length == 1) {
          local_branch_omegas[b] = {'color': omega_color (rateD[0][0])};
       } else {
          gradID ++;
          var grad_id = "branch_gradient_" + gradID;
          //create_gradient (svg_defs, grad_id, rateD);
          local_branch_omegas[b] = {'grad' : grad_id};
       }

       local_branch_omegas[b]['omegas'] = rateD;
       local_branch_omegas[b]['tooltip'] = "<b>" + b + "</b>";
       local_branch_omegas[b]['distro'] = "";

       rateD.forEach (function (d,i) {
           var omega_value = d[0] > 1e20 ? "&infin;" : omega_format (d[0]),
               omega_weight = prop_format (d[1]);
       
           local_branch_omegas[b]['tooltip'] += "<br/>&omega;<sub>" + (i+1) + "</sub> = " + omega_value + 
                                          " (" + omega_weight + ")";
           if (i) {
               local_branch_omegas[b]['distro'] += "<br/>";
           }                               
           local_branch_omegas[b]['distro'] += "&omega;<sub>" + (i+1) + "</sub> = " + omega_value + 
                                           " (" + omega_weight + ")";
        });
        local_branch_omegas[b]['tooltip'] += "<br/><i>p = " + omega_format (json["test results"]["p"]) + "</i>";
    }    
    
    tree.style_edges(function (element, data) {
      edge_colorizer (element, data);
    });

    branch_lengths = {};
    tree.get_nodes().forEach(function (d) {if (d.parent) {branch_lengths[d.name] = tree.branch_length()(d);}});
    tree.layout();
    return [branch_lengths, local_branch_omegas];
  }


  function edge_colorizer(element, data) {

    var coloration = branch_omegas[data.target.name];
    if (coloration) {
      if ('color' in coloration) {
        element.style ('stroke', coloration['color']);
      } else {
        element.style ('stroke', 'url(#' + coloration['grad'] + ')');
      }

      $(element[0][0]).tooltip({'title' : coloration['tooltip'], 'html' : true, 'trigger' : 'hover', 'container' : 'body', 'placement' : 'auto'});

    }

    // Color the FG a different color
    var is_foreground = false;

    if(global_test_set.indexOf(data.target.name) != -1) {
      is_foreground = true;
    }

    element.style ('stroke-width', branch_p_values[data.target.name] <= alpha_level ? '12' : '5')
           .style ('stroke', is_foreground ? 'red' : 'gray')
           .style ('stroke-linejoin', 'round')
           .style ('stroke-linejoin', 'round')
           .style ('stroke-linecap', 'round');
    
  }

  $("#export-phylo-png").on('click', function(e) { 
    datamonkey.save_image("png", "#tree_container"); 
  });

  $("#export-phylo-svg").on('click', function(e) { 
    datamonkey.save_image("svg", "#tree_container"); 
  });

  tree.branch_length(null);
  tree.branch_name(null);
  tree.node_span ('equal');
  tree.options ({'draw-size-bubbles' : false}, false);
  tree.options ({'selectable' : false}, false);
  tree.font_size (18);
  tree.scale_bar_font_size (14);
  tree.node_circle_size (6);
  tree.spacing_x (35, true);
  tree.style_edges(edge_colorizer);

  render_bs_rel_tree(json, "Unconstrained model");

}

datamonkey.busted.render_tree = busted_render_tree;

function getStyles(doc) {

  function processStyleSheet(ss) {
    if (ss.cssRules) {
      for (var i = 0; i < ss.cssRules.length; i++) {
        var rule = ss.cssRules[i];
        if (rule.type === 3) {
          // Import Rule
          processStyleSheet(rule.styleSheet);
        } else {
          // hack for illustrator crashing on descendent selectors
          if (rule.selectorText) {
            if (rule.selectorText.indexOf(">") === -1) {
              styles += "\n" + rule.cssText;
            }
          }
        }
      }
    }
  }

  var styles = "",
      styleSheets = doc.styleSheets;

  if (styleSheets) {
    for (var i = 0; i < styleSheets.length; i++) {
      processStyleSheet(styleSheets[i]);
    }
  }

  return styles;

}

function exportCSVButton(data) {

  data = d3.csv.format(data);
  if (data != null) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    pom.setAttribute('download', 'export.csv');
    pom.className = 'btn btn-default btn-sm';
    pom.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Download CSV';
    $("body").append(pom);
    pom.click();
    pom.remove();
  }

}

function convertSVGtoPNG(image_string) {

  var image = document.getElementById("chart-image");
  image.src = image_string;

  image.onload = function() {
    var canvas = document.getElementById("chart-canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0,0,image.width,image.height);
    context.drawImage(image, 0, 0);
    var img = canvas.toDataURL("image/png");

    var pom = document.createElement('a');
    pom.setAttribute('download', 'image.png');
    pom.href = canvas.toDataURL("image/png");     
    $("body").append(pom);
    pom.click();
    pom.remove();
  }

}

function saveImage(type, container) {

  var prefix = {
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    svg: "http://www.w3.org/2000/svg"
  }

  var svg = $(container).find("svg")[0];
  var styles = getStyles(window.document);

  svg.setAttribute("version", "1.1");

  var defsEl = document.createElement("defs");
  svg.insertBefore(defsEl, svg.firstChild); 

  var styleEl = document.createElement("style")
  defsEl.appendChild(styleEl);
  styleEl.setAttribute("type", "text/css");


  // removing attributes so they aren't doubled up
  svg.removeAttribute("xmlns");
  svg.removeAttribute("xlink");

  // These are needed for the svg
  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
  }

  if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
    svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
  }

  var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');
  var rect = svg.getBoundingClientRect();
  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
  var to_download = [doctype + source]
  var image_string = 'data:image/svg+xml;base66,' + encodeURIComponent(to_download);

  if(type == "png") {
    convertSVGtoPNG(image_string)
  } else {
    var pom = document.createElement('a');
    pom.setAttribute('download', 'image.svg');
    pom.setAttribute('href', image_string);
    $("body").append(pom);
    pom.click();
    pom.remove();
  }

}

var _networkGraphAttrbuteID = "user attributes";
var _defaultFloatFormat = d3.format(",.2r");



var hivtrace_cluster_network_graph = function (json, network_container, network_status_string, network_warning_tag, button_bar_ui, attributes, filter_edges_toggle, clusters_table, nodes_table, parent_container) {

  // [REQ] json                        :          the JSON object containing network nodes, edges, and meta-information
  // [REQ] network_container           :          the CSS selector of the DOM element where the SVG containing the network will be placed (e.g. '#element')
  // [OPT] network_status_string       :          the CSS selector of the DOM element where the text describing the current state of the network is shown (e.g. '#element')
  // [OPT] network_warning_tag         :          the CSS selector of the DOM element where the any warning messages would go (e.g. '#element')
  // [OPT] button_bar_ui               :          the ID of the control bar which can contain the following elements (prefix = button_bar_ui value)
  //                                                - [prefix]_cluster_operations_container : a drop-down for operations on clusters
  //                                                - [prefix]_attributes :  a drop-down for operations on attributes
  //                                                - [prefix]_filter : a text box used to search the graph
  // [OPT] network_status_string       :          the CSS selector of the DOM element where the text describing the current state of the network is shown (e.g. '#element')
  // [OPT] attributes                  :          A JSON object with mapped node attributes

  var self = new Object;

    self.ww = d3.select(parent_container).property("clientWidth");
    self.nodes = [];
    self.edges = [];
    self.clusters = [];         
    self.cluster_sizes = [];
    self.colorizer = {'selected': function (d) {return d == 'selected' ? d3.rgb(51, 122, 183) : '#FFF';}}
    self.filter_edges = true,
    self.hide_hxb2 = false,
    self.charge_correction = 1,
    self.margin = {top: 20, right: 10, bottom: 30, left: 10},
    self.width  = self.ww - self.margin.left - self.margin.right,
    self.height = 500 - self.margin.top - self.margin.bottom,
    self.cluster_table = d3.select (clusters_table),
    self.node_table = d3.select (nodes_table),
    self.needs_an_update = false,
    self.json = json;

  var cluster_mapping = {},
      l_scale = 5000,   // link scale
      graph_data = self.json,     // the raw JSON network object
      max_points_to_render = 500,
      warning_string     = "",
      singletons         = 0,
      open_cluster_queue = [],
      currently_displayed_objects;

  /*------------ D3 globals and SVG elements ---------------*/

  var network_layout = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) { if (d.cluster_id) return self.charge_correction*(-50-20*Math.pow(d.children.length,0.7)); return self.charge_correction*(-20*Math.sqrt(d.degree)); })
    .linkDistance(function(d) { return Math.max(d.length*l_scale,1); })
    .linkStrength (function (d) { if (d.support != undefined) { return 2*(0.5-d.support);} return 1;})
    .chargeDistance (500)
    .friction (0.25);
        
  d3.select(network_container).selectAll (".my_progress").remove();

  var network_svg = d3.select(network_container).append("svg:svg")
      .style ("border", "solid black 1px")
      .attr("id", "network-svg")
      .attr("width", self.width + self.margin.left + self.margin.right)
      .attr("height", self.height + self.margin.top + self.margin.bottom);

      //.append("g")
      // .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

  network_svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("refX", 9) /*must be smarter way to calculate shift*/
      .attr("refY", 2)
      .attr("markerWidth",  6)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .attr("stroke", "#666666")
      .attr("fill", "#AAAAAA")
      .append("path")
          .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead
   
  change_window_size();                                   
   
  /*------------ Network layout code ---------------*/
  var handle_cluster_click = function (cluster, release) {

    var container = d3.select(network_container);
    var id = "d3_context_menu_id";
    var menu_object = container.select ("#" + id);
    
    if (menu_object.empty()) {
      menu_object = container.append ("ul")
        .attr ("id", id)
        .attr ("class","dropdown-menu")
        .attr ("role", "menu");
    } 

    menu_object.selectAll ("li").remove();

    var already_fixed = cluster && cluster.fixed == 1;
    

    if (cluster) {
      menu_object.append("li").append ("a")
                   .attr("tabindex", "-1")
                   .text("Expand cluster")
                   .on ("click", function (d) {
                      cluster.fixed = 0;
                      expand_cluster_handler(cluster, true);
                      menu_object.style ("display", "none"); 
                      });

      menu_object.append("li").append ("a")
                   .attr ("tabindex", "-1")
                   .text ("Center on screen")
                   .on ("click", function (d) {
                      cluster.fixed = 0;
                      center_cluster_handler(cluster);
                      menu_object.style ("display", "none"); 
                      });
                      
     menu_object.append("li").append ("a")
               .attr ("tabindex", "-1")
               .text (function (d) {if (cluster.fixed) return "Release fix"; return "Fix in place";})
               .on ("click", function (d) {
                  cluster.fixed = !cluster.fixed;
                  menu_object.style ("display", "none"); 
                  });

     cluster.fixed = 1;

     menu_object.style ("position", "absolute")
        .style("left", "" + d3.event.offsetX + "px")
        .style("top", "" + d3.event.offsetY + "px")
        .style("display", "block");

    } else {
      if (release) {
        release.fixed = 0;
      }
      menu_object.style("display", "none");
    }

    container.on("click", function (d) {handle_cluster_click(null, already_fixed ? null : cluster);}, true);

  };

  var handle_node_click = function (node) {
    var container = d3.select(network_container);
    var id = "d3_context_menu_id";
    var menu_object = container.select ("#" + id);
    
    if (menu_object.empty()) {
      menu_object = container.append ("ul")
        .attr ("id", id)
        .attr ("class","dropdown-menu")
        .attr ("role", "menu");
    } 

    menu_object.selectAll ("li").remove();

    if (node) {
      node.fixed = 1;
      menu_object.append("li").append ("a")
                   .attr("tabindex", "-1")
                   .text("Collapse cluster")
                   .on ("click", function (d) {
                      node.fixed = 0;
                      collapse_cluster_handler(node, true)
                      menu_object.style ("display", "none"); 
                      });

      menu_object.style ("position", "absolute")
        .style ("left", "" + d3.event.offsetX + "px")
        .style ("top", "" + d3.event.offsetY + "px")
        .style ("display", "block");

    } else {
      menu_object.style("display", "none");
    }

    container.on("click", function (d) {handle_node_click(null);}, true);

  };

  function get_initial_xy (nodes, cluster_count, exclude ) { 
      var d_clusters = {'id': 'root', 'children': []};
      for (var k = 0; k < cluster_count; k+=1) {
       if (exclude != undefined && exclude[k+1] != undefined) {continue;}
          d_clusters.children.push ({'cluster_id' : k+1, 'children': nodes.filter (function (v) {return v.cluster == k+1;})});
      }   
      
      var treemap = d3.layout.treemap()
      .size([self.width, self.height])
      .sticky(true)
      .children (function (d)  {return d.children;})
      .value(function(d) { return 1;});
      
      return treemap.nodes (d_clusters);
  }

  function prepare_data_to_graph () {

      var graphMe = {};
      graphMe.all = [];
      graphMe.edges = [];
      graphMe.nodes = [];
      graphMe.clusters = [];

      expandedClusters = [];
      drawnNodes = [];
      
      
      self.clusters.forEach (function (x) {
          // Check if hxb2_linked is in a child
          var hxb2_exists = x.children.some(function(c) {return c.hxb2_linked}) && self.hide_hxb2;
          if(!hxb2_exists) {
            if (x.collapsed) {
                graphMe.clusters.push (x);
                graphMe.all.push(x);
            } else {
                expandedClusters[x.cluster_id] = true;
            }
          }
      });
      
      self.nodes.forEach (function (x, i) {
          if (expandedClusters[x.cluster]) {
              drawnNodes[i] = graphMe.nodes.length +  graphMe.clusters.length;
              graphMe.nodes.push(x); 
              graphMe.all.push(x); 
          } 
      
      });
      
      self.edges.forEach (function (x) {

          if(!(x.removed && self.filter_edges)) {
            if (drawnNodes[x.source] != undefined && drawnNodes[x.target] != undefined) {

                var y = {};
                for (var prop in x) {
                    y[prop] = x[prop];
                }

                y.source = drawnNodes[x.source];
                y.target = drawnNodes[x.target];
                graphMe.edges.push(y);
            }
          }
      });

      return graphMe;

  }

  function default_layout (clusters, nodes, exclude_cluster_ids) {
        init_layout = get_initial_xy (nodes, self.cluster_sizes.length, exclude_cluster_ids);
        clusters = init_layout.filter (function (v,i,obj) { return  !(typeof v.cluster_id === "undefined");});
        nodes = nodes.map (function (v) {v.x += v.dx/2; v.y += v.dy/2; return v;});
        clusters.forEach (collapse_cluster); 
        return [clusters, nodes];
    }
    
 function change_spacing (delta) {
    self.charge_correction = self.charge_correction * delta;
    network_layout.start ();
 }

 function change_window_size (delta, trigger) {
 
    if (delta) {
        self.width  += delta;
        self.height += delta;
    
        self.width  = Math.min (Math.max (self.width, 200), 4000); 
        self.height = Math.min (Math.max (self.height, 200), 4000);
    } 
    
    network_layout.size ([self.width, self.height - 160]);
    network_svg.attr ("width", self.width).attr ("height", self.height);
    
    if (trigger) {
        network_layout.start ();       
    }
    
 }
 
 self.compute_adjacency_list = _.once(function () {    

    self.nodes.forEach (function (n) {
        n.neighbors = d3.set();
    });
    
    self.edges.forEach (function (e) {
        self.nodes[e.source].neighbors.add(e.target);
        self.nodes[e.target].neighbors.add(e.source);
    });

 });
 
 self.compute_local_clustering_coefficients = _.once (function () {

    self.compute_adjacency_list();
    
    self.nodes.forEach (function (n) {
        _.defer (function (a_node) {
            neighborhood_size = a_node.neighbors.size ();
            if (neighborhood_size < 2) {
                a_node.lcc = datamonkey.hivtrace.undefined;     
            } else {
                if (neighborhood_size > 500) {
                    a_node.lcc = datamonkey.hivtrace.too_large;     
                } else {
                    // count triangles
                    neighborhood = a_node.neighbors.values();
                    counter = 0;
                    for (n1 = 0; n1 < neighborhood_size; n1 += 1) {
                        for (n2 = n1 + 1; n2 < neighborhood_size; n2 += 1) {
                            if (self.nodes [neighborhood[n1]].neighbors.has (neighborhood[n2])) {
                                counter ++;
                            }
                        }
                    }
                    
                    a_node.lcc = 2 * counter / neighborhood_size / (neighborhood_size - 1);
                }
            }
            
        }, n);
    });

 });

  self.get_node_by_id = function(id) {
    return self.nodes.filter(function(n) {
        return n.id == id;
    })[0];


  }

 self.compute_local_clustering_coefficients_worker = _.once (function () {

    var worker = new Worker('workers/lcc.js');

    worker.onmessage = function(event) {

      var nodes = event.data.Nodes;

      nodes.forEach(function(n) { 
        node_to_update = self.get_node_by_id(n.id);
        node_to_update.lcc = n.lcc ? n.lcc : datamonkey.hivtrace.undefined;
      });

    };

    var worker_obj = {}
    worker_obj["Nodes"] = self.nodes;
    worker_obj["Edges"] = self.edges;
    worker.postMessage(worker_obj);

 });


  
  estimate_cubic_compute_cost = _.memoize(function (c) {
    self.compute_adjacency_list();  
    return _.reduce (_.first(_.pluck (c.children, "degree").sort (d3.descending),3),function (memo, value) {return memo*value;},1); 
  }, function (c) {return c.cluster_id;});
  
  self.compute_global_clustering_coefficients = _.once (function () {
    self.compute_adjacency_list();
 
    self.clusters.forEach (function (c) {
         _.defer (function (a_cluster) {
                cluster_size = a_cluster.children.length;
                if (cluster_size < 3) {
                    a_cluster.cc = datamonkey.hivtrace.undefined;     
                } else {
                    if (estimate_cubic_compute_cost (a_cluster, true) >= 5000000) {
                        a_cluster.cc = datamonkey.hivtrace.too_large;     
                    } else {
                        // pull out all the nodes that have this cluster id
                        member_nodes = [];
                        
                        var triads = 0;
                        var triangles = 0; 
                        
                        self.nodes.forEach (function (n,i) {if (n.cluster == a_cluster.cluster_id) {member_nodes.push (i);}});
                        member_nodes.forEach (function (node) {
                            my_neighbors = self.nodes[node].neighbors.values().map (function (d) {return +d;}).sort (d3.ascending);
                            for (n1 = 0; n1 < my_neighbors.length; n1 += 1) {
                                for (n2 = n1 + 1; n2 < my_neighbors.length; n2 += 1) {
                                    triads += 1;
                                    if (self.nodes[my_neighbors[n1]].neighbors.has (my_neighbors[n2])) {
                                        triangles += 1;
                                    }
                                }
                            }
                        });
                        
                        a_cluster.cc = triangles/triads;
                    }
                }
        
            }, c);    
        });
 });

 self.mark_nodes_as_processing = function (property) {
    self.nodes.forEach (function (n) { n[property] = datamonkey.hivtrace.processing }); 
  }
 
 self.compute_graph_stats = function () {

    d3.select (this).classed ("disabled", true).select("i").classed ({"fa-calculator": false, "fa-cog": true, "fa-spin": true});
    self.mark_nodes_as_processing('lcc');
    self.compute_local_clustering_coefficients_worker();
    self.compute_global_clustering_coefficients();
    d3.select (this).remove();

 };


  /*------------ Constructor ---------------*/
  function initial_json_load() {
    var connected_links = [];
    var total = 0;
    var exclude_cluster_ids = {};
    self.has_hxb2_links = false;
    self.cluster_sizes = [];

    graph_data.Nodes.forEach (function (d) { 
          if (typeof self.cluster_sizes[d.cluster-1]  === "undefined") {
            self.cluster_sizes[d.cluster-1] = 1;
          } else {
            self.cluster_sizes[d.cluster-1] ++;
          }
          if ("is_lanl" in d) {
            d.is_lanl = d.is_lanl == "true";
          }
          
          
          if (d.attributes.indexOf ("problematic") >= 0) {
            self.has_hxb2_links = d.hxb2_linked = true;
          }
      
    });

     /* add buttons and handlers */
     /* clusters first */
     
     if (button_bar_ui) {
     
         var cluster_ui_container = d3.select ("#" + button_bar_ui + "_cluster_operations_container");
         
         [
            ["Expand All",          function () {return self.expand_some_clusters()},   true],
            ["Collapse All",        function () {return self.collapse_some_clusters()}, true],
            ["Expand Filtered",     function () {return self.expand_some_clusters(self.select_some_clusters (function (n) {return n.match_filter;}))},   true],
            ["Collapse Filtered",   function () {return self.collapse_some_clusters(self.select_some_clusters (function (n) {return n.match_filter;}))}, true],
            ["Hide problematic clusters", function (item) {
                                            d3.select (item).text (self.hide_hxb2 ? "Hide problematic clusters" :  "Show problematic clusters");
                                            self.toggle_hxb2 ();
                                          }, self.has_hxb2_links],
                                          
            ["Show removed edges",   function (item) {
                                        self.filter_edges = !self.filter_edges; 
                                        d3.select (item).text (self.filter_edges ? "Show removed edges" :  "Hide removed edges");
                                        self.update (false); 
                                     }
                                    , function () {return _.some (self.edges, function (d) {return d.removed;});}]
            
         ].forEach (function (item,index) {
            var handler_callback = item[1];
            if (item[2]) {
                this.append ("li").append ("a")
                                  .text (item[0])
                                  .attr ("href", "#")
                                  .on ("click", function(e) {
                                    handler_callback(this);
                                    d3.event.preventDefault();
                                  });
            }
         },cluster_ui_container);
         
         
         var button_group  = d3.select ("#" + button_bar_ui + "_button_group");
         
         if (! button_group.empty()) {
            button_group.append ("button").classed ("btn btn-default btn-sm", true).attr ("title", "Expand spacing").on ("click", function (d) {change_spacing (5/4);}).append ("i").classed ("fa fa-arrows", true);
            button_group.append ("button").classed ("btn btn-default btn-sm", true).attr ("title", "Compress spacing").on ("click", function (d) {change_spacing (4/5);}).append ("i").classed ("fa fa-arrows-alt", true);
            button_group.append ("button").classed ("btn btn-default btn-sm", true).attr ("title", "Enlarge window").on ("click", function (d) {change_window_size (20, true);}).append ("i").classed ("fa fa-expand", true);
            button_group.append ("button").classed ("btn btn-default btn-sm", true).attr ("title", "Shrink window").on ("click", function (d) {change_window_size (-20, true);}).append ("i").classed ("fa fa-compress", true);
            button_group.append ("button").classed ("btn btn-default btn-sm", true).attr ("title", "Compute graph statistics").on ("click", function (d) {_.bind(self.compute_graph_stats,this)();}).append ("i").classed ("fa fa-calculator", true);
            button_group.append ("button")
              .classed("btn btn-default btn-sm", true)
              .attr("title", "Save Image")
              .attr("id", "hivtrace-export-image")
              .on("click", function(d) { datamonkey.save_image("png", "#network-svg");})
              .append ("i").classed ("fa fa-image", true);
         }
         
         $("#" + button_bar_ui + "_filter").on ("input propertychange", _.throttle (function (e) {  
               var filter_value = $(this).val();
               self.filter (filter_value.split (" ").filter (function (d) {return d.length > 0;}).map (function (d) { return new RegExp (d,"i")}));
            }, 250));
        
    }
          
     
     
    
     if (attributes && "hivtrace" in attributes) {
        attributes = attributes["hivtrace"];
     }
     
     if (attributes && "attribute_map" in attributes) {
         /*  
            map attributes into nodes and into the graph object itself using 
            _networkGraphAttrbuteID as the key  
         */
     
         var attribute_map = attributes["attribute_map"];
     
         if ("map" in attribute_map && attribute_map["map"].length > 0) {
             graph_data [_networkGraphAttrbuteID] = attribute_map["map"].map (function (a,i) { return {'label': a, 'type' : null, 'values': {}, 'index' : i, 'range' : 0};});   
             
             graph_data.Nodes.forEach (function (n) { 
                n[_networkGraphAttrbuteID] = n.id.split (attribute_map["delimiter"]);
                n[_networkGraphAttrbuteID].forEach (function (v,i) {
                    if (i < graph_data [_networkGraphAttrbuteID].length) {
                        if (! (v in graph_data [_networkGraphAttrbuteID][i]["values"])) {
                            graph_data [_networkGraphAttrbuteID][i]["values"][v] = graph_data [_networkGraphAttrbuteID][i]["range"];
                            graph_data [_networkGraphAttrbuteID][i]["range"] += 1;
                        }
                    }
                    //graph_data [_networkGraphAttrbuteID][i]["values"][v] = 1 + (graph_data [_networkGraphAttrbuteID][i]["values"][v] ? graph_data [_networkGraphAttrbuteID][i]["values"][v] : 0);
                });
            });
           
            graph_data [_networkGraphAttrbuteID].forEach (function (d) {
                if (d['range'] < graph_data.Nodes.length && d['range'] > 1 &&d['range' ] <= 20) {
                    d['type'] = 'category';
                }
            });
            
            
            // populate the UI elements
            if (button_bar_ui) {
                var valid_cats = graph_data [_networkGraphAttrbuteID].filter (function (d) { return d['type'] == 'category'; });
                //valid_cats.splice (0,0, {'label' : 'None', 'index' : -1});
                               
                [d3.select ("#" + button_bar_ui + "_attributes"),d3.select ("#" + button_bar_ui + "_attributes_cat")].forEach (function (m) {
                
                    m.selectAll ("li").remove();
                
                    var cat_menu = m.selectAll ("li")
                                    .data([[['None',-1]],[['Categorical', -2]]].concat(valid_cats.map (function (d) {return [[d['label'],d['index']]];})));        
                                                                     
                    cat_menu.enter ().append ("li").classed ("disabled", function (d) {return d[0][1] < -1;});
                    cat_menu.selectAll ("a").data (function (d) {return d;})
                                            .enter ()
                                            .append ("a")
                                            .text (function (d,i,j) {return d[0];})
                                            .attr ("style", function (d,i,j) {if (d[1] < -1) return 'font-style: italic'; if (j == 0) { return ' font-weight: bold;'}; return null; })
                                            .attr ('href', '#')
                                            .on ("click", function (d) { handle_attribute_categorical (d[1]); });
                });
            }
        }
    }
    
    if (self.cluster_sizes.length > max_points_to_render) {
      var sorted_array = self.cluster_sizes.map (function (d,i) { 
          return [d,i+1]; 
        }).sort (function (a,b) {
          return a[0] - b[0];
        });

      for (var k = 0; k < sorted_array.length - max_points_to_render; k++) {
          exclude_cluster_ids[sorted_array[k][1]] = 1;
      }
      warning_string = "Excluded " + (sorted_array.length - max_points_to_render) + " clusters (maximum size " +  sorted_array[k-1][0] + " nodes) because only " + max_points_to_render + " points can be shown at once.";
    }
    
    // Initialize class attributes
    singletons = graph_data.Nodes.filter (function (v,i) { return v.cluster === null; }).length; self.nodes = graph_data.Nodes.filter (function (v,i) { if (v.cluster && typeof exclude_cluster_ids[v.cluster]  === "undefined"  ) {connected_links[i] = total++; return true;} return false;  });
    self.edges = graph_data.Edges.filter (function (v,i) { return connected_links[v.source] != undefined && connected_links[v.target] != undefined});
    self.edges = self.edges.map (function (v,i) {v.source = connected_links[v.source]; v.target = connected_links[v.target]; v.id = i; return v;});

    compute_node_degrees(self.nodes, self.edges);

    var r = default_layout(self.clusters, self.nodes, exclude_cluster_ids);
    self.clusters = r[0];
    self.nodes = r[1];
    self.clusters.forEach (function (d,i) {
            cluster_mapping[d.cluster_id] = i;
            d.hxb2_linked = d.children.some(function(c) {return c.hxb2_linked});
            var degrees = d.children.map (function (c) {return c.degree;});
            degrees.sort (d3.ascending);
            d.degrees = datamonkey_describe_vector (degrees);
            });
     
     
    self.update();
 
  }  
  
  function sort_table_toggle_icon (element, value) {
    if (value) {
        $(element).data ("sorted", value);
        d3.select (element).selectAll ("i").classed ("fa-sort-amount-desc", value == "desc").classed ("fa-sort-amount-asc", value == "asc").classed ("fa-sort", value == "unsorted");
    } else {
        var sorted_state = $(element).data ("sorted");
        sort_table_toggle_icon (element, sorted_state == "asc" ? "desc" : "asc");
        return sorted_state == "asc" ? d3.descending: d3.ascending;
    }
  }
  
  function sort_table_by_column (element, datum) {
    d3.event.preventDefault();
    var table_element = $(element).closest ("table");
    if (table_element.length) {
        var sort_on             = parseInt($(element).data ("column-id"));
        var sort_key            = $(element).data ("sort-on");
        var sorted_state        = ($(element).data ("sorted"));
        var sorted_function     = sort_table_toggle_icon (element);
        
        sort_accessor = sort_key ? function (x) {var val = x[sort_key]; if (typeof (val) === "function") return val (); return val;} : function (x) {return x;};
        
        d3.select (table_element[0]).select ("tbody").selectAll ("tr").sort (function (a,b) { return sorted_function (sort_accessor(a[sort_on]), sort_accessor(b[sort_on]));});
        
        // select all other elements from thead and toggle their icons
        
        $(table_element).find ("thead [data-column-id]")
                        .filter (function () {return parseInt ($(this).data ("column-id")) != sort_on;})
                        .each (function () { sort_table_toggle_icon (this, "unsorted");});
    }
  }
  
  function format_a_cell (data, index, item) {
  
     var this_sel  = d3.select (item);

     current_value = typeof (data.value) === "function" ? data.value() : data.value;

     if ("callback" in data) {
        data.callback (item, current_value);
     } else {  
         var repr = "format" in data ?  data.format (current_value) : current_value;
         if ("html" in data) this_sel.html (repr); else this_sel.text(repr);
         if ("sort" in data) {
            var clicker = this_sel.append ("a").property ("href", "#").on ("click", function (d) {sort_table_by_column (this, d);}).attr ("data-sorted", "unsorted").attr ("data-column-id", index).attr ("data-sort-on", data.sort);
            clicker.append ("i").classed ("fa fa-sort", true).style ("margin-left", "0.2em");
          }
     }
     if ("help" in data) {
        this_sel.attr ("title", data.help);
     }

  }
  
  function add_a_sortable_table (container, headers, content) {

        var thead = container.selectAll ("thead");
        if (thead.empty()) {
            thead = container.append ("thead");                    
            thead.selectAll ("tr").data (headers).enter().append ("tr").selectAll ("th").data (function (d) {return d;}).enter().append ("th").
                                  call (function (selection) { return selection.each (function (d, i) {
                                        format_a_cell (d, i, this);
                                    })
                                  });
        }  
        
        var tbody = container.selectAll ("tbody");
        if (tbody.empty()) {
            tbody = container.append ("tbody");
            tbody.selectAll ("tr").data (content).enter().append ("tr").selectAll ("td").data (function (d) {return d;}).enter().append ("td").call (function (selection) { return selection.each (function (d, i) {
                                        handle_cluster_click 
                                        format_a_cell (d, i, this);
                                    })
                                  });
        }
        
       
  }
  
  
  function _cluster_table_draw_buttons (element, payload) {
    var this_cell = d3.select (element);
    var labels = [[payload[0] ? "collapsed" : "expanded",0]];
    if (payload[1]) {
        labels.push (["problematic",1]);
    }
    var buttons = this_cell.selectAll ("button").data (labels);
    buttons.enter().append ("button");
    buttons.exit().remove();
    buttons.classed ("btn btn-primary btn-xs", true).text (function (d) {return d[0];})
                                                 .attr ("disabled", function (d) {return d[1] ? "disabled" : null})
                                                 .on ("click", function (d) {
                                                    if (d[1] == 0) {
                                                        if (payload[0]) { 
                                                            expand_cluster (self.clusters [payload[payload.length-1] - 1], true);
                                                        } else {
                                                            collapse_cluster (self.clusters [payload[payload.length-1] - 1]);
                                                        }
                                                        format_a_cell (d3.select (element).datum(), null, element);
                                                    }
                                                 });
    
  };
  
 function _node_table_draw_buttons (element, payload) {
    var this_cell = d3.select (element);
    var labels = [[payload[0] ? "shown" : "hidden",0]];

    var buttons = this_cell.selectAll ("button").data (labels);
    buttons.enter().append ("button");
    buttons.exit().remove();
    buttons.classed ("btn btn-primary btn-xs", true).text (function (d) {return d[0];})
                                                 .attr ("disabled", function (d) {return d[1] ? "disabled" : null})
                                                 .on ("click", function (d) {
                                                    if (d[1] == 0) {
                                                        if (payload[0]) { 
                                                            collapse_cluster (self.clusters [payload[payload.length-1] - 1], true);
                                                        } else {
                                                            expand_cluster (self.clusters [payload[payload.length-1] - 1]);
                                                        }
                                                        format_a_cell (d3.select (element).datum(), null, element);
                                                    }
                                                 });
    
  };
  
  self.update_volatile_elements = function (container) {
    container.selectAll ("td").filter (function (d,i) {
        return ("volatile" in d);
    }).each (function (d,i) {
        format_a_cell (d, i, this);
    });
  };
  
  function draw_node_table () {

    if (self.node_table) { 
        add_a_sortable_table (self.node_table,
                                // headers
                              [[{value:"ID", sort : "value", help: "Node ID"}, 
                                 {value: "Properties", sort: "value"}, 
                                 {value: "Degree", sort: "value", help: "Node degree"}, 
                                 {value: "Cluster", sort: "value", help: "Which cluster does the node belong to"}, 
                                 {value: "LCC", sort: "value", help: "Local clustering coefficient"}
                               ]], 
                                 // rows 
                               self.nodes.map (function (n, i) {
                                console.log(datamonkey.hivtrace.format_value(n.lcc,_defaultFloatFormat));
                                return [{"value": n.id, help: "Node ID"}, 
                                        {       "value": function () {return [!self.clusters [n.cluster-1].collapsed, n.cluster]}, 
                                                "callback": _node_table_draw_buttons,
                                                "volatile" : true
                                        }, 
                                        {"value" : n.degree, help: "Node degree"},
                                        {"value" : n.cluster, help: "Which cluster does the node belong to"}, 
                                        {"value": function () {return datamonkey.hivtrace.format_value(n.lcc,_defaultFloatFormat);},
                                         "volatile" : true, "html": true, help: "Local clustering coefficient"}];
        
                                }));
    }
  }
  
  function draw_cluster_table () {
    if (self.cluster_table) {
        add_a_sortable_table (self.cluster_table,
                                // headers
                              [[{value:"ID", sort : "value", help: "Unique cluster ID"}, 
                                 {value: "Properties", sort: "value"}, 
                                 {value: "Size", sort: "value", help: "Number of nodes in the cluster"}, 
                                 {value: "Degrees<br>Mean [Median, IQR]", html : true}, 
                                 {value: "CC", sort: "value", help: "Global clustering coefficient"},
                                 {value: "MPL", sort: "value", help: "Mean Path Length"}
                               ]],
                                self.clusters.map (function (d, i) {
                                 // rows 
                                return [{value: d.cluster_id}, 
                                        {       value: function () {return [d.collapsed, d.hxb2_linked, d.cluster_id]}, 
                                                callback: _cluster_table_draw_buttons,
                                                volatile : true
                                        }, 
                                        {value :d.children.length},
                                        {value : d.degrees, format: function (d) {return _defaultFloatFormat(d['mean']) + " [" + _defaultFloatFormat(d['median']) + ", " + _defaultFloatFormat(d['Q1']) + " - " + _defaultFloatFormat(d['Q3']) +"]"}}, 
                                        {
                                            value: function () {return hivtrace_format_value(d.cc,_defaultFloatFormat);},
                                            volatile : true, 
                                            help: "Global clustering coefficient"
                                        },
                                        {
                                            value: function () {return hivtrace_format_value(d.mpl,_defaultFloatFormat);},
                                            volatile : true, 
                                            help: "Mean path length"
                                        }
                                        ];
        
                                })
                                );
        }     
  }

  /*------------ Update layout code ---------------*/
  function update_network_string (draw_me) {
      if (network_status_string) {
          var clusters_shown = self.clusters.length-draw_me.clusters.length,
              clusters_removed = self.cluster_sizes.length - self.clusters.length,
              nodes_removed = graph_data.Nodes.length - singletons - self.nodes.length;
          
          var s = "Displaying a network on <strong>" + self.nodes.length + "</strong> nodes, <strong>" + self.clusters.length + "</strong> clusters"
                  + (clusters_removed > 0 ? " (an additional " + clusters_removed + " clusters and " + nodes_removed + " nodes have been removed due to network size constraints)" : "") + ". <strong>" 
                  + clusters_shown +"</strong> clusters are expanded. Of <strong>" + self.edges.length + "</strong> edges, <strong>" + draw_me.edges.length + "</strong>, and of  <strong>" + self.nodes.length  + " </strong> nodes,  <strong>" + draw_me.nodes.length + " </strong> are displayed. ";
          if (singletons > 0) {
              s += "<strong>" +singletons + "</strong> singleton nodes are not shown. ";
          }
          d3.select (network_status_string).html(s);
    }
  }

  
  function draw_a_node (container, node) {
    container = d3.select(container);
    container.attr("d", d3.svg.symbol().size( node_size )
        .type( function(d) { return (d.hxb2_linked && !d.is_lanl) ? "cross" : (d.is_lanl ? "triangle-down" : "circle") }))
        .attr('class', 'node')
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; })
        .style('fill', function(d) { return node_color(d); })
        .on ('click', handle_node_click)
        .on ('mouseover', node_pop_on)
        .on ('mouseout', node_pop_off)
        .call(network_layout.drag().on('dragstart', node_pop_off));
  }
    

  function draw_a_cluster (container, the_cluster) {
       
     container_group = d3.select(container);
     
     
     var draw_from   = the_cluster["binned_attributes"] ? the_cluster["binned_attributes"].map (function (d) {return d.concat ([0]);}) : [[null, 1, 0]];
         
     if (the_cluster.match_filter) {
        draw_from = draw_from.concat ([["selected",the_cluster.match_filter,1],["not selected",the_cluster.children.length - the_cluster.match_filter,1]]);
     }

     var sums  = [d3.sum(draw_from.filter (function (d) {return d[2] == 0}),function (d) {return d[1];}),
                  d3.sum(draw_from.filter (function (d) {return d[2] != 0}),function (d) {return d[1];})];
                 
     var running_totals = [0,0];

     draw_from = draw_from.map (function (d) {  index = d[2];
                                                var v = {'container' : container, 
                                                        'cluster': the_cluster, 
                                                        'startAngle' : running_totals[index]/sums[index]*2*Math.PI, 
                                                        'endAngle': (running_totals[index]+d[1])/sums[index]*2*Math.PI, 
                                                        'name': d[0],
                                                        'rim' : index > 0}; 
                                                 running_totals[index] += d[1]; 
                                                 return v;
                                                 
                                             });
     
     
     var arc_radius = cluster_box_size(the_cluster)*0.5;
     var paths = container_group.selectAll ("path").data (draw_from);
     paths.enter ().append ("path");
     paths.exit  ().remove();
     
     paths.classed ("cluster", true)
          .classed ("hiv-trace-problematic", function (d) {return the_cluster.hxb2_linked && !d.rim;})
          .classed ("hiv-trace-selected", function (d) {return d.rim;})
          .attr ("d", function (d) {
                return (d.rim 
                        ? d3.svg.arc().innerRadius(arc_radius+2).outerRadius(arc_radius+5)
                        : d3.svg.arc().innerRadius(0).outerRadius(arc_radius))(d);
                })
          .style ("fill", function (d,i) {return d.rim ? self.colorizer ['selected'] (d.name) : cluster_color (the_cluster, d.name);})
          ;
    
     
     
  }
  
  function handle_attribute_categorical (cat_id) {
  
    var set_attr = "None";

    ["#" + button_bar_ui + "_attributes","#" + button_bar_ui + "_attributes_cat"].forEach (function (m) {
        d3.select (m).selectAll ("li")
                                                       .selectAll ("a")
                                                       .attr ("style", function (d,i) {if (d[1] == cat_id) { set_attr = d[0]; return ' font-weight: bold;'}; return null; });
      
        d3.select (m + "_label").html (set_attr + ' <span class="caret"></span>');
    });
                                                   


     self.clusters.forEach (function (the_cluster) {the_cluster['binned_attributes'] = stratify(attribute_cluster_distribution (the_cluster, cat_id));});
    
     if (cat_id >= 0) {
        self.colorizer['category']    = graph_data [_networkGraphAttrbuteID][cat_id]['range'] <= 10 ? d3.scale.category10() : d3.scale.category20c();
        self.colorizer['category_id'] = cat_id;  
        self.colorizer['category_map'] = graph_data [_networkGraphAttrbuteID][cat_id]['values'];
        self.colorizer['category_map'][null] =  graph_data [_networkGraphAttrbuteID][cat_id]['range'];
        self.colorizer['category_pairwise'] = attribute_pairwise_distribution(cat_id, graph_data [_networkGraphAttrbuteID][cat_id]['range'] + 1, self.colorizer['category_map']);
        render_chord_diagram ("#" + button_bar_ui + "_aux_svg_holder", self.colorizer['category_map'], self.colorizer['category_pairwise']);
        render_binned_table  ("#" + button_bar_ui + "_attribute_table", self.colorizer['category_map'], self.colorizer['category_pairwise']);
    } else {
        self.colorizer['category']          = null;
        self.colorizer['category_id']       = null;
        self.colorizer['category_pairwise'] = null;
        self.colorizer['category_map']      = null;
        render_chord_diagram ("#" + button_bar_ui + "_aux_svg_holder", null, null);
        render_binned_table  ("#" + button_bar_ui + "_attribite_table", null, null);
    }
    
    console.log (self.colorizer, graph_data [_networkGraphAttrbuteID]);

    self.update(true);
    d3.event.preventDefault();
  }
  
  self.filter = function (expressions, skip_update) {
  
    var anything_changed = false;
    
    self.clusters.forEach (function (c) {
        c.match_filter = 0;
    });
    
    self.nodes.forEach (function (n) {
        var did_match = _.some(expressions, function (regexp) {    
            return regexp.test (n.id)  ;
        });
        
        if (did_match != n.match_filter) {
            n.match_filter = did_match;
            anything_changed = true;
        }
        
        if (n.match_filter) {
            n.parent.match_filter += 1;
        }
    });
    
    
    if (anything_changed && !skip_update) {
        self.update (true);
    }
    
  }
  
  self.update = function (soft, friction) {
  
    self.needs_an_update = false;
  
    if (friction) {
        network_layout.friction (friction);
    }
    if (network_warning_tag) {
        if (warning_string.length) {
          d3.select (network_warning_tag).text (warning_string).style ("display", "block");
          warning_string = "";
        } else {
          d3.select (network_warning_tag).style ("display", "none");  
        }
    }

    var rendered_nodes, 
        rendered_clusters,
        link;
        
    if (!soft) {

        var draw_me = prepare_data_to_graph(); 
        

        network_layout.nodes(draw_me.all)
            .links(draw_me.edges)
            .start ();
        
        update_network_string(draw_me);
        
        link = network_svg.selectAll(".link")
            .data(draw_me.edges, function (d) {return d.id;});
        
        var link_enter = link.enter().append("line")
            .classed ("link", true)
            .classed ("removed", function (d) {return d.removed;})
            .classed ("unsupported", function (d) { return "support" in d && d["support"] > 0.05;})
            .on ("mouseover", edge_pop_on)
            .on ("mouseout", edge_pop_off)
            .filter (function (d) {return d.directed;})
            .attr("marker-end", "url(#arrowhead)");

        link.exit().remove();


    
        rendered_nodes  = network_svg.selectAll('.node')
            .data(draw_me.nodes, function (d) {return d.id;});
        rendered_nodes.exit().remove();
        rendered_nodes.enter().append("path");
        
        rendered_clusters = network_svg.selectAll (".cluster-group").
          data(draw_me.clusters.map (function (d) {return d;}), function (d) {return d.cluster_id;});
 
        rendered_clusters.exit().remove();
        rendered_clusters.enter().append ("g").attr ("class", "cluster-group")
              .attr ("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; })
              .on ("click", handle_cluster_click)
              .on ("mouseover", cluster_pop_on)
              .on ("mouseout", cluster_pop_off)
              .call(network_layout.drag().on("dragstart", cluster_pop_off));
        
        draw_cluster_table ();
        draw_node_table ();
    
    } else {
        rendered_nodes = network_svg.selectAll('.node');
        rendered_clusters = network_svg.selectAll (".cluster-group");
        link = network_svg.selectAll(".link");
    }

    rendered_nodes.each (function (d) { 
              draw_a_node (this, d);
             });  
          
    rendered_clusters.each (function (d) {
        draw_a_cluster (this, d);
    });
    
     
    if (!soft) {
        currently_displayed_objects = rendered_clusters[0].length + rendered_nodes[0].length;

        network_layout.on("tick", function() {
        
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          rendered_nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; });
          rendered_clusters.attr("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; });
        });    
    }
  }

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  /*------------ Node Methods ---------------*/
  function compute_node_degrees(nodes, edges) {
      for (var n in nodes) {
          nodes[n].degree = 0;
      }
      
      for (var e in edges) {
          nodes[edges[e].source].degree++;
          nodes[edges[e].target].degree++;
      }
  }

    
  function  attribute_node_value_by_id (d, id) {
     if (_networkGraphAttrbuteID in d ) {
        if (id) {
            return d[_networkGraphAttrbuteID][id];
        }
     }
     return null;
  }
  
  function  attribute_name_by_id (id) {
    if (typeof id == "number") {
        return graph_data [_networkGraphAttrbuteID][id]['label'];
    }
    return null;
  }
  
  function node_size (d) {
    var r = 3+Math.sqrt(d.degree); return (d.match_filter ? 10 : 4)*r*r; 
  }

  function node_color(d) {
    
    if (d.match_filter) {
        return "white";
    }
  
    var color = attribute_node_value_by_id (d, self.colorizer['category_id']);
    if (color) {
        return self.colorizer['category'](color);
    }
    return d.hxb2_linked ? "black" : (d.is_lanl ? "red" : "#7fc97f");
  }

  function cluster_color(d, type) {
    if (d["binned_attributes"]) {
        return self.colorizer['category'](type);
    }
    return "#bdbdbd";
  }

  function hxb2_node_color(d) {
    return "black";
  }

  function node_info_string (n) {
      var str = "Degree <em>" + n.degree + "</em>"+
             "<br>Clustering coefficient <em> " + datamonkey.hivtrace.format_value (n.lcc, _defaultFloatFormat) + "</em>";
                 
      var attribute = attribute_node_value_by_id (n, self.colorizer['category_id']);
      if (attribute) {
         str += "<br>"  + attribute_name_by_id (self.colorizer['category_id']) + " <em>" + attribute + "</em>"
      }
      return str;
  }

  function edge_info_string (n) {
     var str = "Length <em>" + _defaultFloatFormat(n.length) + "</em>";
     if ("support" in n) {
        str += "<br>Worst triangle-based support (p): <em>" + _defaultFloatFormat(n.support) + "</em>";
     }
                 
      var attribute = attribute_node_value_by_id (n, self.colorizer['category_id']);

      return str;
  }

  function node_pop_on (d) {
      toggle_tooltip (this, true, "Node " + d.id, node_info_string (d));
  }

  function node_pop_off (d) {
      toggle_tooltip (this, false);
  }

  function edge_pop_on (e) {
      toggle_tooltip (this, true, e.source.id + " - " + e.target.id, edge_info_string (e));
  }

  function edge_pop_off (d) {
      toggle_tooltip (this, false);
  }


  /*------------ Cluster Methods ---------------*/

  function compute_cluster_centroids (clusters) {
      for (var c in clusters) {
          var cls = clusters[c];
          cls.x = 0.;
          cls.y = 0.;
          cls.children.forEach (function (x) { cls.x += x.x; cls.y += x.y; });
          cls.x /= cls.children.length;
          cls.y /= cls.children.length;
      }
  }

  function collapse_cluster(x, keep_in_q) {
      self.needs_an_update = true;
      x.collapsed = true;
      currently_displayed_objects -= self.cluster_sizes[x.cluster_id-1]-1;
      if (!keep_in_q) {
          var idx = open_cluster_queue.indexOf(x.cluster_id);
          if (idx >= 0) {
           open_cluster_queue.splice (idx,1);
          }
      }
      compute_cluster_centroids ([x]);
      return x.children.length;
  }

  function expand_cluster (x, copy_coord) {
      self.needs_an_update = true;
      x.collapsed = false;
      currently_displayed_objects += self.cluster_sizes[x.cluster_id-1]-1;
      open_cluster_queue.push (x.cluster_id);
      if (copy_coord) {
          x.children.forEach (function (n) { n.x = x.x + (Math.random()-0.5)*x.children.length; n.y = x.y + (Math.random()-0.5)*x.children.length; });
      } else {
          x.children.forEach (function (n) { n.x = self.width * 0.25 + (Math.random()-0.5)*x.children.length; n.y = 0.25*self.height + (Math.random()-0.5)*x.children.length; })
      }
  }

  function render_binned_table (id, the_map, matrix) {
  
    var the_table = d3.select (id);
  
    the_table.selectAll ("thead").remove();
    the_table.selectAll ("tbody").remove();
    
    if (matrix) {
        
        var fill = self.colorizer['category'];
        lookup = _.invert (the_map);
        
        
        var headers = the_table.append ("thead").append ("tr")
                      .selectAll ("th").data ([""].concat (matrix[0].map (function (d,i) {return lookup [i];})));
                      
        headers.enter().append ("th");
        headers.html (function (d) { return "<span>&nbsp;" + d + "</span>";}).each (
            function (d,i) {
                if (i) {
                    d3.select (this).insert ("i",":first-child")
                        .classed ("fa fa-circle", true)
                        .style ("color", function () {return fill (d);});
                }
            }
        );

        var rows = the_table.append ("tbody").selectAll ("tr").data (matrix.map (function (d, i) {return [lookup[i]].concat (d);}));
        rows.enter ().append ("tr");
        rows.selectAll ("td").data (function (d) {return d}).enter().append ("td").html (function (d, i) {
            return i == 0 ? ("<span>&nbsp;" + d + "</span>") : d;
        }).each (function (d, i) {
                if (i == 0) {
                    d3.select (this).insert ("i",":first-child")
                        .classed ("fa fa-circle", true)
                        .style ("color", function () {return fill (d);});
                }
        
        });
                      
        

    }
  }
  
  function render_chord_diagram (id, the_map, matrix) {
         
        d3.select (id).selectAll ("svg").remove();
        if (matrix) {
        
            lookup = _.invert (the_map);
            
  
            var svg = d3.select (id).append ("svg");
        
        
            var chord = d3.layout.chord()
                .padding(.05)
                .sortSubgroups(d3.descending)
                .matrix(matrix);

            var text_offset = 20,
                width  = 450,
                height = 450,
                innerRadius = Math.min(width, height-text_offset) * .41,
                outerRadius = innerRadius * 1.1;

            var fill = self.colorizer['category'],
                font_size = 12;
        
        
        
            var text_label = svg.append ("g")
                                .attr("transform", "translate(" + width / 2 + "," + (height-text_offset)  + ")")
                                .append ("text")
                                .attr ("text-anchor", "middle")
                                .attr ("font-size", font_size)
                                .text ("");

            svg = svg.attr("width", width)
                .attr("height", height-text_offset)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + (height-text_offset) / 2 + ")");
            
    
            svg.append("g").selectAll("path")
                .data(chord.groups)
              .enter().append("path")
                .style("fill", function(d)   { return fill(lookup[d.index]); })
                .style("stroke", function(d) { return fill(lookup[d.index]); })
                .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
                .on("mouseover", fade(0.1,true))
                .on("mouseout", fade(1,false));

        

            svg.append("g")
                .attr("class", "chord")
              .selectAll("path")
                .data(chord.chords)
              .enter().append("path")
                .attr("d", d3.svg.chord().radius(innerRadius))
                .style("fill", function(d) { return fill(d.target.index); })
                .style("opacity", 1);

            // Returns an event handler for fading a given chord group.
            function fade(opacity,t) {
              return function(g, i) {
                text_label.text (t ? lookup[i] : "");
                svg.selectAll(".chord path")
                    .filter(function(d) { return d.source.index != i && d.target.index != i; })
                  .transition()
                    .style("opacity", opacity);
              };
            }
        }
  }

  function attribute_pairwise_distribution (id, dim, the_map, only_expanded) {
        var scan_from = only_expanded ? draw_me.edges : self.edges;
        var the_matrix = [];
        for (i = 0 ; i < dim; i+=1) {
            the_matrix.push([]);
            for (j = 0; j < dim; j += 1){
                the_matrix[i].push (0);
            }
        }  
        scan_from.forEach (function (edge) { the_matrix[the_map[attribute_node_value_by_id(self.nodes[edge.source], id)]][the_map[attribute_node_value_by_id(self.nodes[edge.target], id)]] += 1;});
        // check if there are null values
        
        var haz_null = the_matrix.some (function (d, i) { if (i == dim - 1) {return d.some (function (d2) {return d2 > 0;});} return d[dim-1] > 0;});
        if (!haz_null) {
            the_matrix.pop();
            for (i = 0 ; i < dim - 1; i+=1) {
                the_matrix[i].pop();
            }
        }
        
        return the_matrix;
  }
    
  function attribute_cluster_distribution (the_cluster, attribute_id) {
        if (attribute_id >= 0 && the_cluster) {
            return the_cluster.children.map (function (d) {return (_networkGraphAttrbuteID in d) ? d[_networkGraphAttrbuteID][attribute_id] : null;});
        }
        return null;
  }

  function cluster_info_string (id) {
      var the_cluster = self.clusters[id-1],
          attr_info = the_cluster["binned_attributes"];
          
          

      var str = "<strong>" + self.cluster_sizes[id-1] + "</strong> nodes." + 
             "<br>Mean degree <em>" + _defaultFloatFormat(the_cluster.degrees['mean']) + "</em>" +
             "<br>Max degree <em>" + the_cluster.degrees['max'] + "</em>" +
             "<br>Clustering coefficient <em> " + datamonkey.hivtrace.format_value (the_cluster.cc, _defaultFloatFormat) + "</em>";
      
      if (attr_info) {
            attr_info.forEach (function (d) { str += "<br>" + d[0] + " <em>" + d[1] + "</em>"});
      }
             
      return str;
  }

  function cluster_pop_on (d) {
      toggle_tooltip (this, true, "Cluster " + d.cluster_id, cluster_info_string (d.cluster_id));
  }

  function cluster_pop_off (d) {
      toggle_tooltip (this, false);
  }

  function expand_cluster_handler (d, do_update, move_out) {
    if (d.collapsed) {  
        var new_nodes = self.cluster_sizes[d.cluster_id-1] - 1;
        
        if (new_nodes > max_points_to_render) {
            warning_string = "This cluster is too large to be displayed";
        }
        else {
            var leftover = new_nodes + currently_displayed_objects - max_points_to_render;
            if (leftover > 0) {
              for (k = 0; k < open_cluster_queue.length && leftover > 0; k++) {
                  var cluster = self.clusters[cluster_mapping[open_cluster_queue[k]]];
                  leftover -= cluster.children.length - 1;
                  collapse_cluster(cluster,true);
              }
              if (k || open_cluster_queue.length) {
                  open_cluster_queue.splice (0, k);
              }
            }
    
            if (leftover <= 0) {
                expand_cluster (d, !move_out);
            }
        }
            
        if (do_update) {
            self.update(false, 0.6);
        }
    }
    return "";
  }

  function collapse_cluster_handler (d, do_update) {
    collapse_cluster(self.clusters[cluster_mapping[d.cluster]]);
    if (do_update) {       
        self.update(false, 0.4);
    }
    
  }

  function center_cluster_handler (d) {
    d.x = self.width/2;
    d.y = self.height/2;
    self.update(false, 0.4);
  }

  function cluster_box_size (c) {
      return 5*Math.sqrt (c.children.length);
  }

  self.expand_some_clusters = function(subset)  {
    subset = subset || self.clusters;
    subset.forEach (function (x) { expand_cluster_handler (x, false); });
    self.update (); 
  }
  
  self.select_some_clusters = function (condition) {
    return self.clusters.filter (function (c, i) {
        return _.some(c.children, (function (n) {return condition (n);}));
    });
  }

  self.collapse_some_clusters = function(subset) {
    subset = subset || self.clusters;
    subset.forEach (function (x) { if (!x.collapsed) collapse_cluster (x); });
    self.update();
  }

  self.toggle_hxb2 = function()  {
    self.hide_hxb2 = !self.hide_hxb2;
    self.update();
  }

  $('#reset_layout').click(function(e) {
    default_layout(clusters, nodes);
    self.update ();
    e.preventDefault();// prevent the default anchor functionality
    });

  function stratify (array) {
    if (array) {
        var dict = {},
            stratified = [];
        
        array.forEach (function (d) { if (d in dict) {dict[d] += 1;} else {dict[d] = 1;}});
        for (var uv in dict) {
            stratified.push ([uv, dict[uv]]);
        }
        return stratified.sort (function (a,b) {
              return a[0] - b[0];
            });
     }
     return array;
   }

  /*------------ Event Functions ---------------*/
  function toggle_tooltip(element, turn_on, title, tag) {
    //if (d3.event.defaultPrevented) return;
    if (turn_on && !element.tooltip) {
    
      // check to see if there are any other tooltips shown
     ($("[role='tooltip']")).each (function (d) {
        $(this).remove();
     });
    
      var this_box = $(element);
      var this_data = d3.select(element).datum();
      element.tooltip = this_box.tooltip({
                 title: title + "<br>" + tag,
                 html: true,
                 container: 'body',
               });
               
      //this_data.fixed = true;
      
      _.delay (_.bind(element.tooltip.tooltip, element.tooltip), 500, 'show');
    } else {
      if (turn_on == false && element.tooltip) {
        element.tooltip.tooltip('destroy');
        element.tooltip = undefined;
      }
    }
  }
  initial_json_load();       
  return self;
}



var hivtrace_cluster_graph_summary = function (graph, tag) {
 
    var summary_table = d3.select (tag).append ("tbody");
    
    var table_data = [];
    
    if (!summary_table.empty()) {
        _.each (graph["Network Summary"], function (value, key) {
            table_data.push ([key, value]);
        });
    }
    
    var degrees = [];
    _.each (graph ["Degrees"]["Distribution"], function (value, index) { for (k = 0; k < value; k++) {degrees.push (index+1);}});    
    degrees = datamonkey.helpers.describe_vector (degrees);
    table_data.push (['Degrees', '']);
    table_data.push (['&nbsp;&nbsp;<i>Mean</i>',  _defaultFloatFormat(degrees['mean'])]);
    table_data.push (['&nbsp;&nbsp;<i>Median</i>',  _defaultFloatFormat(degrees['median'])]);
    table_data.push (['&nbsp;&nbsp;<i>Range</i>', degrees['min'] + " - " + degrees['max']]);
    table_data.push (['&nbsp;&nbsp;<i>IQR</i>', degrees['Q1'] + " - " + degrees['Q3']]);

    degrees = datamonkey.helpers.describe_vector (graph ["Cluster sizes"]);
    table_data.push (['Cluster sizes', '']);
    table_data.push (['&nbsp;&nbsp;<i>Mean</i>',  _defaultFloatFormat(degrees['mean'])]);
    table_data.push (['&nbsp;&nbsp;<i>Median</i>',  _defaultFloatFormat(degrees['median'])]);
    table_data.push (['&nbsp;&nbsp;<i>Range</i>', degrees['min'] + " - " + degrees['max']]);
    table_data.push (['&nbsp;&nbsp;<i>IQR</i>', degrees['Q1'] + " - " + degrees['Q3']]);
    
    
    summary_table.selectAll ("tr").data (table_data).enter().append ("tr").selectAll ("td").data (function (d) {return d;}).enter().append ("td").html (function (d) {return d});
}

datamonkey.hivtrace.cluster_network_graph = hivtrace_cluster_network_graph;
datamonkey.hivtrace.graph_summary = hivtrace_cluster_graph_summary;

function hivtrace_histogram(graph, histogram_tag, histogram_label) {  

  var defaultFloatFormat = d3.format(",.2f");
  var histogram_w = 300,
  histogram_h = 300;

  hivtrace_render_histogram(graph["Degrees"]["Distribution"], 
                            graph["Degrees"]["fitted"], 
                            histogram_w, 
                            histogram_h, 
                            histogram_tag);
  var label = "Network degree distribution is best described by the <strong>" + graph["Degrees"]["Model"] + "</strong> model, with &rho; of " + 
             defaultFloatFormat(graph["Degrees"]["rho"]);
             
  if (graph["Degrees"]["rho CI"] != undefined) {
        label += " (95% CI " + defaultFloatFormat(graph["Degrees"]["rho CI"][0]) + " - " + defaultFloatFormat(graph["Degrees"]["rho CI"][1]) + ")";
  }

  d3.select (histogram_label).html(label);
}

function hivtrace_render_histogram(counts, fit, w, h, id) {

    var margin = {top: 10, right: 30, bottom: 50, left: 30},
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom;
    
    var x = d3.scale.linear()
            .domain([0, counts.length+1])
            .range([0, width]);
            
    var y = d3.scale.log()
            .domain ([1, d3.max (counts)])
            .range  ([height,0]);
            
    var total = d3.sum(counts);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
        
    var histogram_svg = d3.select(id).selectAll("svg");

    if (histogram_svg != undefined) {
        histogram_svg.remove();
    }
    
    var data_to_plot = counts.map (function (d, i) {return {'x' : i+1, 'y' : d+1};});
    data_to_plot.push ({'x' : counts.length+1, 'y' : 1});
    data_to_plot.push ({'x' : 0, 'y' : 1});
    data_to_plot.push ({'x' : 0, 'y' : counts[0]+1});
   
    histogram_svg = d3.select(id).insert("svg",".histogram-label")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .datum (data_to_plot);
        
    var histogram_line = d3.svg.line()
                        .x(function(d) { return x(d.x); })
                        .y(function(d) { return y(d.y); })
                        .interpolate("step-before");
                        
    histogram_svg.selectAll ("path").remove();
    histogram_svg.append ("path")
                 .attr ("d", function(d) { return histogram_line(d) + "Z"; })
                 .attr ("class", "histogram");
    
    /*var bar = histogram_svg.selectAll(".bar")
    .data(counts.map (function (d) { return d+1; }))
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d,i) { return "translate(" + x(i+1) + "," + y(d) + ")"; });
      
    bar.append("rect")
        .attr("x", 1)
        .attr("width", function (d,i) {return x(i+2) - x(i+1);})
        .attr("height", function(d) { return height - y(d); })
        .append ("title").text (function (d,i) { return "" + counts[i] + " nodes with degree " + (i+1);});*/
        
      

      if (fit != undefined) {    
          var fit_line = d3.svg.line()
              .interpolate("linear")
              .x(function(d,i) { return x(i+1) + (x(i+1)-x(i))/2; })
              .y(function(d) { return y(1+d*total); });
          histogram_svg.append("path").datum(fit)
            .attr("class", "line")
            .attr("d", function(d) { return fit_line(d); });
      }
    
    var x_axis = histogram_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);    
        
    x_axis.selectAll ("text").attr ("transform", "rotate(45)").attr("dx","1em").attr("dy","0.5em");
}

datamonkey.hivtrace.histogram = hivtrace_histogram;

//_ = require('underscore');

function hivtrace_cluster_adjacency_list(obj) {

    var nodes = obj.Nodes,
        edges = obj.Edges;


    var adjacency_list = {};

    edges.forEach(function(e, i) {

        function in_nodes(n, id) {
            return n.id == id;
        }

        var seq_ids = e["sequences"];

        var n1 = nodes.filter(function(n) {
                return in_nodes(n, seq_ids[0])
            })[0],
            n2 = nodes.filter(function(n) {
                return in_nodes(n, seq_ids[1])
            })[0];

        adjacency_list[n1.id] ? adjacency_list[n1.id].push(n2) : adjacency_list[n1.id] = [n2];
        adjacency_list[n2.id] ? adjacency_list[n2.id].push(n1) : adjacency_list[n2.id] = [n1];

    });


    return adjacency_list;

}


function hivtrace_new_cluster_adjacency_list(obj) {

    var nodes = obj.Nodes,
        edges = obj.Edges;


    nodes.forEach (function (n) {
        n.neighbors = d3.set();
    });
    
    edges.forEach (function (e) {
        nodes[e.source].neighbors.add(e.target);
        nodes[e.target].neighbors.add(e.source);
    });

}

// Reconstructs path from floyd-warshall algorithm
function hivtrace_get_path(next, i, j) {

    var all_paths = [];
    var i = parseInt(i);
    var j = parseInt(j);

    for (var c = 0; c < next[i][j].length; c++) {

        var k = next[i][j][c];
        var intermediate = k;

        if (intermediate == null || intermediate == i) {
            return [
                [parseInt(i), parseInt(j)]
            ];
        } else {

            var paths_i_k = hivtrace_get_path(next, i, intermediate);
            var paths_k_j = hivtrace_get_path(next, intermediate, j);

            for (var i_k_index = 0; i_k_index < paths_i_k.length; i_k_index++) {
                var i_k = paths_i_k[i_k_index];
                for (var k_j_index = 0; k_j_index < paths_k_j.length; k_j_index++) {
                    var k_j = paths_k_j[k_j_index];
                    if (i_k.length) {
                        if ((i_k[0] == i) && (i_k[i_k.length - 1] == k) && (k_j[0] == k) && (k_j[k_j.length - 1] == j)) {
                            i_k.pop()
                            all_paths.push(i_k.concat(k_j));
                        }
                    }
                }
            }
        }
    }

    return all_paths;

}

function hivtrace_paths_with_node(node, next, i, j) {

    var paths = hivtrace_get_path(next, i, j);

    // Retrieve intermediary paths
    paths = paths.map(function(sublist) {
        return sublist.slice(1, -1)
    });

    if (!paths) {
        return 0;
    }

    var num_nodes = [];

    for (var i = 0; i < paths.length; i++) {
        sublist = paths[i];
        num_nodes.push(d3.sum(sublist.map(function(n) {
            return n == node;
        })));
    }

    var mean = d3.mean(num_nodes);

    if (mean == undefined) {
        mean = 0;
    }

    return mean;

}


// Same as compute shortest paths, but with an additional next parameter for reconstruction
function hivtrace_compute_shortest_paths_with_reconstruction(obj, subset, use_actual_distances) {

    // Floyd-Warshall implementation
    var distances = [];
    var next = [];
    var nodes = obj.Nodes;
    var edges = obj.Edges;
    var node_ids = [];

    var adjacency_list = datamonkey.hivtrace.cluster_adjacency_list(obj);

    if (!subset) {
        subset = Object.keys(adjacency_list);
    }

    var node_count = subset.length;

    for (var i = 0; i < subset.length; i++) {
        var a_node = subset[i];
        var empty_arr = _.range(node_count).map(function(d) {
            return null
        });
        var zeroes = _.range(node_count).map(function(d) {
            return null
        });
        distances.push(zeroes);
        next.push(empty_arr);
    };

    for (var index = 0; index < subset.length; index++) {
        var a_node = subset[index];
        for (var index2 = 0; index2 < subset.length; index2++) {
            var second_node = subset[index2];
            if (second_node != a_node) {
                if (adjacency_list[a_node].map(function(n) {
                        return n.id
                    }).indexOf(second_node) != -1) {
                    distances[index][index2] = 1;
                    distances[index2][index] = 1;
                }
            }
        }
    }

    for (var index_i = 0; index_i < subset.length; index_i++) {
        var n_i = subset[index_i];
        for (var index_j = 0; index_j < subset.length; index_j++) {
            var n_j = subset[index_j];
            if (index_i == index_j) {
                next[index_i][index_j] = [];
            } else {
                next[index_i][index_j] = [index_i];
            }
        }
    }

    // clone distances
    var distances2 = _.map(distances, _.clone);
    var c = 0;

    for (var index_k = 0; index_k < subset.length; index_k++) {
        var n_k = subset[index_k];
        for (var index_i = 0; index_i < subset.length; index_i++) {
            var n_i = subset[index_i];
            for (var index_j = 0; index_j < subset.length; index_j++) {
                var n_j = subset[index_j];

                if (n_i != n_j) {

                    d_ik = distances[index_k][index_i];
                    d_jk = distances[index_k][index_j];
                    d_ij = distances[index_i][index_j];

                    if (d_ik != null && d_jk != null) {
                        d_ik += d_jk;
                        if (d_ij == null || (d_ij > d_ik)) {
                            distances2[index_i][index_j] = d_ik;
                            distances2[index_j][index_i] = d_ik;
                            next[index_i][index_j] = [];
                            next[index_i][index_j] = next[index_i][index_j].concat(next[index_k][index_j]);
                            continue;
                        } else if (d_ij == d_ik) {
                            next[index_i][index_j] = next[index_i][index_j].concat(next[index_k][index_j]);
                        }
                    }
                    c++;
                    distances2[index_j][index_i] = distances[index_j][index_i];
                    distances2[index_i][index_j] = distances[index_i][index_j];
                }
            }
        }

        var t = distances2;
        distances2 = distances;
        distances = t;

    }

    return {
        'ordering': subset,
        'distances': distances,
        'next': next
    };

}

function hivtrace_filter_to_node_in_cluster(node, obj) {

    var nodes = obj.Nodes,
        edges = obj.Edges,
        cluster_id = null;

    // Retrieve nodes that are part of the cluster
    var node_obj = nodes.filter(function(n) {
        return node == n.id;
    });

    if (node_obj) {
        cluster_id = node_obj[0].cluster;
    } else {
        console.log('could not find node');
        return null;
    }

    // Filter out all edges and nodes that belong to the cluster
    var nodes_in_cluster = nodes.filter(function(n) {
        return cluster_id == n.cluster;
    });
    var node_ids = nodes_in_cluster.map(function(n) {
        return n.id
    });
    var edges_in_cluster = edges.filter(function(e) {
        return node_ids.indexOf(e.sequences[0]) != -1
    });

    var filtered_obj = {};
    filtered_obj["Nodes"] = nodes_in_cluster;
    filtered_obj["Edges"] = edges_in_cluster;
    return filtered_obj;

}

function hivtrace_compute_betweenness_centrality_all_nodes_in_cluster(cluster, obj, cb) {

    var nodes = obj.Nodes,
        edges = obj.Edges;


    var nodes_in_cluster = nodes.filter(function(n) {
        return cluster == n.cluster;
    });
    var node_ids = nodes_in_cluster.map(function(n) {
        return n.id
    });
    var edges_in_cluster = edges.filter(function(e) {
        return node_ids.indexOf(e.sequences[0]) != -1
    });

    var filtered_obj = {};
    filtered_obj["Nodes"] = nodes_in_cluster;
    filtered_obj["Edges"] = edges_in_cluster;

    // get length of cluster
    if (nodes_in_cluster.length > 70) {
        cb('cluster too large', null);
        return;
    }

    // get paths
    var paths = hivtrace_compute_shortest_paths_with_reconstruction(filtered_obj);
    var node_ids = nodes_in_cluster.map(function(n) {
        return n.id
    });

    var betweenness = {}
    nodes_in_cluster.forEach(function(n) {
        betweenness[n.id] = hivtrace_compute_betweenness_centrality(n.id, filtered_obj, paths);
    });

    cb(null, betweenness);
    return;

}

// Returns dictionary of nodes' betweenness centrality
// Utilizes the Floyd-Warshall Algorithm with reconstruction
function hivtrace_compute_betweenness_centrality(node, obj, paths) {

    if (!paths) {
        var filtered_obj = hivtrace_filter_to_node_in_cluster(node, obj)
        paths = hivtrace_compute_shortest_paths_with_reconstruction(filtered_obj);
    }

    // find index of id
    var index = paths['ordering'].indexOf(node);

    if (index == -1) {
        return null;
    }

    var length = paths['distances'].length;

    if (length != 2) {
        scale = 1 / ((length - 1) * (length - 2));
    } else {
        scale = 1;
    }


    // If s->t goes through 1, add to sum
    // Reconstruct each shortest path and check if node is in it
    var paths_with_node = [];
    for (i in _.range(length)) {
        for (j in _.range(length)) {
            paths_with_node.push(hivtrace_paths_with_node(index, paths['next'], i, j));
        }
    }

    return d3.sum(paths_with_node) * scale;

}


function hivtrace_compute_node_degrees(obj) {

    var nodes = obj.Nodes,
        edges = obj.Edges;

    for (var n in nodes) {
        nodes[n].degree = 0;
    }

    for (var e in edges) {
        nodes[edges[e].source].degree++;
        nodes[edges[e].target].degree++;
    }

}

function hivtrace_get_node_by_id(id, obj) {
    return obj.Nodes.filter(function(n) {
        return id == n.id
    })[0] || undefined;
}

function hivtrace_compute_cluster_betweenness(obj, callback) {

    var nodes = obj.Nodes;

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    // Get all unique clusters
    var clusters = nodes.map(function(n) {
        return n.cluster
    });
    var unique_clusters = clusters.filter(onlyUnique);

    var cb_count = 0;

    function cb(err, results) {

        cb_count++;

        for (node in results) {
            hivtrace_get_node_by_id(node, obj)['betweenness'] = results[node];
        }

        if (cb_count >= unique_clusters.length) {
            callback('done');
        }

    }

    // Compute betweenness in parallel
    unique_clusters.forEach(function(cluster_id) {
        datamonkey.hivtrace.betweenness_centrality_all_nodes_in_cluster(cluster_id, obj, cb);
    });

    // once all settled callback

}


function hivtrace_is_contaminant(node) {
    return node.attributes.indexOf('problematic') != -1;
}

function hivtrace_convert_to_csv(obj, callback) {
    //Translate nodes to rows, and then use d3.format
    hivtrace_compute_node_degrees(obj);

    hivtrace_compute_cluster_betweenness(obj, function(err) {
        var node_array = obj.Nodes.map(function(d) {
            return [d.id, d.cluster, d.degree, d.betweenness, hivtrace_is_contaminant(d), d.attributes.join(';')]
        });
        node_array.unshift(['seqid', 'cluster', 'degree', 'betweenness', 'is_contaminant', 'attributes'])
        node_csv = d3.csv.format(node_array);
        callback(null, node_csv);
    });
}

function hivtrace_export_csv_button(graph, tag) {

    var data = hivtrace_convert_to_csv(graph, function(err, data) {
        if (data != null) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
            pom.setAttribute('download', 'export.csv');
            pom.className = 'btn btn-default btn-sm';
            pom.innerHTML = '<span class="glyphicon glyphicon-floppy-save"></span> Export Results';
            $(tag).append(pom);
        }
    });

}

function hiv_trace_export_table_to_text(parent_id, table_id, sep) {

    var the_button = d3.select(parent_id).append("a")
        .attr("target", "_blank")
        .on("click", function(data, element) {
            var table_tag = d3.select(this).attr("data-table");
            var table_text = datamonkey.helpers.table_to_text(table_tag);
            datamonkey.helpers.export_handler(table_text, table_tag.substring(1) + ".tsv", "text/tab-separated-values");
        })
        .attr("data-table", table_id);

    the_button.append("i").classed("fa fa-download fa-2x", true);
    return the_button;

}

hivtrace_compute_local_clustering_coefficients = _.once (function (obj) {

  datamonkey.hivtrace.new_cluster_adjacency_list(obj);

  var nodes = obj.Nodes;

  nodes.forEach (function (n) {
  
    var a_node = n;
    var neighborhood_size = a_node.neighbors.size();

    if (neighborhood_size < 2) {
        a_node.lcc = undefined;
    } else {

        if (neighborhood_size > 500) {
            a_node.lcc = datamonkey.hivtrace.too_large;     
        } else {
            // count triangles
            neighborhood = a_node.neighbors.values();
            counter = 0;
            for (n1 = 0; n1 < neighborhood_size; n1 += 1) {
                for (n2 = n1 + 1; n2 < neighborhood_size; n2 += 1) {
                    if (nodes [neighborhood[n1]].neighbors.has (neighborhood[n2])) {
                        counter ++;
                    }
                }
            }
            a_node.lcc = 2 * counter / neighborhood_size / (neighborhood_size - 1);
        }
    }

  });

});

function hivtrace_render_settings(settings, explanations) {
    // TODO:
    //d3.json (explanations, function (error, expl) {
    //    //console.log (settings);
    //});
}

function hivtrace_format_value(value, formatter) {

    if (typeof value === 'undefined') {
        return "Not computed";
    }
    if (value === datamonkey.hivtrace.undefined) {
        return "Undefined";
    }
    if (value === datamonkey.hivtrace.too_large) {
        return "Size limit";
    }

    if (value === datamonkey.hivtrace.processing) {
        return '<span class="fa fa-spin fa-spinner"></span>';
    }

    return formatter ? formatter(value) : value;

}


if (typeof datamonkey == 'undefined') {
    datamonkey = function() {};
}

if (typeof datamonkey.hivtrace == 'undefined') {
    datamonkey.hivtrace = function() {};
}

datamonkey.hivtrace.compute_node_degrees = hivtrace_compute_node_degrees;
datamonkey.hivtrace.export_csv_button = hivtrace_export_csv_button;
datamonkey.hivtrace.convert_to_csv = hivtrace_convert_to_csv;
datamonkey.hivtrace.betweenness_centrality = hivtrace_compute_betweenness_centrality;
datamonkey.hivtrace.betweenness_centrality_all_nodes_in_cluster = hivtrace_compute_betweenness_centrality_all_nodes_in_cluster;
datamonkey.hivtrace.cluster_adjacency_list = hivtrace_cluster_adjacency_list;
datamonkey.hivtrace.new_cluster_adjacency_list = hivtrace_new_cluster_adjacency_list;
datamonkey.hivtrace.analysis_settings = hivtrace_render_settings;
datamonkey.hivtrace.export_table_to_text = hiv_trace_export_table_to_text;
datamonkey.hivtrace.compute_local_clustering = hivtrace_compute_local_clustering_coefficients;
datamonkey.hivtrace.undefined = new Object();
datamonkey.hivtrace.too_large = new Object();
datamonkey.hivtrace.processing = new Object();
datamonkey.hivtrace.format_value = hivtrace_format_value;

if (!datamonkey) {
    var datamonkey = {};
}

datamonkey.relax = function() {

    settings = {
        'omegaPlot': {},
        'tree-options': {
            /* value arrays have the following meaning
                [0] - the value of the attribute
                [1] - does the change in attribute value trigger tree re-layout?
            */
            'datamonkey-relax-tree-model': [null, true],
            'datamonkey-relax-tree-highlight': [null, false],
            'datamonkey-relax-tree-branch-lengths': [true, true],
            'datamonkey-relax-tree-fill-legend': [true, false],
            'datamonkey-relax-tree-fill-color': [true, false]
        },
        'suppress-tree-render': false,
        'chart-append-html' : true
    };


    var width = 800,
        height = 600,
        alpha_level = 0.05,
        omega_format = d3.format(".3r"),
        prop_format = d3.format(".2p"),
        fit_format = d3.format(".2f"),
        p_value_format = d3.format(".4f"),
        analysis_data = null,
        branch_annotations = [],
        branch_lengths = [];

    var tree = d3.layout.phylotree("body")
        .size([height, width])
        .separation(function(a, b) {
            return 0;
        });

    set_handlers      ();
    set_tree_handlers (tree);

    var svg = d3.select("#tree_container").append("svg")
        .attr("width", width)
        .attr("height", height);

    var scaling_exponent = 0.33;


    function set_handlers() {

          
    
        $("#datamonkey-relax-error-hide").on("click", function(e) {
            d3.select("#datamonkey-relax-error").style("display", "none");
            e.preventDefault();
        });

        $("#datamonkey-relax-load-json").on("change", function(e) {
            // FileList object
            var files = e.target.files; 

            if (files.length == 1) {
                var f = files[0];
                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        analysis_data = JSON.parse(e.target.result);
                        render(analysis_data);
                    };

                })(f);

                reader.readAsText(f);
            }

            e.preventDefault();
        });
        
        $(".datamonkey-relax-tree-trigger").on("click", function(e) {
            render_tree();
        });
    }


    function default_tree_settings() {
        tree.branch_name(null);
        tree.node_span('equal');
        tree.options({
            'draw-size-bubbles': false,
            'selectable': false
        }, false);
        tree.font_size(18);
        tree.scale_bar_font_size(14);
        tree.node_circle_size(0);
        tree.branch_length(function(n) {
            if (branch_lengths) {
                return branch_lengths[n.name] || 0;
            }
            return undefined;
        });
        tree.style_edges(edge_colorizer);
        tree.style_nodes(node_colorizer);
        tree.spacing_x(30, true);
    }


    render_color_scheme = function(svg_container, attr_name, do_not_render) {
        var svg = d3.select("#" + svg_container).selectAll("svg").data([omega_color.domain()]);
        svg.enter().append("svg");
        svg.selectAll("*").remove();

        if (branch_annotations && !do_not_render) {
            var bar_width = 70,
                bar_height = 300,
                margins = {
                    'bottom': 30,
                    'top': 15,
                    'left': 40,
                    'right': 2
                };

            svg.attr("width", bar_width)
                .attr("height", bar_height);



            this_grad = svg.append("defs").append("linearGradient")
                .attr("id", "_omega_bar")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

            var omega_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, 1]),
                axis_scale = d3.scale.pow().exponent(scaling_exponent)
                .domain(d3.extent(omega_color.domain()))
                .range([0, bar_height - margins['top'] - margins['bottom']]);


            omega_color.domain().forEach(function(d) {
                this_grad.append("stop")
                    .attr("offset", "" + omega_scale(d) * 100 + "%")
                    .style("stop-color", omega_color(d));
            });

            var g_container = svg.append("g").attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")");

            g_container.append("rect").attr("x", 0)
                .attr("width", bar_width - margins['left'] - margins['right'])
                .attr("y", 0)
                .attr("height", bar_height - margins['top'] - margins['bottom'])
                .style("fill", "url(#_omega_bar)");


            var draw_omega_bar = d3.svg.axis().scale(axis_scale)
                .orient("left")
                .tickFormat(d3.format(".1r"))
                .tickValues([0, 0.01, 0.1, 0.5, 1, 2, 5, 10]);

            var scale_bar = g_container.append("g");
            scale_bar.style("font-size", "14")
                .attr("class", "omega-bar")
                .call(draw_omega_bar);

            scale_bar.selectAll("text")
                .style("text-anchor", "right");

            var x_label = _label = scale_bar.append("g").attr("class", "omega-bar");
            x_label = x_label.selectAll("text").data([attr_name]);
            x_label.enter().append("text");
            x_label.text(function(d) {
                return $('<textarea />').html(d).text();
            })
                .attr("transform", "translate(" + (bar_width - margins['left'] - margins['right']) * 0.5 + "," + (bar_height - margins['bottom']) + ")")
                .style("text-anchor", "middle")
                .style("font-size", "18")
                .attr("dx", "0.0em")
                .attr("dy", "0.1em");
        }
    }


    render_tree = function(skip_render) {

        if (!settings['suppress-tree-render']) {

            var do_layout = false;

            for (var k in settings["tree-options"]) {
                var controller = d3.select("#" + k),
                    controller_value = (controller.attr("value") || controller.property("checked"));
                    
                if (controller_value != settings["tree-options"][k][0]) {
                    settings["tree-options"][k][0] = controller_value;
                    do_layout = do_layout || settings["tree-options"][k][1];
                }
            }
            

            var which_model = settings["tree-options"]["datamonkey-relax-tree-model"][0];
            
            branch_lengths     = settings["tree-options"]["datamonkey-relax-tree-branch-lengths"][0] ? analysis_data["fits"][which_model]["branch-lengths"] : null;
            branch_annotations = analysis_data["fits"][which_model]["branch-annotations"];
            
 
            partition = (settings["tree-options"]["datamonkey-relax-tree-highlight"] ? analysis_data["partition"][settings["tree-options"]["datamonkey-relax-tree-highlight"][0]] : null) || null;


            omega_color = d3.scale.pow().exponent(scaling_exponent)
                .domain([0, 0.25, 1, 5, 10])
                .range(settings["tree-options"]["datamonkey-relax-tree-fill-color"][0] ? ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"] : ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"])
                .clamp(true);


            render_color_scheme("color_legend", analysis_data["fits"][which_model]["annotation-tag"], !(settings["tree-options"]["datamonkey-relax-tree-fill-legend"][0]));

            if (!skip_render) {
                if (do_layout) {
                    tree.update_layout();
                }
                d3_phylotree_trigger_refresh (tree);
            }

        }
    }

    function relax_render_error(e) {
        d3.select("#datamonkey-relax-error-text").text(e);
        d3.select("#datamonkey-relax-error").style('display', 'block');
        //console.log(e);
    }



    render = function(json) {

        try {
            analysis_data = json;
            d3.select('#summary-pmid').text("PubMed ID " + json['PMID'])
                .attr("href", "http://www.ncbi.nlm.nih.gov/pubmed/" + json['PMID']);

            var relaxation_K = json["fits"]["Alternative"]["K"];
            var p = json["relaxation-test"]["p"];

            d3.select('#summary-direction').text(relaxation_K > 1 ? 'intensification' : 'relaxation');
            d3.select('#summary-evidence').text(p <= alpha_level ? 'significant' : 'not significant');
            d3.select('#summary-pvalue').text(p_value_format(p));
            d3.select('#summary-LRT').text(fit_format(json["relaxation-test"]["LR"]));
            d3.select('#summary-K').text(fit_format(relaxation_K));

            d3.select("#datamonkey-relax-error").style('display', 'none');

            var table_row_data = [];
            var omega_distributions = {};

            for (var m in json["fits"]) {
                var this_model_row = [],
                    this_model = json["fits"][m];

                this_model_row = [this_model['display-order'],
                    "",
                    m,
                    fit_format(this_model['log-likelihood']),
                    this_model['parameters'],
                    fit_format(this_model['AIC-c']),
                    format_run_time(this_model['runtime']),
                    fit_format(d3.values(this_model["branch-lengths"]).reduce(function(p, c) {
                        return p + c;
                    }, 0))
                ];

                omega_distributions[m] = {};

                var distributions = [];
                for (var d in this_model["rate-distributions"]) {
                    var this_distro = this_model["rate-distributions"][d];
                    var this_distro_entry = [d, "", "", ""];

                    omega_distributions[m][d] = this_distro.map(function(d) {
                        return {
                            'omega': d[0],
                            'weight': d[1]
                        };
                    });

                    for (var k = 0; k < this_distro.length; k++) {
                        this_distro_entry[k + 1] = (omega_format(this_distro[k][0]) + " (" + prop_format(this_distro[k][1]) + ")");
                    }
                    distributions.push(this_distro_entry);
                }


                distributions.sort(function(a, b) {
                    return a[0] < b[0] ? -1 : (a[0] == b[0] ? 0 : 1);
                });
                this_model_row = this_model_row.concat(distributions[0]);
                this_model_row[1] = distributions[0][0];
                table_row_data.push(this_model_row);

                for (var d = 1; d < distributions.length; d++) {
                    var this_distro_entry = this_model_row.map(function(d, i) {
                        if (i) return "";
                        return d;
                    });
                    this_distro_entry[1] = distributions[d][0];
                    for (var k = this_distro_entry.length - 4; k < this_distro_entry.length; k++) {
                        this_distro_entry[k] = distributions[d][k - this_distro_entry.length + 4];
                    }
                    table_row_data.push(this_distro_entry);
                }

            }

            table_row_data.sort(function(a, b) {
                if (a[0] == b[0]) {
                    return a[1] < b[1] ? -1 : (a[1] == b[1] ? 0 : 1);
                }
                return a[0] - b[0];
            });
            table_row_data = table_row_data.map(function(r) {
                return r.slice(2);
            });

            model_rows = d3.select('#summary-model-table').selectAll("tr").data(table_row_data);
            model_rows.enter().append('tr');
            model_rows.exit().remove();
            model_rows = model_rows.selectAll("td").data(function(d) {
                return d;
            });
            model_rows.enter().append("td");
            model_rows.html(function(d) {
                return d;
            });

            _.templateSettings = {
              evaluate:    /\{\%(.+?)\%\}/g,
              interpolate: /\{\{(.+?)\}\}/g,
              variable    : "rc"
            };

            var omega_plot_template = _.template(
              $("script.omega-plots").html()
            );
            

            // Filter omega_distributions that have Test and Reference

            _.map(omega_distributions, function(item,key) { 
              item.key   = key.toLowerCase().replace(/ /g, '-'); 
              item.label = key; 
            });

            var distributions_to_chart = _.filter(omega_distributions, function(d) { return d.hasOwnProperty('Reference') });
            var omega_plot_html = omega_plot_template(distributions_to_chart);
            

            if (settings['chart-append-html']) {
                $("#omega-plots").append(omega_plot_html);
                settings['chart-append-html'] = false;
            }

            // Replace with for loop
            _.each(distributions_to_chart, function(item, key) {

              var svg_element =  item.key + '-svg';
              var container_element =  '#' + item.key;
              var export_svg =  '#export-' + item.key + '-svg';
              var export_png =  '#export-' + item.key + '-png';

              if(item.hasOwnProperty('Reference')) {

                omegaPlot(item["Reference"], item["Test"], {'svg' : svg_element });
                d3.select(container_element).style ('display', 'block');

                // TODO: Make this a data-bind
                $(export_svg).on('click', function(e) { 
                  datamonkey.save_image("svg", '#' + svg_element); 
                });

                $(export_png).on('click', function(e) { 
                  datamonkey.save_image("png", '#' + svg_element); 
                });
              }

            });

            settings['suppress-tree-render'] = true;

            var def_displayed = false;

            var model_list = d3.select("#datamonkey-relax-tree-model-list").selectAll("li").data(d3.keys(json["fits"]).map(function(d) {
                return [d];
            }).sort());
            model_list.enter().append("li");
            model_list.exit().remove();
            model_list = model_list.selectAll("a").data(function(d) {
                return d;
            });
            model_list.enter().append("a");
            model_list.attr("href", "#").on("click", function(d, i) {
                d3.select("#datamonkey-relax-tree-model").attr("value", d);
                render_tree();
            });
            model_list.text(function(d) {
                if (d == "General Descriptive") {
                    def_displayed = true;
                    this.click();
                }
                if (!def_displayed && d == "Alternative") {
                    def_displayed = true;
                    this.click();
                }
                if (!def_displayed && d == "Partitioned MG94xREV") {
                    def_displayed = true;
                    this.click();
                }

                return d;
            });

            var partition_list = d3.select("#datamonkey-relax-tree-highlight-branches").selectAll("li").data([
                ['None']
            ].concat(d3.keys(json["partition"]).map(function(d) {
                return [d];
            }).sort()));
            partition_list.enter().append("li");
            partition_list.exit().remove();
            partition_list = partition_list.selectAll("a").data(function(d) {
                return d;
            });
            partition_list.enter().append("a");
            partition_list.attr("href", "#").on("click", function(d, i) {
                d3.select("#datamonkey-relax-tree-highlight").attr("value", d);
                render_tree();
            });
            partition_list.text(function(d) {
                if (d == "RELAX.test") {
                    this.click();
                }
                return d;
            });

            settings['suppress-tree-render'] = false;
            render_tree(true);
            default_tree_settings();
            tree(analysis_data["tree"]).svg(svg);
            tree.layout();

        } catch (e) {
            relax_render_error(e.message);
            //console.log(e.message);
        }

    }

    function format_run_time(seconds) {
        var duration_string = "";
        seconds = parseFloat(seconds);
        var split_array = [Math.floor(seconds / (24 * 3600)), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60],
            quals = ["d.", "hrs.", "min.", "sec."];

        split_array.forEach(function(d, i) {
            if (d) {
                duration_string += " " + d + " " + quals[i];
            }
        });

        return duration_string;
    }

    function edge_colorizer(element, data) {

        if (branch_annotations) {
            element.style('stroke', omega_color(branch_annotations[data.target.name]) || null);
            $(element[0][0]).tooltip('destroy');
            $(element[0][0]).tooltip({
                'title': omega_format(branch_annotations[data.target.name]),
                'html': true,
                'trigger': 'hover',
                'container': 'body',
                'placement': 'auto'
            })
        } else {
            element.style('stroke', null);
            $(element[0][0]).tooltip('destroy');
        }


        element.style('stroke-width', (partition && partition[data.target.name]) ? '8' : '4')
            .style('stroke-linejoin', 'round')
            .style('stroke-linecap', 'round');

    }
    
    function node_colorizer(element, data) {  
        if (partition) { 
            element.style('opacity', (partition && partition[data.name]) ? '1' : '0.25');
        } else {
            element.style('opacity', '1');        
        }
    }

    /* Distribution plotters */
    omegaPlot = function(data_to_plot, secondary_data, settings) {

        makeSpring = function(x1, x2, y1, y2, step, displacement) {
            if (x1 == x2) {
                y1 = Math.min(y1, y2);
                return "M" + x1 + "," + (y1 - 40) + "v20";
            }



            var spring_data = [],
                point = [x1, y1],
                angle = Math.atan2(y2 - y1, x2 - x1);

            step = [step * Math.cos(angle), step * Math.sin(angle)];
            //spring_data.push (point);
            k = 0;

            if (Math.abs(x1 - x2) < 15) {
                spring_data.push(point);
            } else {
                while (x1 < x2 && point[0] < x2 - 15 || x1 > x2 && point[0] > x2 + 15) {
                    point = point.map(function(d, i) {
                        return d + step[i];
                    });
                    if (k % 2) {
                        spring_data.push([point[0], point[1] + displacement]);
                    } else {
                        spring_data.push([point[0], point[1] - displacement]);
                    }
                    k++;
                    if (k > 100) {
                        break;
                    }
                }
            }
            if (spring_data.length > 1) {
                spring_data.pop();
            }
            spring_data.push([x2, y2]);

            var line = d3.svg.line().interpolate("monotone");

            return line(spring_data);
        }

        var svg_id = settings["svg"] || "primary_omega_plot";

        var legend_id   = settings["legend"] || null;
        var do_log_plot = settings["log"] || true;
        var has_zeros   = false;
        if (do_log_plot) {
            has_zeros = data_to_plot.some (function (d) {return d.omega <= 0;});
            if (secondary_data) {
                has_zeros = has_zeros || data_to_plot.some (function (d) {return d.omega <= 0;});
            }
        }

        var dimensions = settings["dimensions"] || {
            "width": 600,
            "height": 400
        };

        var margins = {
                'left': 50,
                'right': 15,
                'bottom': 35,
                'top': 35
            },
            plot_width = dimensions["width"] - margins['left'] - margins['right'],
            plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

        var k_p = settings["k"] || null;


        var domain = settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function(d) {
            return d.omega;
        }).concat(data_to_plot.map(function(d) {
            return d.omega;
        })) : data_to_plot.map(function(d) {
            return d.omega;
        }));
        domain[0] *= 0.5;

        var omega_scale = (do_log_plot ? (has_zeros ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
            .range([0, plot_width]).domain(domain).nice(),
            proportion_scale = d3.scale.linear().range([plot_height, 0]).domain([-0.05, 1]).clamp(true);

        // compute margins -- circle AREA is proportional to the relative weight
        // maximum diameter is (height - text margin)

        var svg = d3.select("#" + svg_id).attr("width", dimensions.width)
            .attr("height", dimensions.height),
            plot = svg.selectAll(".container");

        svg.selectAll("defs").remove();

        svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("refX", 10) /*must be smarter way to calculate shift*/
            .attr("refY", 4)
            .attr("markerWidth", 10)
            .attr("markerHeight", 8)
            .attr("orient", "auto")
            .attr("stroke", "#000")
            .attr("fill", "#000")
            .append("path")
            .attr("d", "M 0,0 V8 L10,4 Z");

        if (plot.empty()) {
            plot = svg.append("g").attr("class", "container");
        }

        plot.attr("transform", "translate(" + margins["left"] + " , " + margins["top"] + ")");

        var reference_omega_lines = plot.selectAll(".omega-line-reference"),
            displacement_lines = plot.selectAll(".displacement-line");

        if (secondary_data) {

            var diffs = data_to_plot.map(function(d, i) {
                return {
                    'x1': d.omega,
                    'x2': secondary_data[i].omega,
                    'y1': d.weight * 0.98,
                    'y2': secondary_data[i].weight * 0.98
                };
            });


            displacement_lines = displacement_lines.data(diffs);
            displacement_lines.enter().append("path");
            displacement_lines.exit().remove();

            displacement_lines.transition().attr("d", function(d) {
                return makeSpring(omega_scale(d.x1),
                    omega_scale(d.x2),
                    proportion_scale(d.y1 * 0.5),
                    proportion_scale(d.y2 * 0.5),
                    5,
                    5);
            })
                .attr("marker-end", "url(#arrowhead)")
                .attr("class", "displacement-line");


            reference_omega_lines = reference_omega_lines.data(data_to_plot);
            reference_omega_lines.enter().append("line");
            reference_omega_lines.exit().remove();
            reference_omega_lines.transition().attr("x1", function(d) {
                return omega_scale(d.omega);
            })
                .attr("x2", function(d) {
                    return omega_scale(d.omega);
                })
                .attr("y1", function(d) {
                    return proportion_scale(-0.05);
                })
                .attr("y2", function(d) {
                    return proportion_scale(d.weight);
                })
                .style("stroke", function(d) {
                    return "#d62728";
                })
                .attr("class", "omega-line-reference");

        } else {
            reference_omega_lines.remove();
            displacement_lines.remove();
        }

        var omega_lines = plot.selectAll(".omega-line").data(secondary_data ? secondary_data : data_to_plot);

        omega_lines.enter().append("line");
        omega_lines.exit().remove();
        omega_lines.transition().attr("x1", function(d) {
            return omega_scale(d.omega);
        })
            .attr("x2", function(d) {
                return omega_scale(d.omega);
            })
            .attr("y1", function(d) {
                return proportion_scale(-0.05);
            })
            .attr("y2", function(d) {
                return proportion_scale(d.weight);
            })
            .style("stroke", function(d) {
              return "#1f77b4";
            })
            .attr("class", "omega-line");


        var neutral_line = plot.selectAll(".neutral-line").data([1]);
        neutral_line.enter().append("line").attr("class", "neutral-line");
        neutral_line.exit().remove();
        neutral_line.transition().attr("x1", function(d) {
            return omega_scale(d);
        })
            .attr("x2", function(d) {
                return omega_scale(d);
            })
            .attr("y1", 0)
            .attr("y2", plot_height);



        var xAxis = d3.svg.axis()
            .scale(omega_scale)
            .orient("bottom");



        if (do_log_plot) {
            xAxis.ticks(10, has_zeros ? ".2r" : ".1r");
        }


        var x_axis = svg.selectAll(".x.axis");
        var x_label;
        if (x_axis.empty()) {
            x_axis = svg.append("g")
                .attr("class", "x axis");

            x_label = x_axis.append("g").attr("class", "axis-label x-label");
        } else {
            x_label = x_axis.select(".axis-label.x-label");
        }



        x_axis.attr("transform", "translate(" + margins["left"] + "," + (plot_height + margins["top"]) + ")")
            .call(xAxis);
        x_label = x_label.attr("transform", "translate(" + plot_width + "," + margins["bottom"] + ")")
            .selectAll("text").data(["\u03C9"]);
        x_label.enter().append("text");
        x_label.text(function(d) {
            return d
        })
            .style("text-anchor", "end")
            .attr("dy", "0.0em");



        var yAxis = d3.svg.axis()
            .scale(proportion_scale)
            .orient("left")
            .ticks(10, ".1p");

        var y_axis = svg.selectAll(".y.axis");
        var y_label;
        if (y_axis.empty()) {
            y_axis = svg.append("g")
                .attr("class", "y axis");

            y_label = y_axis.append("g").attr("class", "axis-label y-label");
        } else {
            y_label = y_axis.select(".axis-label.y-label");
        }



        y_axis.attr("transform", "translate(" + margins["left"] + "," + margins["top"] + ")")
            .call(yAxis);
        y_label = y_label.attr("transform", "translate(" + (-margins["left"]) + "," + 0 + ")")
            .selectAll("text").data(["Proportion of sites"]);
        y_label.enter().append("text");
        y_label.text(function(d) {
            return d
        })
            .style("text-anchor", "start")
            .attr("dy", "-1em")

    }

};
