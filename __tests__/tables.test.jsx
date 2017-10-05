"use strict";

jest.unmock("../src/jsx/components/tables.jsx");

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import renderer from "react-test-renderer";
import { DatamonkeyTable } from "../src/jsx/components/tables.jsx";
import { mount } from "enzyme";

var _ = require("underscore");

import $ from "jquery";
global.$ = global.jQuery = $;
require("jquery-ui-bundle");

describe("DatamonkeyTable", () => {
  var mle_headers = [
    { value: "Site", sortable: true, abbr: "Site Position" },
    {
      value: "alpha",
      abbr: "Synonymous substitution rate at a site",
      sortable: true
    },
    {
      value: "beta",
      abbr: "Non-synonymous substitution rate at a site",
      sortable: true
    },
    {
      value: "alpha=beta",
      abbr: "The rate estimate under the neutral model",
      sortable: true
    },
    {
      value: "LRT",
      abbr:
        "Likelihood ration test statistic for beta = alpha, versus beta &neq; alpha",
      sortable: true
    },
    {
      value: "p-value",
      abbr:
        "Likelihood ration test statistic for beta = alpha, versus beta &neq; alpha",
      sortable: true
    },
    {
      value: "Total branch length",
      abbr:
        "The total length of branches contributing to inference at this site, and used to scale dN-dS",
      sortable: true
    }
  ];
  var mle_content = [
    [1, "0.000", "14.321", "9.358", "0.657", "0.418", "18.382"],
    [2, "119.000", "0.000", "0.000", "0.000", "1.000", "0.000"],
    [3, "0.000", "0.000", "0.000", "0.000", "1.000", "0.000"],
    [4, "2.321", "2.079", "2.157", "0.007", "0.935", "3.704"],
    [5, "4.715", "1.484", "1.808", "0.644", "0.422", "4.007"],
    [6, "2.802", "2.833", "2.824", "0.000", "0.990", "4.886"],
    [7, "0.000", "9.738", "7.035", "1.427", "0.232", "12.499"],
    [8, "0.780", "2.411", "1.869", "1.012", "0.314", "3.443"],
    [9, "0.000", "1.510", "0.866", "4.176", "0.041", "1.938"],
    [10, "20.000", "20.388", "0.373", "0.077", "0.781", "0.498"]
  ];

  it("should sort floats correctly", () => {
    const table = mount(
      <DatamonkeyTable
        headerData={mle_headers}
        bodyData={mle_content}
        classes={"table table-condensed"}
      />
    );

    // sort on alpha
    var elem = table.find("th").at(1);
    elem.simulate("click");
    elem.simulate("click");
    expect(table.find("td").at(1).text()).toBe("119.000");
  });

  it("sort columns that are already sorted (tests bug fix)", () => {
    const table = mount(
      <DatamonkeyTable
        headerData={mle_headers}
        bodyData={mle_content}
        classes={"table table-condensed"}
      />
    );

    // sort on alpha
    var elem = table.find("th").at(0);
    elem.simulate("click");
    elem.simulate("click");
    expect(table.find("td").at(0).text()).toBe("10");
  });
});
