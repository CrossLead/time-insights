# time-insights

Time insights component

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