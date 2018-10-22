import * as React from 'react';
import { List, Icon, Input, Dropdown, Menu, DatePicker } from 'antd';
import { SelectParam } from 'antd/lib/menu';

import { rawTask, processedTask } from './typedef';
import { processTasks, applyFilters, renderTask, renderLegend } from './utils';
import './index.css';
import { RangePickerValue } from 'antd/lib/date-picker/interface';

/** Shapes for State & Props */

const initialState = {
	dateFilter: "ALL",
	dateStrings: ["",""],
	searchString: "",
	menuKey: "0"
}

type State = Readonly<typeof initialState>;

type Props = Readonly<{
	data: rawTask[];
}>;

/** setState functions */
// TODO: implement stubs
const updateFilter = (dateFilter: string, menuKey: string) => (prevState: State) : State => ({...prevState, dateFilter, menuKey});

const updateSearchTerm = (searchString: string) => (prevState: State) : State => ({...prevState, searchString});

const updateCustomDate = (dates: RangePickerValue, dateStrings: [string,string]) => (prevState: State) : State => {
	return { 
		...prevState, 
		dateStrings,
		dateFilter: "CUSTOM",
		menuKey: "sub1",
	};
}

export class TimeInsights extends React.Component<Props, State> {

	readonly state : State = initialState;

	getTotalTime = (tasks: processedTask[]) : number => {
		const timeReducer = (acc : number, c : processedTask ) => acc + c.duration;
		const total = tasks.reduce(timeReducer, 0);
		return total;
	}

	// setState Methods
	private handleDateFilter = ({item:{props:{value: fitlerString, key: menuKey}}}: SelectParam) => this.setState(updateFilter(fitlerString, menuKey));
	private handleSearchInput = (input: string) => this.setState(updateSearchTerm(input));
	private handleRangePicker = (dates: RangePickerValue, dateStrings: [string, string]) => this.setState(updateCustomDate(dates, dateStrings));

	render() {
		const {dateFilter, dateStrings, searchString, menuKey} = this.state;
		const { data } = this.props;

		const tasks : processedTask[] = processTasks(data).sort((a,b) => b.duration - a.duration);
		const total : number = this.getTotalTime(tasks);

		const toDisplay : processedTask[] = applyFilters(tasks, dateFilter, searchString, dateStrings );

		// Color Array ( for testing ), we copy this
		// TODO: Generate color based on %
		const colors = ['#08f7af','#304f6e','#12e1dc', '#228bee', '#6fb1f0'].reverse();

		const fitlerMenuOverLay = (
			<Menu onSelect={this.handleDateFilter} selectable={true} defaultSelectedKeys={[menuKey]}>
				<Menu.Item key="0" value={"ALL"}>All</Menu.Item>
				<Menu.Item key="1" value={"DAY"}>Past 24 Hours</Menu.Item>
				<Menu.Item key="2" value={"WEEK"}>Last 7 Days</Menu.Item>
				<Menu.Item key="3" value={"MONTH"}>Month To Date</Menu.Item>
				<Menu.Item key="4" value={"YEAR"}>Year To Date</Menu.Item>
				<Menu.SubMenu key="sub1" title={<span>Custom Range</span>}>
					<DatePicker.RangePicker onChange={this.handleRangePicker} format={"MM/DD/YY"}/>
				</Menu.SubMenu>
			</Menu>
		);
	
		return (
			<div className="timeInsights">
				<div className="timeInsightsContainer">
					<div className="timeInsightsHeader">
						<div className="left">
							<h3>Time Insights</h3>
							<Dropdown overlay={fitlerMenuOverLay} trigger={['click']}>
								<Icon className="filter" type="filter" theme="filled"/>
							</Dropdown>
						</div>
						<div className="right">
							<div className="totalHours"><span>{Math.floor(total/60)}</span> hrs logged</div>
						</div>
					</div>
					{renderLegend(tasks, colors.map(c => c), total)}
					<div className="listHeader">
						<h4>Top Task's</h4>
						<Input.Search
							className="searchBar"
							placeholder="Search Tasks"
							onSearch={this.handleSearchInput}
							style={{ width: 200 }}
						/>
					</div>
					<List
						itemLayout="horizontal"
						dataSource={toDisplay}
						renderItem={renderTask(total, colors.map(c => c))}
					/>
				</div>
			</div>
		)
	}
};

export default TimeInsights;