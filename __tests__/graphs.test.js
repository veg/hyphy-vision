// __tests__/graphs.test.js
"use strict";

jest.unmock("../src/jsx/components/graphs.jsx");

import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-dom/test-utils";
import renderer from "react-test-renderer";
import {
  DatamonkeySeries,
  DatamonkeyGraphMenu
} from "../src/jsx/components/graphs.jsx";
import { mount } from "enzyme";

var _ = require("underscore");

describe("DatamonkeySeries", () => {
  var x = _.range(10);
  var y = [_.range(10)];

  const component = renderer.create(
    <DatamonkeySeries
      x={x}
      y={y}
      marginLeft={50}
      width={500}
      transitions={true}
      doDots={true}
    />
  );

  it("should create an svg element", () => {
    let chart = component.toJSON();
    expect(chart).toMatchSnapshot();
  });
});

describe("GraphMenu", () => {
  var x_options = ["Site"];
  var y_options = ["alpha", "beta"];

  const updateAxisSelectionMock = jest.fn();

  const component = mount(
    <DatamonkeyGraphMenu
      x_options={x_options}
      y_options={y_options}
      axisSelectionEvent={updateAxisSelectionMock}
    />
  );

  it("should trigger event when selection changes", () => {
    // Click a button
    component
      .find("a[data-dimension='beta']")
      .simulate("click", {
        target: { dataset: { dimension: "beta", axis: "yaxis" } }
      });
    expect(updateAxisSelectionMock.mock.calls.length).toBe(1);
  });
});
