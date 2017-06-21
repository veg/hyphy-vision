var React = require("react");
var datamonkey = require("../../datamonkey/datamonkey.js");

const DatamonkeyTableRow = React.createClass({
  /**
      A single table row

      *rowData* is an array of cells
          each cell can be one of
              1. string: simply render the text as shown
              2. object: a polymorphic case; can be rendered directly (if the object is a valid react.js element)
                 or via a transformation of the value associated with the key 'value'

                 supported keys
                  2.1. 'value' : the value to use to generate cell context
                  2.2. 'format' : the function (returning something react.js can render directly) that will be called
                  to transform 'value' into the object to be rendered
                  2.3. 'span' : colSpan attribute
                  2.4. 'style': CSS style attributes (JSX specification, i.e. {margin-top: '1em'} and not a string)
                  2.5. 'classes': CSS classes to apply to the cell
                  2.6. 'abbr': wrap cell value in <abbr> tags

              3. array: directly render array elements in the cell (must be renderable to react.js; note that plain
              text elements will be wrapped in "span" which is not allowed to nest in <th/td>


      *header* is a bool indicating whether the header is a header row (th cells) or a regular row (td cells)
  */

  /*propTypes: {
   rowData: React.PropTypes.arrayOf (React.PropTypes.oneOfType ([React.PropTypes.string,React.PropTypes.number,React.PropTypes.object,React.PropTypes.array])).isRequired,
   header:  React.PropTypes.bool,
  },*/

  dm_compareTwoValues: function(a, b) {
    /* this should be made static */

    /**
        compare objects by iterating over keys

        return 0 : equal
               1 : a < b
               2 : a > b
               -1 : cannot be compared
               -2 : not compared, but could contain 'value' objects that could be compared
    */

    var myType = typeof a,
      self = this;

    if (myType == typeof b) {
      if (myType == "string" || myType == "number") {
        return a == b ? 0 : a > b ? 2 : 1;
      }

      if (_.isArray(a) && _.isArray(b)) {
        if (a.length != b.length) {
          return a.length > b.length ? 2 : 1;
        }

        var comparison_result = 0;

        _.every(a, function(c, i) {
          var comp = self.dm_compareTwoValues(c, b[i]);
          if (comp != 0) {
            comparison_result = comp;
            return false;
          }
          return true;
        });

        return comparison_result;
      }

      return -2;
      // further check to see if 'this' has a "value" attribute
    }
    return -1;
  },

  dm_compareTwoValues_level2: function(a, b) {
    var compare = this.dm_compareTwoValues(a, b);

    if (compare == -2) {
      if (_.has(a, "value") && _.has(b, "value")) {
        return this.dm_compareTwoValues(a.value, b.value);
      }
    }

    return compare;
  },

  dm_log100times: _.before(100, function(v) {
    console.log(v);
    return 0;
  }),

  getInitialState: function() {
    return {
      header: this.props.header
    };
  },

  shouldComponentUpdate: function(nextProps) {
    var self = this;

    if (this.state.header !== nextProps.header) {
      return true;
    }

    if (this.props.sortOn != nextProps.sortOn) {
      return true;
    }

    var result = _.some(this.props.rowData, function(value, index) {
      /** TO DO
          check for format and other field equality
      */

      if (value === nextProps.rowData[index]) {
        return false;
      }

      var compare = self.dm_compareTwoValues_level2(
        value,
        nextProps.rowData[index]
      );
      if (compare >= 0) {
        if (compare == 0) {
          // values match, compare properties
          var existing_keys = _.keys(value),
            new_keys = _.keys(nextProps.rowData[index]),
            shared = _.intersection(existing_keys, new_keys);

          if (
            shared.length < new_keys.length ||
            shared.length < existing_keys.length
          ) {
            return true;
          }

          return false;
        } else {
          return true;
        }
      }

      return true;
    });

    return result;
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      header: nextProps.header
    });
  },

  render: function() {
    return (
      <tr>
        {this.props.rowData.map(
          _.bind(function(cell, index) {
            var value = _.has(cell, "value") ? cell.value : cell;

            if (_.isArray(value)) {
              if (!_.has(cell, "format")) {
                return value;
              }
            } else {
              if (_.isObject(value)) {
                if (!React.isValidElement(value)) {
                  return null;
                }
              }
            }

            if (_.has(cell, "format")) {
              value = cell.format(value);
            }

            if (_.has(cell, "abbr")) {
              value = (
                <span
                  data-toggle="tooltip"
                  data-placement="top"
                  data-html="true"
                  title={cell.abbr}
                >
                  {value}
                </span>
              );
            }

            var cellProps = { key: index };

            if (_.has(cell, "span")) {
              cellProps["colSpan"] = cell.span;
            }

            if (_.has(cell, "style")) {
              cellProps["style"] = cell.style;
            }

            if (_.has(cell, "tooltip")) {
              cellProps["title"] = cell.tooltip;
              //this.dm_log100times (cellProps);
            }

            if (_.has(cell, "classes")) {
              cellProps["className"] = cell.classes;
            }

            if (this.state.header && this.props.sorter) {
              if (_.has(cell, "sortable")) {
                cellProps["onClick"] = _.partial(
                  this.props.sorter,
                  index,
                  this.dm_compareTwoValues_level2
                );

                var sortedness_state = "fa fa-sort";
                if (this.props.sortOn && this.props.sortOn[0] == index) {
                  sortedness_state = this.props.sortOn[1]
                    ? "fa fa-sort-amount-asc"
                    : "fa fa-sort-amount-desc";
                }

                value = (
                  <div>
                    {value}
                    <i
                      className={sortedness_state}
                      aria-hidden="true"
                      style={{ marginLeft: "0.5em" }}
                    />
                  </div>
                );
              }
            }

            return React.createElement(
              this.state.header ? "th" : "td",
              cellProps,
              value
            );
          }, this)
        )}
      </tr>
    );
  }
});

/**
 * A table composed of rows
 * @param *headerData* -- an array of cells (see DatamonkeyTableRow) to render as the header
 * @param *bodyData* -- an array of arrays of cells (rows) to render
 * @param *classes* -- CSS classes to apply to the table element
 * @example
 * header = ["Model","AIC","Parameters"]
 * rows = [[{"value":"MG94","style":{"fontVariant":"small-caps"}},{"value":0},46],
 *         [{"value":"Full model","style":{"fontVariant":"small-caps"}},{"value":6954.016129926898},60]]
 */
var DatamonkeyTable = React.createClass({
  getDefaultProps: function() {
    return {
      classes: "dm-table table table-condensed table-hover",
      rowHash: null
    };
  },

  getInitialState: function() {
    // either null or [index,
    // bool / to indicate if the sort is ascending (True) or descending (False)]

    var len = 0;

    if (this.props.bodyData) {
      len = this.props.bodyData.length;
    }

    return {
      rowOrder: _.range(0, len),
      headerData: this.props.headerData,
      sortOn: this.props.initialSort ? [this.props.initialSort, true] : null,
      current: 0
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      rowOrder: _.range(0, nextProps.bodyData.length),
      headerData: nextProps.headerData
    });
  },

  regress: function() {
    if (this.state.current >= this.props.paginate) {
      this.setState({
        current: this.state.current - this.props.paginate
      });
    } else {
      this.setState({
        current: 0
      });
    }
  },

  decrement: function() {
    if (this.state.current > 0) {
      var new_current = this.state.current - 1;
      this.setState({
        current: new_current
      });
    }
  },

  increment: function() {
    if (this.state.current < this.state.rowOrder.length - this.props.paginate) {
      var new_current = this.state.current + 1;
      this.setState({
        current: new_current
      });
    }
  },

  advance: function() {
    if (
      this.state.current <
      this.state.rowOrder.length - 2 * this.props.paginate
    ) {
      this.setState({
        current: this.state.current + this.props.paginate
      });
    } else {
      this.setState({
        current: this.state.rowOrder.length - this.props.paginate
      });
    }
  },

  dm_sortOnColumn: function(index, compare_function) {
    var self = this;
    var is_ascending = true;
    if (this.state.sortOn && this.state.sortOn[0] == index) {
      is_ascending = !this.state.sortOn[1];
    }

    var new_order = _.map(this.state.rowOrder, _.identity).sort(function(i, j) {
      var comp_value = compare_function(
        self.props.bodyData[i][index],
        self.props.bodyData[j][index]
      );
      if (comp_value > 0) {
        return is_ascending ? 2 * comp_value - 3 : 3 - 2 * comp_value;
      }
      return 0;
    });

    if (
      _.some(new_order, function(value, index) {
        return value != self.state.rowOrder[index];
      })
    ) {
      this.setState({
        current: 0,
        rowOrder: new_order,
        sortOn: [index, is_ascending]
      });
    }
  },

  componentDidMount: function() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  componentDidUpdate: function() {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover'
    });
  },

  render: function() {
    const children = [];
    var self = this,
      paginatorControls,
      rowIndices;
    if (this.props.paginate) {
      paginatorControls = (
        <div>
          <div className="col-md-9">
            <p>
              Showing entries {this.state.current + 1} through{" "}
              {this.state.current + this.props.paginate} out of{" "}
              {this.state.rowOrder.length}.
            </p>
          </div>
          <div className="col-md-3">
            <div
              className="btn-group btn-group-justified"
              role="group"
              aria-label="..."
            >
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={self.regress}
                  data-toggle="tooltip"
                  title={"Move backwards " + this.props.paginate + " rows."}
                >
                  <span
                    className="glyphicon glyphicon-backward"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={self.decrement}
                  data-toggle="tooltip"
                  title="Move backwards one row."
                >
                  <span
                    className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={self.increment}
                  data-toggle="tooltip"
                  title="Move forwards one row."
                >
                  <span
                    className="glyphicon glyphicon-chevron-right"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={self.advance}
                  data-toggle="tooltip"
                  title={"Move forwards " + this.props.paginate + " rows."}
                >
                  <span
                    className="glyphicon glyphicon-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      paginatorControls = "";
    }

    if (this.state.headerData) {
      // check if header will be multiple rows by checking if headerData is an array of arrays
      if (_.isArray(this.props.headerData[0])) {
        children.push(
          <thead key={0}>
            {_.map(this.state.headerData, function(row, index) {
              return (
                <DatamonkeyTableRow
                  rowData={row}
                  header={true}
                  key={index}
                  sorter={_.bind(self.dm_sortOnColumn, self)}
                  sortOn={self.state.sortOn}
                />
              );
            })}
          </thead>
        );
      } else {
        children.push(
          <thead key={0}>
            <DatamonkeyTableRow
              rowData={this.state.headerData}
              header={true}
              sorter={_.bind(self.dm_sortOnColumn, self)}
              sortOn={self.state.sortOn}
            />
          </thead>
        );
      }
    }
    if (this.props.paginate) {
      rowIndices = this.state.rowOrder.slice(
        this.state.current,
        this.state.current + this.props.paginate
      );
    } else {
      rowIndices = this.state.rowOrder;
    }
    children.push(
      React.createElement(
        "tbody",
        {
          key: 1
        },
        _.map(
          rowIndices,
          _.bind(function(row_index) {
            var componentData = this.props.bodyData[row_index];

            return (
              <DatamonkeyTableRow
                rowData={componentData}
                key={
                  this.props.rowHash
                    ? this.props.rowHash(componentData)
                    : row_index
                }
                header={false}
              />
            );
          }, this)
        )
      )
    );
    //if (this.props.paginate){debugger;}
    return (
      <div className="row">
        {paginatorControls}
        <div className="col-md-12">
          <table className={this.props.classes}>
            {children}
          </table>
        </div>
      </div>
    );
  }
});

var DatamonkeyRateDistributionTable = React.createClass({
  /** render a rate distribution table from JSON formatted like this
  {
       "non-synonymous/synonymous rate ratio for *background*":[ // name of distribution
        [0.1701428265961598, 1] // distribution points (rate, weight)
        ],
       "non-synonymous/synonymous rate ratio for *test*":[
        [0.1452686330406915, 1]
        ]
  }

  */

  propTypes: {
    distribution: React.PropTypes.object.isRequired
  },

  dm_formatterRate: d3.format(".3r"),
  dm_formatterProp: d3.format(".3p"),

  dm_createDistributionTable: function(jsonRates) {
    var rowData = [];
    var self = this;
    _.each(jsonRates, function(value, key) {
      rowData.push([
        {
          value: key,
          span: 3,
          classes: "info"
        }
      ]);
      _.each(value, function(rate, index) {
        rowData.push([
          {
            value: rate[1],
            format: self.dm_formatterProp
          },
          "@",
          {
            value: rate[0],
            format: self.dm_formatterRate
          }
        ]);
      });
    });
    return rowData;
  },

  render: function() {
    return (
      <DatamonkeyTable
        bodyData={this.dm_createDistributionTable(this.props.distribution)}
        classes={"table table-condensed"}
      />
    );
  }
});

var DatamonkeyPartitionTable = React.createClass({
  dm_formatterFloat: d3.format(".3r"),
  dm_formatterProp: d3.format(".3p"),

  propTypes: {
    trees: React.PropTypes.object.isRequired,
    partitions: React.PropTypes.object.isRequired,
    branchAttributes: React.PropTypes.object.isRequired,
    siteResults: React.PropTypes.object.isRequired,
    accessorNegative: React.PropTypes.func.isRequired,
    accessorPositive: React.PropTypes.func.isRequired,
    pValue: React.PropTypes.number.isRequired
  },

  dm_computePartitionInformation: function(
    trees,
    partitions,
    attributes,
    pValue
  ) {
    var partitionKeys = _.sortBy(_.keys(partitions), function(v) {
      return v;
    }),
      matchingKey = null,
      self = this;

    var extractBranchLength =
      this.props.extractOn ||
      _.find(attributes.attributes, function(value, key) {
        matchingKey = key;
        return value["attribute type"] == "branch length";
      });
    if (matchingKey) {
      extractBranchLength = matchingKey;
    }

    return _.map(partitionKeys, function(key, index) {
      var treeBranches = trees.tested[key],
        tested = {};

      _.each(treeBranches, function(value, key) {
        if (value == "test") tested[key] = 1;
      });

      var testedLength = extractBranchLength
        ? datamonkey.helpers.sum(attributes[key], function(v, k) {
            if (tested[k.toUpperCase()]) {
              return v[extractBranchLength];
            }
            return 0;
          })
        : 0;
      var totalLength = extractBranchLength
        ? datamonkey.helpers.sum(attributes[key], function(v) {
            return v[extractBranchLength] || 0;
          })
        : 0; // || 0 is to resolve root node missing length

      return _.map(
        [
          index + 1, // 1-based partition index
          partitions[key].coverage[0].length, // number of sites in the partition
          _.size(tested), // tested branches
          _.keys(treeBranches).length, // total branches
          testedLength,
          testedLength / totalLength,
          totalLength,
          _.filter(
            self.props.accessorPositive(self.props.siteResults, key),
            function(p) {
              return p <= pValue;
            }
          ).length,
          _.filter(
            self.props.accessorNegative(self.props.siteResults, key),
            function(p) {
              return p <= pValue;
            }
          ).length
        ],
        function(cell, index) {
          if (index > 1) {
            var attributedCell = {
              value: cell,
              style: {
                textAlign: "center"
              }
            };

            if (index == 4 || index == 6) {
              _.extend(attributedCell, {
                format: self.dm_formatterFloat
              });
            }
            if (index == 5) {
              _.extend(attributedCell, {
                format: self.dm_formatterProp
              });
            }

            return attributedCell;
          }
          return cell;
        }
      );
    });
  },

  dm_makeHeaderRow: function(pValue) {
    return [
      _.map(
        [
          "Partition",
          "Sites",
          "Branches",
          "Branch Length",
          "Selected at p" + String.fromCharCode(parseInt("2264", 16)) + pValue
        ],
        function(d, i) {
          return _.extend(
            {
              value: d,
              style: {
                borderBottom: 0,
                textAlign: i > 1 ? "center" : "left"
              }
            },
            i > 1
              ? {
                  span: i == 3 ? 3 : 2
                }
              : {}
          );
        }
      ),
      _.map(
        [
          "",
          "",
          "Tested",
          "Total",
          "Tested",
          "% of total",
          "Total",
          "Positive",
          "Negative"
        ],
        function(d, i) {
          return {
            value: d,
            style: {
              borderTop: 0,
              textAlign: i > 1 ? "center" : "left"
            }
          };
        }
      )
    ];
  },

  getInitialState: function() {
    return {
      header: this.dm_makeHeaderRow(this.props.pValue),
      rows: this.dm_computePartitionInformation(
        this.props.trees,
        this.props.partitions,
        this.props.branchAttributes,
        this.props.pValue
      )
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      header: this.dm_makeHeaderRow(nextProps.pValue),
      rows: this.dm_computePartitionInformation(
        nextProps.trees,
        nextProps.partitions,
        nextProps.branchAttributes,
        nextProps.pValue
      )
    });
  },

  render: function() {
    return (
      <div className="table-responsive">
        <DatamonkeyTable
          headerData={this.state.header}
          bodyData={this.state.rows}
        />
      </div>
    );
  }
});

var DatamonkeyModelTable = React.createClass({
  // render a model fit table from a JSON object with entries like this
  //     "Global MG94xREV":{  model name
  //          "log likelihood":-5453.527975908821,
  //          "parameters":131,
  //          "AIC-c":11172.05569160427,
  //          "rate distributions":{
  //            "non-synonymous/synonymous rate ratio for *background*":[
  //             [0.1701428265961598, 1]
  //             ],
  //            "non-synonymous/synonymous rate ratio for *test*":[
  //             [0.1452686330406915, 1]
  //             ]
  //           },
  //          "display order":0
  //         }
  // dm_supportedColumns controls which keys from model specification will be consumed;
  //     * 'value' is the cell specification to be consumed by DatamonkeyTableRow
  //     * 'order' is the column order in the resulting table (relative; doesn't have to be sequential)
  //     * 'display_format' is a formatting function for cell entries
  //     * 'transform' is a data trasformation function for cell entries

  dm_numberFormatter: d3.format(".2f"),

  dm_supportedColumns: {
    "log-likelihood": {
      order: 2,
      value: {
        value: "log L",
        abbr: "Log likelihood of model fit"
      },
      display_format: d3.format(".2f")
    },
    parameters: {
      order: 3,
      value: {
        value: "Parameters",
        abbr: "Number of estimated parameters"
      }
    },
    "AIC-c": {
      order: 1,
      value: {
        value: React.createElement("span", null, ["AIC", <sub key="0">C</sub>]),
        abbr: "Small-sample corrected Akaike Information Score"
      },
      display_format: d3.format(".2f")
    },
    "rate distributions": {
      order: 4,
      value: "Rate distributions",
      transform: function(value) {
        return React.createElement(DatamonkeyRateDistributionTable, {
          distribution: value
        });
      }
    }
  },

  propTypes: {
    fits: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      orderOn: "display order"
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var self = this,
      tableInfo = self.dm_extractFitsTable(nextProps.fits);
    //console.log(self.dm_makeHeaderRow     (tableInfo.columns));
    this.setState({
      header: self.dm_makeHeaderRow(tableInfo.columns),
      rows: tableInfo.data
    });
  },

  dm_extractFitsTable: function(jsonTable) {
    var columnMap = null;
    var columnMapIterator = [];
    var valueFormat = {};
    var valueTransform = {};
    var rowData = [];
    var self = this;

    _.each(jsonTable, function(value, key) {
      if (!columnMap) {
        columnMap = {};
        _.each(value, function(cellValue, cellName) {
          if (self.dm_supportedColumns[cellName]) {
            columnMap[cellName] = self.dm_supportedColumns[cellName];
            columnMapIterator[columnMap[cellName].order] = cellName;
            valueFormat[cellName] =
              self.dm_supportedColumns[cellName]["display_format"];
            if (_.isFunction(self.dm_supportedColumns[cellName]["transform"])) {
              valueTransform[cellName] =
                self.dm_supportedColumns[cellName]["transform"];
            }
          }
        });
        columnMapIterator = _.filter(columnMapIterator, function(v) {
          return v;
        });
      }

      var thisRow = [
        {
          value: key
          //style: {
          //  fontVariant: "small-caps"
          //}
        }
      ];

      _.each(columnMapIterator, function(tag) {
        var myValue = valueTransform[tag]
          ? valueTransform[tag](value[tag])
          : value[tag];

        if (valueFormat[tag]) {
          thisRow.push({
            value: myValue,
            format: valueFormat[tag]
          });
        } else {
          thisRow.push(myValue);
        }
      });

      rowData.push([
        thisRow,
        _.isNumber(value[self.props.orderOn])
          ? value[self.props.orderOn]
          : rowData.length
      ]);
    });

    return {
      data: _.map(
        _.sortBy(rowData, function(value) {
          return value[1];
        }),
        function(r) {
          return r[0];
        }
      ),
      columns: _.map(columnMapIterator, function(tag) {
        return columnMap[tag].value;
      })
    };
  },

  dm_makeHeaderRow: function(columnMap) {
    var headerRow = ["Model"];
    _.each(columnMap, function(v) {
      headerRow.push(v);
    });
    return headerRow;
  },

  getInitialState: function() {
    var tableInfo = this.dm_extractFitsTable(this.props.fits);

    return {
      header: this.dm_makeHeaderRow(tableInfo.columns),
      rows: tableInfo.data,
      caption: null
    };
  },

  render: function() {
    return (
      <div>
        <h4 className="dm-table-header">
          Model fits
          <span
            className="glyphicon glyphicon-info-sign"
            style={{ verticalAlign: "middle", float: "right" }}
            aria-hidden="true"
            data-toggle="popover"
            data-trigger="hover"
            title="Actions"
            data-html="true"
            data-content="<ul><li>Hover over a column header for a description of its content.</li></ul>"
            data-placement="bottom"
          />
        </h4>
        <DatamonkeyTable
          headerData={this.state.header}
          bodyData={this.state.rows}
        />
      </div>
    );
  }
});

var DatamonkeyTimersTable = React.createClass({
  dm_percentageFormatter: d3.format(".2%"),

  propTypes: {
    timers: React.PropTypes.object.isRequired
  },

  dm_formatSeconds: function(seconds) {
    var fields = [~~(seconds / 3600), ~~(seconds % 3600 / 60), seconds % 60];

    return _.map(fields, function(d) {
      return d < 10 ? "0" + d : "" + d;
    }).join(":");
  },

  dm_extractTimerTable: function(jsonTable) {
    var totalTime = 0,
      formattedRows = _.map(
        jsonTable,
        _.bind(function(value, key) {
          if (this.props.totalTime) {
            if (key == this.props.totalTime) {
              totalTime = value["timer"];
            }
          } else {
            totalTime += value["timer"];
          }
          return [key, value["timer"], value["order"]];
        }, this)
      );

    formattedRows = _.sortBy(formattedRows, function(row) {
      return row[2];
    });

    formattedRows = _.map(
      formattedRows,
      _.bind(function(row) {
        if (this.props.totalTime === null || this.props.totalTime != row[0]) {
          row[2] = {
            value: row[1] / totalTime,
            format: this.dm_percentageFormatter
          };
        } else {
          row[2] = "";
        }
        row[1] = this.dm_formatSeconds(row[1]);
        return row;
      }, this)
    );

    return formattedRows;
  },

  dm_makeHeaderRow: function() {
    return ["Task", "Time", "%"];
  },

  getInitialState: function() {
    return {
      header: this.dm_makeHeaderRow(),
      rows: this.dm_extractTimerTable(this.props.timers),
      caption: null
    };
  },

  render: function() {
    return (
      <DatamonkeyTable
        headerData={this.state.header}
        bodyData={this.state.rows}
      />
    );
  }
});

module.exports.DatamonkeyTable = DatamonkeyTable;
module.exports.DatamonkeyTableRow = DatamonkeyTableRow;
module.exports.DatamonkeyRateDistributionTable = DatamonkeyRateDistributionTable;
module.exports.DatamonkeyPartitionTable = DatamonkeyPartitionTable;
module.exports.DatamonkeyModelTable = DatamonkeyModelTable;
module.exports.DatamonkeyTimersTable = DatamonkeyTimersTable;
