"use strict";

jest.unmock("../src/jsx/components/graphs.jsx");

import React from "react";
import renderer from "react-test-renderer";
import {
  DatamonkeySeries,
  DatamonkeyScatterplot,
  DatamonkeyGraphMenu
} from "../src/jsx/components/graphs.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mount } from "enzyme";

var _ = require("underscore");

Enzyme.configure({ adapter: new Adapter() });

describe("DatamonkeySeries", () => {
  var x = _.range(10);
  var y = [_.range(10)];

  const component = renderer.create(
    <DatamonkeySeries
      x={x}
      y={y}
      y_label={"y values"}
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

describe("DatamonkeyScatterplot", () => {
  var x = _.range(10);
  var y = [_.range(10)];

  const component = renderer.create(
    <DatamonkeyScatterplot
      x={x}
      y={y}
      y_label={"y values"}
      marginLeft={50}
      height={400}
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
    component.find("a[data-dimension='beta']").simulate("click", {
      target: { dataset: { dimension: "beta", axis: "yaxis" } }
    });
    expect(updateAxisSelectionMock.mock.calls.length).toBe(1);
  });

  it("Graph menu should handle empty y_options", () => {
    const no_ylabel_component = renderer.create(
      <DatamonkeyGraphMenu
        x_options={x_options}
        y_options={[]}
        axisSelectionEvent={updateAxisSelectionMock}
      />
    );

    let menu = no_ylabel_component.toJSON();
    expect(menu).toMatchSnapshot();
  });
});
