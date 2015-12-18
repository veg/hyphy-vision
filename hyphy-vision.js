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

    var image = document.getElementById("hyphy-chart-image");

    image.onload = function() {

      var canvas = document.getElementById("hyphy-chart-canvas");
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

    tree = self.tree;

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

    $(".tree-tab-btn").on('click', function(e) {
      self.tree.placenodes().update();
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
            'transitions': false,
            'left-right-spacing': 'fit-to-size'
        }, true);
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
                .attr("class", "hyphy-omega-bar")
                .call(draw_omega_bar);

            scale_bar.selectAll("text")
                .style("text-anchor", "right");

            var x_label = _label = scale_bar.append("g").attr("class", "hyphy-omega-bar");
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



        var omega_lines = plot.selectAll(".hyphy-omega-line").data(data_to_plot);

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
            .attr("class", "hyphy-omega-line");


        var neutral_line = plot.selectAll(".hyphy-neutral-line").data([1]);
        neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
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


        var x_axis = svg.selectAll(".x.hyphy-axis");
        var x_label;
        if (x_axis.empty()) {
            x_axis = svg.append("g")
                .attr("class", "x hyphy-axis");

            x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
        } else {
            x_label = x_axis.select(".hyphy-axis-label.x-label");
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

        var y_axis = svg.selectAll(".y.hyphy-axis");
        var y_label;
        if (y_axis.empty()) {
            y_axis = svg.append("g")
                .attr("class", "y hyphy-axis");

            y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
        } else {
            y_label = y_axis.select(".hyphy-axis-label.y-label");
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


  var omega_lines = plot.selectAll(".hyphy-omega-line").data(data_to_plot);
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
  .attr("class", "hyphy-omega-line");

  var neutral_line = plot.selectAll(".hyphy-neutral-line").data([1]);
  neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
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


  var x_axis = svg.selectAll(".x.hyphy-axis");
  var x_label;
  if (x_axis.empty()) {
    x_axis = svg.append("g")
      .attr("class", "x hyphy-axis");

    x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
  } else {
    x_label = x_axis.select(".hyphy-axis-label.x-label");
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

  var y_axis = svg.selectAll(".y.hyphy-axis");
  var y_label;
  if (y_axis.empty()) {
    y_axis = svg.append("g")
      .attr("class", "y hyphy-axis");

    y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
  } else {
    y_label = y_axis.select(".hyphy-axis-label.y-label");
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
                         .attr  ("class", "hyphy-omega-bar")
                         .call (draw_omega_bar);
                     
          scale_bar.selectAll ("text")
                         .style ("text-anchor", "right");
                     
          var x_label =_label = scale_bar.append ("g").attr("class", "hyphy-omega-bar");
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

var FadeSummary = React.createClass({displayName: "FadeSummary",

  float_format : d3.format(".2f"),

  countBranchesTested: function(branches_tested) {
    if(branches_tested) {
      return branches_tested.split(';').length;
    } else {
      return 0;
    }
  },

  getDefaultProps : function() {
    return {
     subs : []
    };

  },

  componentDidMount: function() {

    this.setProps({
       alpha_level : 0.05,
       sequences : this.props.msa.sequences,
       subs : this.props.fade_results["TREE_LENGTHS"][0],
       sites : this.props.msa.sites,
       model : this.props.fade_results["MODEL_INFO"],
       grid_desc : this.props.fade_results["GRID_DESCRIPTION"],
       branches_tested : this.props.fade_results["BRANCHES_TESTED"]
    });

  },

  render: function() {

    var self = this;

    return (
          React.createElement("dl", {className: "dl-horizontal"}, 
            React.createElement("dt", null, "Data summary"), 
            React.createElement("dd", null, this.props.sequences, " sequences with ", this.props.partitions, " partitions."), React.createElement("dd", null, 
            React.createElement("div", {className: "alert"}, "These sequences have not been screened for recombination. Selection analyses of alignments with recombinants in them using a single tree may generate ", React.createElement("u", null, "misleading"), " results.")), 
            this.props.msa.partition_info.map(function(partition, index) {
              return (React.createElement("div", null, React.createElement("dt", null, "Partition ", partition["partition"]), React.createElement("dd", null, " ", self.float_format(self.props.subs[index]), " subs/ aminoacid  site"), React.createElement("dd", null, partition["endcodon"] - partition["startcodon"], " aminoacids")))
            }), 
            React.createElement("dt", null, "Settings"), React.createElement("dd", null, this.props.model), React.createElement("dd", null, this.props.grid_desc), 
            React.createElement("dd", null, "Directional model applied to ", self.countBranchesTested(this.props.branches_tested), " branches")
          )
        )
  }

});

// Will need to make a call to this
// omega distributions
function render_fade_summary(json, msa) {
  React.render(
    React.createElement(FadeSummary, {fade_results: json, msa: msa}),
    document.getElementById("summary-div")
  );
}

if (!datamonkey) {
    var datamonkey = {};
}

datamonkey.fade = function(json) { 
  
  var _colorizerB = d3.interpolateRgb  (d3.rgb(0,0,255),d3.rgb(255,255,255));
  var _colorizerR = d3.interpolateRgb  (d3.rgb(255,255,255),d3.rgb(255,0,0));
  var _use_BF = false;

  fade_headers = [
    ['Site','A','C','D','E','F','G','H','I','K','L','M','N','P','Q','R','S','T','V','W','Y'],
    ['Site','Alanine','Cysteine','Aspartic acid','Glutamic acid','Phenylalanine','Glycine','Histidine','Isoleucine','Lysine','Leucine','Methionine', 'Asparagine','Proline','Glutamine','Arginine','Serine','Threonine','Valine', 'Tryptophan','Tyrosin']
  ];

  var fade_results = json['results']["FADE"];

  var dict_to_array = function(dict) {
          ar = []
          for (k in dict) {
              ar.push (dict[k])
          }
          return ar;
      }
      
   var keys_in_dict = function(dict) {
          ar = []
          for (k in dict) {
              ar.push (k)
          }
          return ar;
      }   
      
  //For displaying table with Posteriors
  var display_column_map = function(row) { 
      result = [parseInt(row[0])];
    
    for (k = 4; k < row.length; k+=5) {
          result.push((row[k]));
      }
      return result;
  }

  //For displaying table with BFs
  var display_column_map_bf = function(row) { 
       //result = [parseInt(row[0]),row[3]];
      result = [parseInt(row[0])];
    
    for (k = 5; k < row.length; k+=5) {
          result.push((row[k]));
      }
      return result;
  }


  var row_display_filter = function(d) {

  //Any row, with at least one val > thres must get displayed. Any elements greater must be in red. 
     // if (d.slice(2).reduce (function (a,b) {return a+b;}) == 0.0) {return false;} 
      //console.log (d, this);
      for (k=1;k<21;k++) {
          if (d[k] > this) return true;
      } 
      return false;
  };



  var initial_display = function() {
      //load_data_summary ("summary_div", data_summary);
      $('#filter_on_pvalue').trigger ('submit');
      plot_property_graphs("property_plot_svg",fade_results); //Using a matrix from html
  }

  var set_handlers = function (file_id) {
      $('body').attr ('data-job-id', file_id);
      $('#filter_on_pvalue').submit(function (e) {
              cutoff = parseFloat($('#pvalue')[0].value);
              if (_use_BF) {
                  found = load_analysis_results('prime_table',fade_headers, fade_results,display_column_map_bf,row_display_filter);            
              } else {
                  found = load_analysis_results('prime_table',fade_headers, fade_results,display_column_map,row_display_filter);
              }
              d3.select ("#total_sites_found").selectAll("span").data (found).html (function (d) {return d;});
              return false;
          });

      $('#site_rate_display').on ('show', (function (e) {
              //alert ("Show");
              //console.log (this);
              return true;
          }));

      
        $( 'body' ).on( 'click', '[data-toggle="modal"]', function(event) {
              display_site_properties ($(this).attr ("data-codon-id"));
      });
   

     $( '#set-p-value' ).click(function(event) {
           d3.select ("#pq_selector").html ("Posterior <span class='caret'></span>");
           _use_BF = false;
           event.preventDefault(); 
     } );    

     $( '#set-q-value' ).click(function(event) {
           d3.select ("#pq_selector").html ("BF <span class='caret'></span>");
           _use_BF = true;
           event.preventDefault(); 
     } );    
           
     $( 'body' ).on( 'click', '#property_selector .btn', function(event) {
          event.stopPropagation(); // prevent default bootstrap behavior
          if( $(this).attr('data-toggle') != 'button' ) { // don't toggle if data-toggle="button"
              $(this).toggleClass('active');
          }
           toggle_view("property_plot_svg", parseInt($(this).attr( 'data-property-id' )), $(this).hasClass( 'active' ) ); // button state AFTER the click
      });
  }

  property_plot_done = false;


  var display_site_properties = function(site_id) {
      job_id = $('body').attr ('data-job-id');
      url = "/cgi-bin/datamonkey/wrapHyPhyBF.pl?file=fade_site&mode=1&arguments=" + job_id + "-" + site_id;
      d3.json (url, function (json) { site_info (json, site_id) });
  }

  var toggle_view = function(property_plot, group, show_hide) {
      if (show_hide) {
          prop = 'visible';
      } else {
          prop = 'hidden';
      }
      d3.select("#"+property_plot).selectAll(".dot"+group)
                    .style("visibility", prop);
  }

  var site_info = function(values, site_id) {    
      d3.select ("#site_rate_display_header").html ("Detailed information about site " + site_id);
      elements = dict_to_array(values);
      headers = keys_in_dict (elements[0]).sort();
      header_element = d3.select ('#site_info_table').select("thead");
      header_element.selectAll("th").remove();
      header_element.selectAll("th").data (headers).enter().append("th").html (function (d,i) //Get header of table
          {return d;}
      );

  }


  var plot_property_graphs = function(property_plot, property_info) {
      if (!property_plot_done) {
          property_info = property_info.map (display_column_map);
          property_plot_done = true;
          site_count = property_info.length;
                 
          //console.log (d3.extent (property_info.map(function (d){return d[0];})));
                  
          var margin = {top: 20, right: 40, bottom: 30, left: 40},
              width  = 800 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          var x = d3.scale.linear()
              .range([0, width]);

          var y = d3.scale.linear()
              .range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");
   
           var yAxis2 = d3.svg.axis()
              .scale(y)
              .orient("right");
             
          var make_x_axis = function() {        
              return d3.svg.axis()
                  .scale(x)
                   .orient("bottom")
                   .ticks(20);
          }

          var make_y_axis = function() {        
              return d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(20);
          }

          var svg = d3.select("#"+property_plot)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
               .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  
          x.domain ([1,site_count]);
          y.domain ([0,1]);

          svg.append("g")
                .attr("class", "x hyphy-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .append("text")
                //.attr("class", "label")
                .attr("x", width)
                .attr("y", 30)
                .style("text-anchor", "end")
                .text("Site index");

          svg.append("g")         
                  .attr("class", "grid")
                  .call(make_y_axis()
                      .tickSize(-width, 0, 0)
                      .tickFormat("")
                  );
          
          svg.append("g")         
                  .attr("class", "grid")
                  .attr("transform", "translate(0," + height + ")")
                  .call(make_x_axis()
                      .tickSize(-height, 0, 0)
                      .tickFormat("")
                  );
          
          svg.append("g")
                .attr("class", "y hyphy-axis")
                .call(yAxis)
              .append("text")
                //.attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", -37)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("P(Bias>1)");  

          var y2= svg.append("g")
                .attr("class", "y hyphy-axis")
                .attr("transform", "translate("+width+",0)")
                .call(yAxis2.tickFormat (""));
                
          y2.append("text")
                //.attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("High Posteriors");  

          y2.append("text")
                //.attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 10)
                .attr("x", -height)
                .attr("dy", ".71em")
                .style("text-anchor", "start")
                .text("Low Posteriors");  

          var legend = svg.selectAll(".legend")
                .data(color.domain())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
      
      var h = new Object(); //Hash of numbers -> AA names for labels
      h[1] = "Alanine";
      h[2] = "Cysteine";
      h[3] = "Aspartic acid";
      h[4] = "Glutamic acid";
      h[5] = "Phenylalanine";
      h[6] = "Glycine";
      h[7] = "Histidine";
      h[8] = "Isoleucine";
      h[9] = "Lysine";
      h[10] = "Leucine";
      h[11] = "Methionine";
      h[12] = "Asparagine";
      h[13] = "Proline";
      h[14] = "Glutamine";
      h[15] = "Arginine";
      h[16] = "Serine";
      h[17] = "Threonine";
      h[18] = "Valine";
      h[19] = "Tryptophan";
      h[20] = "Tyrosine";
      
      

          vis = 'visible';
          for (series = 1; series <= 20; series++) {
              if (series > 1) {
                  vis = 'hidden';
              }
              svg.selectAll(".dot"+series)
                    .data(property_info)
                  .enter().append("circle")
                    .attr("class", "dot"+series)
                    .attr("r", function (d) {if (d[series] == 0) return 1; return 3.5;})
                    .attr("cx", function(d) { return x(d[0]); })
                    .attr("cy", function(d) { return y(d[series]); })
                    .style("fill", function(d) { return color(series); })
            .style("opacity", 0.5)
            .style ('visibility', vis)
                    .append ("title").text (function (d) { return "Site " + d[0] + ", " + h[series] + " P(Beta>1) =" + d[series];});
              d3.select ("#show_property" + series).style ("color", function(d) { return color(series); }); //Colour buttons on HTML
          }
        
       } 
          
  }

  var load_data_summary = function(id, json_object) {
      //if (error) return console.warn(error);
      reportable_entries = []
      warnings = []
      for (k in json_object) {
          if (k == 'Warnings') {
              warnings = json_object[k];
          } else {
              reportable_entries.push ({"Phase": k, "Information": json_object[k]});
          }
      }
      info_container = d3.select ("#" + id);
      items = info_container.selectAll("dt").data(reportable_entries);
      items.enter().append("dt").text (function (d) {return d["Phase"]});
      item_count = items[0].length;
      current_child = 2;
      for (z = 1; z <= item_count; z++) { 
          info = dict_to_array(reportable_entries[z-1]["Information"]);
          for (y = 0; y < info.length; y++) {
              info_container.insert ("dd",":nth-child("+current_child+")").data([info[y]]).text (function (d) {return d;});
          }
          key = reportable_entries[z-1]["Phase"];
          if (key in warnings) {
              current_child++;
              info_container.insert ("dd",":nth-child("+current_child+")").selectAll("div").data([warnings[key]]).enter().append("div").classed("alert",true).html (function (d) {return d;})
          }
          current_child += info.length+1;
      }
      return 0;
  }
      
  var load_analysis_results = function (id, headers, matrix, column_selector, condition) {    
      header_element = d3.select ('#' + id).select("thead");
      header_element.selectAll("th").remove();
      header_element.selectAll("th").data (headers[0]).enter().append("th").html (function (d,i) //Get header of table
          {return "<a href='#' data-toggle='tooltip' data-placement = 'right' data-html = true title data-original-title='" + headers[1][i] + "'>" + d + "</a>";}
      );
          
      parent_element = d3.select ('#' + id).select("tbody");
      parent_element.selectAll("tr").remove();
      filtered_matrix = matrix.map (column_selector).filter(condition,cutoff); //Get the columns to display in table
      rows = parent_element.selectAll("tr").data(function (d) {return filtered_matrix;});
      conserved = 0;
      rows.enter().append ("tr").selectAll("td").data (function (d) {return d;}).enter().append("td").
          html (function (d,i) {
              d = parseFloat (d);
              if (i) {
                  if (_use_BF == false)  {
                      if (d > 0.99)  return "1.00";
                      return d.toFixed (2);
                  } else {
                      if (d > 100) return "100+";
                      return d.toFixed (1);
                  }
              }
              return "<b>" + d + "</b> <a href='#site_rate_display' data-toggle='modal' data-codon-id = '" + d + "' data-placement = 'bottom'><i class='icon-list'></i></a>";}
              ).
              classed ("btn-danger", function (d,i,j)  {if (d >= cutoff &&  i>=1 ) {conserved++; return true;} return false;});
              
      d3.select ('#' + id).classed ("table-striped table-hover", true);
      $('a').tooltip(); 
      return [filtered_matrix.length, conserved];
  }


  var numberToColor = function(value) {
      if (typeof (value) == "string") {
          return "rgba (1,0,0,1)";
      }
      rate_value = Math.min(20,Math.max(-20,Math.log (value)/Math.LN20));
      if (rate_value < 0) {
          return _colorizerB ((20+rate_value)/20.);
      }
      return _colorizerR ((rate_value)/20.);
  }

  var fgColor = function(value, normalizer) {
      if (typeof (value) == "string") {
          return "rgba (1,1,1,1)";
      }
      
      var score = 1-Math.exp(-20*value/normalizer);
      
      if (score > 0.45) {
          return "white";
      }
      return "black";
  }

  set_handlers('test');
  initial_display();

}

// TODO: Write documentation
var ModelFits = React.createClass({displayName: "ModelFits",

  getInitialState: function() {
    return { table_row_data: this.getModelRows() };
  },

  format_run_time : function(seconds) {
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
  },

  getModelRows : function() {

    var json = this.props.json;
    var table_row_data = [];
    var omega_distributions = {};
    var fit_format = d3.format(".2f");
    var omega_format = d3.format(".3r");
    var prop_format = d3.format(".2p");
    var p_value_format = d3.format(".4f");

    for (var m in json["fits"]) {

        var this_model_row = [],
            this_model = json["fits"][m];

        this_model_row = [
            this_model['display-order'],
            "",
            m,
            fit_format(this_model['log-likelihood']),
            this_model['parameters'],
            fit_format(this_model['AIC-c']),
            this.format_run_time(this_model['runtime']),
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

    return table_row_data;

  },

  componentDidMount: function() {
    model_rows = d3.select('#summary-model-table').selectAll("tr").data(this.state.table_row_data);
    model_rows.enter().append('tr');
    model_rows.exit().remove();
    model_rows = model_rows.selectAll("td").data(function(d) {
        return d;
    });
    model_rows.enter().append("td");
    model_rows.html(function(d) {
        return d;
    });
  },

  render: function() {

    return (
        React.createElement("div", {className: "col-lg-12"}, 
          React.createElement("ul", {className: "list-group"}, 
            React.createElement("li", {className: "list-group-item"}, 
              React.createElement("h4", {className: "list-group-item-heading"}, React.createElement("i", {className: "fa fa-cubes", styleFormat: "margin-right: 10px"}), "Model fits"), 
               React.createElement("table", {className: "table table-hover table-condensed list-group-item-text", styleFormat: "margin-top:0.5em;"}, 
                  React.createElement("thead", null, 
                      React.createElement("tr", {id: "summary-model-header1"}, 
                        React.createElement("th", null, "Model"), 
                        React.createElement("th", null, React.createElement("em", null, " log "), "L"), 
                        React.createElement("th", null, React.createElement("abbr", {title: "Number of estimated model parameters"}, "# par.")), 
                        React.createElement("th", null, React.createElement("abbr", {title: "Small Sample AIC"}, "AIC", React.createElement("sub", null, "c"))), 
                        React.createElement("th", null, "Time to fit"), 
                        React.createElement("th", null, React.createElement("abbr", {title: "Total tree length, expected substitutions/site"}, "L", React.createElement("sub", null, "tree"))), 
                        React.createElement("th", null, "Branch set"), 
                        React.createElement("th", null, "ω", React.createElement("sub", null, "1")), 
                        React.createElement("th", null, "ω", React.createElement("sub", null, "2")), 
                        React.createElement("th", null, "ω", React.createElement("sub", null, "3"))
                      )
                  ), 
                  React.createElement("tbody", {id: "summary-model-table"})
               )
            )
          )
        )
      )
  }

});

// Will need to make a call to this
// omega distributions
function render_model_fits(json) {
  React.render(
    React.createElement(ModelFits, {json: json}),
    document.getElementById("hyphy-model-fits")
  );
}


// TODO: Write documentation
var OmegaPlot = React.createClass({displayName: "OmegaPlot",

  getDefaultProps : function() {
    return {
      svg_id : null,
      dimensions : { width : 600, height : 400 },
      margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
      has_zeros : false,
      legend_id : null,
      do_log_plot : true,
      k_p : null,
      plot : null,
    };

  },

  getInitialState: function() {
    return null;
  },

  setEvents : function() {
    var self = this;

    d3.select("#" + this.save_svg_id).on('click', function(e) {
      datamonkey.save_image("svg", "#" + self.svg_id);
    });

    d3.select("#" + this.save_png_id).on('click', function(e) {
      datamonkey.save_image("png", "#" + self.svg_id);
    });
  },

  initialize : function() {

    if(!this.props.omegas["Reference"]) {
      return;
    }

    var data_to_plot = this.props.omegas["Reference"];
    var secondary_data = this.props.omegas["Test"];

    // Set props from settings
    this.props.svg_id = this.props.settings.svg_id;
    this.props.dimensions = this.props.settings.dimensions || this.props.dimensions;
    this.props.legend_id = this.props.settings.legend || this.props.legend_id;
    this.props.do_log_plot = this.props.settings.log || this.props.do_log_plot;
    this.props.k_p = this.props.settings.k || this.props.k_p;

    var dimensions = this.props.dimensions;
    var margins = this.props.margins;

    if (this.props.do_log_plot) {
      this.props.has_zeros = data_to_plot.some(function(d) {return d.omega <= 0;});
      if (secondary_data) {
        this.props.has_zeros = this.props.has_zeros || data_to_plot.some(function(d) {return d.omega <= 0;});
      }
    }

    this.plot_width = dimensions["width"] - margins['left'] - margins['right'],
    this.plot_height = dimensions["height"] - margins['top'] - margins['bottom'];

    var domain = this.state.settings["domain"] || d3.extent(secondary_data ? secondary_data.map(function(d) {
        return d.omega;
    }).concat(data_to_plot.map(function(d) {
        return d.omega;
    })) : data_to_plot.map(function(d) {
        return d.omega;
    }));

    domain[0] *= 0.5;

    this.omega_scale = (this.props.do_log_plot ? (this.props.has_zeros ? d3.scale.pow().exponent (0.2) : d3.scale.log()) : d3.scale.linear())
        .range([0, this.plot_width]).domain(domain).nice();

    this.proportion_scale = d3.scale.linear().range([this.plot_height, 0]).domain([-0.05, 1]).clamp(true);

    // compute margins -- circle AREA is proportional to the relative weight
    // maximum diameter is (height - text margin)
    this.svg = d3.select("#" + this.props.settings.svg_id).attr("width", dimensions.width).attr("height", dimensions.height);
    this.plot = this.svg.selectAll(".container");

    this.svg.selectAll("defs").remove();
    this.svg.append("defs").append("marker")
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

    if (this.plot.empty()) {
      this.plot = this.svg.append("g").attr("class", "container");
    }

    this.plot.attr("transform", "translate(" + this.props.margins["left"] + " , " + this.props.margins["top"] + ")");
    this.reference_omega_lines = this.plot.selectAll(".hyphy-omega-line-reference"),
    this.displacement_lines = this.plot.selectAll(".hyphy-displacement-line");

    this.createDisplacementLine();
    this.createNeutralLine();
    this.createOmegaLine();
    this.createReferenceLine();
    this.createXAxis();
    this.createYAxis();
    this.setEvents();

  },
  makeSpring : function(x1, x2, y1, y2, step, displacement) {

    if (x1 == x2) {
        y1 = Math.min(y1, y2);
        return "M" + x1 + "," + (y1 - 40) + "v20";
    }

    var spring_data = [],
        point = [x1, y1],
        angle = Math.atan2(y2 - y1, x2 - x1);

    var step = [step * Math.cos(angle), step * Math.sin(angle)];
    var k = 0;

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

  },
  createDisplacementLine : function() {

    var self = this;
    var data_to_plot = this.props.omegas["Reference"];
    var secondary_data = this.props.omegas["Test"];

    if(secondary_data) {
        var diffs = data_to_plot.map(function(d, i) {
            return {
                'x1': d.omega,
                'x2': secondary_data[i].omega,
                'y1': d.weight * 0.98,
                'y2': secondary_data[i].weight * 0.98
            };
        });

      this.displacement_lines = this.displacement_lines.data(diffs);
      this.displacement_lines.enter().append("path");
      this.displacement_lines.exit().remove();
      this.displacement_lines.transition().attr("d", function(d) {
          return self.makeSpring(self.omega_scale(d.x1),
              self.omega_scale(d.x2),
              self.proportion_scale(d.y1 * 0.5),
              self.proportion_scale(d.y2 * 0.5),
              5,
              5);
      }).attr("marker-end", "url(#arrowhead)")
        .attr("class", "hyphy-displacement-line");
    }

  },
  createReferenceLine : function () {

    var data_to_plot = this.props.omegas["Reference"];
    var secondary_data = this.props.omegas["Test"];
    var self = this;

    if(secondary_data) {
        this.reference_omega_lines = this.reference_omega_lines.data(data_to_plot);
        this.reference_omega_lines.enter().append("line");
        this.reference_omega_lines.exit().remove();

        this.reference_omega_lines.transition().attr("x1", function(d) {
            return self.omega_scale(d.omega);
        })
            .attr("x2", function(d) {
                return self.omega_scale(d.omega);
            })
            .attr("y1", function(d) {
                return self.proportion_scale(-0.05);
            })
            .attr("y2", function(d) {
                return self.proportion_scale(d.weight);
            })
            .style("stroke", function(d) {
                return "#d62728";
            })
            .attr("class", "hyphy-omega-line-reference");
    } else {
        this.reference_omega_lines.remove();
        this.displacement_lines.remove();
    }

  },
  createOmegaLine : function() {

    var data_to_plot = this.props.omegas["Reference"];
    var secondary_data = this.props.omegas["Test"];
    var self = this;

    // ** Omega Line (Red) ** //
    var omega_lines = this.plot.selectAll(".hyphy-omega-line").data(secondary_data ? secondary_data : data_to_plot);
    omega_lines.enter().append("line");
    omega_lines.exit().remove();
    omega_lines.transition().attr("x1", function(d) {
        return self.omega_scale(d.omega);
    })
        .attr("x2", function(d) {
            return self.omega_scale(d.omega);
        })
        .attr("y1", function(d) {
            return self.proportion_scale(-0.05);
        })
        .attr("y2", function(d) {
            return self.proportion_scale(d.weight);
        })
        .style("stroke", function(d) {
          return "#1f77b4";
        })
        .attr("class", "hyphy-omega-line");
  },
  createNeutralLine : function() {
    var self = this;

    // ** Neutral Line (Blue) ** //
    var neutral_line = this.plot.selectAll(".hyphy-neutral-line").data([1]);
    neutral_line.enter().append("line").attr("class", "hyphy-neutral-line");
    neutral_line.exit().remove();
    neutral_line.transition().attr("x1", function(d) {
        return self.omega_scale(d);
    }).attr("x2", function(d) {
          return self.omega_scale(d);
      })
      .attr("y1", 0)
      .attr("y2", this.plot_height);

  },
  createXAxis : function() {

    // *** X-AXIS *** //
    var xAxis = d3.svg.axis()
        .scale(this.omega_scale)
        .orient("bottom");

    if (this.props.do_log_plot) {
        xAxis.ticks(10, this.props.has_zeros ? ".2r" : ".1r");
    }

    var x_axis = this.svg.selectAll(".x.axis");
    var x_label;

    if (x_axis.empty()) {
        x_axis = this.svg.append("g")
            .attr("class", "x hyphy-axis");

        x_label = x_axis.append("g").attr("class", "hyphy-axis-label x-label");
    } else {
        x_label = x_axis.select(".axis-label.x-label");
    }

    x_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + (this.plot_height + this.props.margins["top"]) + ")")
        .call(xAxis);
    x_label = x_label.attr("transform", "translate(" + this.plot_width + "," + this.props.margins["bottom"] + ")")
        .selectAll("text").data(["\u03C9"]);
    x_label.enter().append("text");
    x_label.text(function(d) {
        return d
    }).style("text-anchor", "end")
      .attr("dy", "0.0em");

  },
  createYAxis : function() {

    // *** Y-AXIS *** //
    var yAxis = d3.svg.axis()
        .scale(this.proportion_scale)
        .orient("left")
        .ticks(10, ".1p");

    var y_axis = this.svg.selectAll(".y.hyphy-axis");
    var y_label;

    if (y_axis.empty()) {
        y_axis = this.svg.append("g")
            .attr("class", "y hyphy-axis");
        y_label = y_axis.append("g").attr("class", "hyphy-axis-label y-label");
    } else {
        y_label = y_axis.select(".hyphy-axis-label.y-label");
    }
    y_axis.attr("transform", "translate(" + this.props.margins["left"] + "," + this.props.margins["top"] + ")")
        .call(yAxis);
    y_label = y_label.attr("transform", "translate(" + (-this.props.margins["left"]) + "," + 0 + ")")
        .selectAll("text").data(["Proportion of sites"]);
    y_label.enter().append("text");
    y_label.text(function(d) {
        return d
    }).style("text-anchor", "start")
      .attr("dy", "-1em")

  },
  getInitialState: function() {
    return {settings: []};
  },
  componentDidMount: function() {
    this.initialize();
  },
  render: function() {

    this.svg_id = this.props.omegas.key + "-svg";
    this.save_svg_id = "export-" + this.props.omegas.key + "-svg";
    this.save_png_id = "export-" + this.props.omegas.key + "-png";

    return (
      React.createElement("div", {className: "col-lg-6"}, 
          React.createElement("div", {className: "panel panel-default", id:  this.props.omegas.key}, 
              React.createElement("div", {className: "panel-heading"}, 
                  React.createElement("h3", {className: "panel-title"}, "ω distributions under the ", React.createElement("strong", null,  this.props.omegas.label), " model"), 
                  React.createElement("p", null, 
                      React.createElement("small", null, "Test branches are shown in ", React.createElement("span", {className: "hyphy-blue"}, "blue"), " and reference branches are shown in ", React.createElement("span", {className: "hyphy-red"}, "red"))
                  ), 
                  React.createElement("div", {className: "btn-group"}, 
                      React.createElement("button", {id:  this.save_svg_id, type: "button", className: "btn btn-default btn-sm"}, 
                          React.createElement("span", {className: "glyphicon glyphicon-floppy-save"}), " SVG"
                      ), 
                      React.createElement("button", {id:  this.save_png_id, type: "button", className: "btn btn-default btn-sm"}, 
                          React.createElement("span", {className: "glyphicon glyphicon-floppy-save"}), " PNG"
                      )
                  )
              ), 
              React.createElement("div", {className: "panel-body"}, 
                  React.createElement("svg", {id:  this.svg_id})
              )
          )
      )
    );
  }
});

var OmegaPlotGrid = React.createClass({displayName: "OmegaPlotGrid",

  getInitialState: function() {
    return {omega_distributions: this.getDistributions(this.props.json)};
  },
  componentDidMount: function() {
  },
  getDistributions : function(json) {

    var omega_distributions = {};
    for (var m in json["fits"]) {
        var this_model = json["fits"][m];
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
        }
    }

    _.each(omega_distributions, function(item,key) { 
      item.key   = key.toLowerCase().replace(/ /g, '-'); 
      item.label = key; 
    });

    var omega_distributions = _.filter(omega_distributions, function(item) {
      return _.isObject(item["Reference"]);
    });

    return omega_distributions;
  },

  render: function() {

    var OmegaPlots = _.map(this.state.omega_distributions, function(item, key) {

      var model_name = key;
      var omegas = item;

      var settings = {
        svg_id : omegas.key + '-svg',
        dimensions : { width : 600, height : 400 },
        margins : { 'left': 50, 'right': 15, 'bottom': 35, 'top': 35 },
        has_zeros : false,
        legend_id : null,
        do_log_plot : true,
        k_p : null,
        plot : null
      };

      return (
        React.createElement(OmegaPlot, {name: model_name, omegas: omegas, settings: settings})
      )

    });

    return (
    React.createElement("div", null, 
      OmegaPlots
    )
    );
  }

});

// Will need to make a call to this
// omega distributions
function render_omega_plot(json) {
  React.render(
    React.createElement(OmegaPlotGrid, {json: json}),
    document.getElementById("hyphy-omega-plots")
  );
}


var Summary = React.createClass({displayName: "Summary",

  getDefaultProps : function() {
    return {
     alpha_level : 0.05
    };

  },

  getInitialState: function() {
    return {
      p : null,
      direction : 'unknown',
      evidence : 'unknown',
      pvalue : null,
      lrt : null,
      summary_k : 'unknown',
      pmid_text : "PubMed ID : Unknown",
      pmid_href : "#",
      relaxation_K : "unknown"
    };
  },

  p_value_format : d3.format(".4f"),
  fit_format : d3.format(".2f"),

  componentDidMount: function() {
    console.log(this.props.json);
    this.setState({
      p : this.props.json["relaxation-test"]["p"],
      direction : this.props.json["fits"]["Alternative"]["K"] > 1 ? 'intensification' : 'relaxation',
      evidence : this.state.p <= this.props.alpha_level ? 'significant' : 'not significant',
      pvalue : this.p_value_format(this.state.p),
      lrt : this.fit_format(this.props.json["relaxation-test"]["LR"]),
      summary_k : this.fit_format(this.props.json["fits"]["Alternative"]["K"]),
      pmid_text : "PubMed ID " + this.props.json['PMID'],
      pmid_href : "http://www.ncbi.nlm.nih.gov/pubmed/" + this.props.json['PMID']
    });
  },

  render: function() {

    return (
        React.createElement("div", {className: "col-md-12"}, 
            React.createElement("ul", {className: "list-group"}, 
                React.createElement("li", {className: "list-group-item list-group-item-info"}, 
                    React.createElement("h3", {className: "list-group-item-heading"}, 
                      React.createElement("i", {className: "fa fa-list", styleFormat: "margin-right: 10px"}), 
                      React.createElement("span", {id: "summary-method-name"}, "RELAX(ed selection test)"), " summary"
                    ), 
                    React.createElement("p", {className: "list-group-item-text lead", styleFormat: "margin-top:0.5em; "}, 
                      "Test for selection ", React.createElement("strong", {id: "summary-direction"}, this.state.direction), 
                      "(", React.createElement("abbr", {title: "Relaxation coefficient"}, "K"), " = ", React.createElement("strong", {id: "summary-K"}, this.state.summary_k), ") was ", React.createElement("strong", {id: "summary-evidence"}, this.state.evidence), 
                      "(p = ", React.createElement("strong", {id: "summary-pvalue"}, this.state.p), ", ", React.createElement("abbr", {title: "Likelihood ratio statistic"}, "LR"), " = ", React.createElement("strong", {id: "summary-LRT"}, this.state.lrt), ")"
                    ), 
                    React.createElement("p", null, 
                      React.createElement("small", null, "Please cite ", React.createElement("a", {href: this.state.pmid_href, id: "summary-pmid"}, this.state.pmid_text), " if you use this result in a publication, presentation, or other scientific work.")
                    )
                )
            )
          )
        )
  }

});

// Will need to make a call to this
// omega distributions
function render_summary(json) {
  React.render(
    React.createElement(Summary, {json: json}),
    document.getElementById("hyphy-relax-summary")
  );
}

// TODO : Write documentation
var Tree = React.createClass({displayName: "Tree",

  getInitialState: function() {
    //return { table_row_data: this.getModelRows() };
    return null;
  },

  format_run_time : function(seconds) {
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
  },

  renderColorScheme : function(svg_container, attr_name, do_not_render) {

    var self = this;

    var svg = d3.select("#" + svg_container).selectAll("svg").data([self.omega_color.domain()]);
    svg.enter().append("svg");
    svg.selectAll("*").remove();

    if (this.branch_annotations && !do_not_render) {
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

        var omega_scale = d3.scale.pow().exponent(this.scaling_exponent)
            .domain(d3.extent(self.omega_color.domain()))
            .range([0, 1]),
            axis_scale = d3.scale.pow().exponent(this.scaling_exponent)
            .domain(d3.extent(self.omega_color.domain()))
            .range([0, bar_height - margins['top'] - margins['bottom']]);


        self.omega_color.domain().forEach(function(d) {
            this_grad.append("stop")
                .attr("offset", "" + omega_scale(d) * 100 + "%")
                .style("stop-color", self.omega_color(d));
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
            .attr("class", "hyphy-omega-bar")
            .call(draw_omega_bar);

        scale_bar.selectAll("text")
            .style("text-anchor", "right");

        var x_label = _label = scale_bar.append("g").attr("class", "hyphy-omega-bar");
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
  },

  initialize : function() {

    this.settings = this.props.settings;
    $("#datamonkey-relax-tree-branch-lengths").click();

    var json =  this.props.json;
    var analysis_data = json;
    var self = this;

    var width = 800,
        height = 600,
        alpha_level = 0.05,
        branch_lengths = [];

    this.omega_format = d3.format(".3r");
    this.prop_format = d3.format(".2p");
    this.fit_format = d3.format(".2f");
    this.p_value_format = d3.format(".4f");

    this.tree = d3.layout.phylotree("body")
        .size([height, width])
        .separation(function(a, b) {
            return 0;
        });

    this.scaling_exponent = 0.33;
    this.branch_annotations = [];

    set_handlers();
    set_tree_handlers(this.tree);

    var svg = d3.select("#tree_container").append("svg")
        .attr("width", width)
        .attr("height", height);

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
          self.renderTree();
        });

        $(".tree-tab-btn").on('click', function(e) {
          self.tree.placenodes().update();
        });

        $("#export-phylo-svg").on('click', function(e) {
            datamonkey.save_image("svg", "#tree_container");
        });

        $("#export-phylo-png").on('click', function(e) {
            datamonkey.save_image("png", "#tree_container");
        });

    }

    this.settings['suppress-tree-render'] = true;
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
        self.renderTree();
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
        self.renderTree();
    });

    partition_list.text(function(d) {
        if (d == "RELAX.test") {
            this.click();
        }
        return d;
    });

    this.settings['suppress-tree-render'] = false;
    self.renderTree(true);

    //default_tree_settings();
    this.tree.branch_name(null);
    this.tree.node_span('equal');
    this.tree.options({
        'draw-size-bubbles': false,
        'selectable': false,
        'left-right-spacing': 'fit-to-size'
    }, false);

    this.tree.font_size(18);
    this.tree.scale_bar_font_size(14);
    this.tree.node_circle_size(0);
    this.tree.branch_length(function(n) {
        if (self.branch_lengths) {
            return self.branch_lengths[n.name] || 0;
        }
        return undefined;
    });

    this.tree.style_edges(this.edgeColorizer);
    this.tree.style_nodes(this.nodeColorizer);
    this.tree.spacing_x(30, true);
    this.tree(analysis_data["tree"]).svg(svg);
    this.tree.layout();


  },

  edgeColorizer : function(element, data) {

    var self = this;

    if (this.branch_annotations) {
        element.style('stroke', self.omega_color(this.branch_annotations[data.target.name]) || null);
        $(element[0][0]).tooltip('destroy');
        $(element[0][0]).tooltip({
            'title': self.omega_format(this.branch_annotations[data.target.name]),
            'html': true,
            'trigger': 'hover',
            'container': 'body',
            'placement': 'auto'
        })
    } else {
        element.style('stroke', null);
        $(element[0][0]).tooltip('destroy');
    }

    element.style('stroke-width', (this.partition && this.partition[data.target.name]) ? '8' : '4')
        .style('stroke-linejoin', 'round')
        .style('stroke-linecap', 'round');

  },

  nodeColorizer : function(element, data) {
    if (this.partition) { 
      element.style('opacity', (this.partition && this.partition[data.name]) ? '1' : '0.25');
    } else {
      element.style('opacity', '1');        
    }
  },

  renderTree : function(skip_render) {

      var analysis_data = this.props.json;

      if (!this.settings['suppress-tree-render']) {

          var do_layout = false;

          for (var k in this.settings["tree-options"]) {
              var controller = d3.select("#" + k),
                  controller_value = (controller.attr("value") || controller.property("checked"));
                  
              if (controller_value != this.settings["tree-options"][k][0]) {
                  this.settings["tree-options"][k][0] = controller_value;
                  do_layout = do_layout || this.settings["tree-options"][k][1];
              }
          }
          
          var which_model = this.settings["tree-options"]["datamonkey-relax-tree-model"][0];

          this.branch_lengths = this.settings["tree-options"]["datamonkey-relax-tree-branch-lengths"][0] ? analysis_data["fits"][which_model]["branch-lengths"] : null;

          this.branch_annotations = analysis_data["fits"][which_model]["branch-annotations"];
          this.partition = (this.settings["tree-options"]["datamonkey-relax-tree-highlight"] ? analysis_data["partition"][this.settings["tree-options"]["datamonkey-relax-tree-highlight"][0]] : null) || null;

          this.omega_color = d3.scale.pow().exponent(this.scaling_exponent)
              .domain([0, 0.25, 1, 5, 10])
              .range(this.settings["tree-options"]["datamonkey-relax-tree-fill-color"][0] ? ["#DDDDDD", "#AAAAAA", "#888888", "#444444", "#000000"] : ["#5e4fa2", "#3288bd", "#e6f598", "#f46d43", "#9e0142"])
              .clamp(true);

          this.renderColorScheme("color_legend", analysis_data["fits"][which_model]["annotation-tag"], (this.settings["tree-options"]["datamonkey-relax-tree-fill-legend"][0]));

          if (!skip_render) {
              if (do_layout) {
                  this.tree.update_layout();
              }
              d3_phylotree_trigger_refresh(this.tree);
          }
      }
  },

  componentDidMount: function() {
    this.initialize();
  },

  render: function() {

    return (
        React.createElement("div", null, 
          React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "cold-md-12"}, 
                  React.createElement("div", {className: "input-group input-group-sm"}, 
                      React.createElement("div", {className: "input-group-btn"}, 
                          React.createElement("button", {id: "export-phylo-png", type: "button", className: "btn btn-default btn-sm", title: "Save Image"}, 
                              React.createElement("i", {className: "fa fa-image"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", "data-direction": "vertical", "data-amount": "1", title: "Expand vertical spacing"}, 
                              React.createElement("i", {className: "fa fa-arrows-v"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", "data-direction": "vertical", "data-amount": "-1", title: "Compress vertical spacing"}, 
                              React.createElement("i", {className: "fa  fa-compress fa-rotate-135"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", "data-direction": "horizontal", "data-amount": "1", title: "Expand horizonal spacing"}, 
                              React.createElement("i", {className: "fa fa-arrows-h"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", "data-direction": "horizontal", "data-amount": "-1", title: "Compress horizonal spacing"}, 
                              React.createElement("i", {className: "fa  fa-compress fa-rotate-45"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", id: "sort_ascending", title: "Sort deepest clades to the bototm"}, 
                              React.createElement("i", {className: "fa fa-sort-amount-asc"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", id: "sort_descending", title: "Sort deepsest clades to the top"}, 
                              React.createElement("i", {className: "fa fa-sort-amount-desc"})
                          ), 
                          React.createElement("button", {type: "button", className: "btn btn-default btn-sm", id: "sort_original", title: "Restore original order"}, 
                              React.createElement("i", {className: "fa fa-sort"})
                          )
                      ), 
                      React.createElement("div", {className: "input-group-btn", "data-toggle": "buttons"}, 
                          React.createElement("label", {className: "btn btn-default active btn-sm"}, 
                              React.createElement("input", {type: "radio", name: "options", className: "phylotree-layout-mode", "data-mode": "linear", autoComplete: "off", checked: "", title: "Layout left-to-right"}), "Linear"
                          ), 
                          React.createElement("label", {className: "btn btn-default  btn-sm"}, 
                              React.createElement("input", {type: "radio", name: "options", className: "phylotree-layout-mode", "data-mode": "radial", autoComplete: "off", title: "Layout radially"}), " Radial"
                          )
                      ), 
                      React.createElement("div", {className: "input-group-btn", "data-toggle": "buttons"}, 
                        React.createElement("label", {className: "btn btn-default active btn-sm"}, 
                          React.createElement("input", {type: "radio", className: "phylotree-align-toggler", "data-align": "left", name: "options-align", autoComplete: "off", checked: "", title: "Align tips labels to branches"}), 
                              React.createElement("i", {className: "fa fa-align-left"})
                        ), 
                        React.createElement("label", {className: "btn btn-default btn-sm"}, 
                         React.createElement("input", {type: "radio", className: "phylotree-align-toggler", "data-align": "right", name: "options-align", autoComplete: "off", title: "Align tips labels to the edge of the plot"}), 
                              React.createElement("i", {className: "fa fa-align-right"})
                        )
                      ), 
      
                      React.createElement("div", {className: "input-group-btn"}, 
                          React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown"}, "Model", 
                              React.createElement("span", {className: "caret"})), 
                          React.createElement("ul", {className: "dropdown-menu", id: "datamonkey-relax-tree-model-list"}
                          )
                      ), 

                      React.createElement("input", {type: "text", className: "form-control disabled", id: "datamonkey-relax-tree-model", disabled: true}), 

                      React.createElement("div", {className: "input-group-btn"}, 
                          React.createElement("button", {type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown"}, "Highlight branch set", 
                              React.createElement("span", {className: "caret"})), 
                          React.createElement("ul", {className: "dropdown-menu", id: "datamonkey-relax-tree-highlight-branches"}
                          )
                      ), 

                      React.createElement("input", {type: "text", className: "form-control disabled", id: "datamonkey-relax-tree-highlight", disabled: true}), 

                      React.createElement("span", {className: "input-group-addon"}, 
                        "Use model branch lengths", 
                        React.createElement("input", {type: "checkbox", id: "datamonkey-relax-tree-branch-lengths", className: "datamonkey-relax-tree-trigger"})
                      ), 

                      React.createElement("span", {className: "input-group-addon"}, 
                        "Hide legend", 
                        React.createElement("input", {type: "checkbox", id: "datamonkey-relax-tree-fill-legend", className: "datamonkey-relax-tree-trigger"})
                      ), 

                      React.createElement("span", {className: "input-group-addon"}, 
                        "Grayscale",  
                        React.createElement("input", {type: "checkbox", id: "datamonkey-relax-tree-fill-color", className: "datamonkey-relax-tree-trigger"})
                      )

                  )
              )
          ), 

          React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "col-md-1"}, 
                  React.createElement("div", {className: "row"}, 
                      React.createElement("div", {id: "color_legend"})
                  )
              ), 
              React.createElement("div", {className: "col-md-11"}, 
                  React.createElement("div", {className: "row"}, 
                      React.createElement("div", {id: "tree_container", className: "tree-widget"})
                  )
              )
          )
        )

      )
  }

});

// Will need to make a call to this
// omega distributions
function render_tree(json) {

  var settings = {
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

  React.render(
    React.createElement(Tree, {json: json, settings: settings}),
    document.getElementById("tree-tab")
  );

}

//# sourceMappingURL=hyphy-vision.js.map
