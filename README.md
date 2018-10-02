# time-insights

The Template for this project was provided by [@blaqbern](https://github.com/blaqbern/typescript-react-starter)

## The specs

The component signature should look something like this:

`<TimeInsights default="24" className="cssClass" {...moreProps} />`

1) The total time logged is shown at the top
2) Aggregate all the tasks into an intermediary data set that eases iteration for display.
3) The legend/duration bar should be shown below the title, broken down as percentage of 100%.  Make your own colors up for the pallete of this bar and the aside in the tasks list.
4) Aggregate the tasks and show them in order, from highest duration to least duration.
5) Allow the user to click the filter icon, where a dropdown will be shown and when a selection is made, drives another search that will return a new data set.
6) The filter dropdown, the list itself, and the calendar popup should be ant-design components.

This project will include the following technologies:

* Typescript
* React
* ant-design

The timeline on this project is not more than two weeks though less will also work if your schedule permits.  To test correctness of the component, we will go over the UI and then I will run an alternate JSON data set (same data format) through your component.

And Design is located at <https://ant.design/>.  Please use version 3.5.1.

## So Far

1. The total time logged is shown at the top
    * Sum all duration by total for one datum

2. Aggregate all tasks into an intermediary data set that eases iteration for display.
    * This process iterating through our raw data only once, and mapping data by id.
    * The map is then transfromed into an array, which is then copied to be displayd.
    * TODO:
      * Check that aggregation is efficient
3. The legend/duration bar should be shown below the title, broken down as percentage of 100%.  Make your own colors up for the pallete of this bar and the aside in the tasks list.
    * For each datum, calculate DOM element width based on the ratio of the task duration to the total duration.
    * TODO:
      * Associate colors with relative ratio size, instead of assigning them on render.
      * *-note-* currently copy the array to maintain overall color assignment after applying filters

4. Aggregate the tasks and show them in order, from highest duration to least duration.
    * As per the second requirement, applied sorting algorithm to the array, comparing elements by duration.

5. Allow the user to click the filter icon, where a dropdown will be shown and when a selection is made, drives another search that will return a new data set.
    * Implemented using ant DropDown with a Menu overlay and SubMenu for the RangePicker
    * TODO:
      * Add some indication of which filter is currently being applied i.e Custom vs Preset
      * *-note-* Find a way to highlight sub menu item (by key?), similar to drop down key selection

6. The filter dropdown, the list itself, and the calendar popup should be ant-design components.
    * All components are ant-design components

