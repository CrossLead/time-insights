import * as React from 'react';
import { List, Icon, Input, Dropdown, Menu, DatePicker } from 'antd';
import * as moment from 'moment';

import { rawTask, processedTask } from './typedef';
import { processTasks, renderTask, renderLegend } from './utils/index';
import './index.css';

/** Shapes for State & Props */

const initialState = {
	dateFilter : "all",
	loading: false,
	searchInput: "",
	dateString: ""
}

type State = Readonly<typeof initialState>;

type Props = Readonly<{
	data: rawTask[];
}>;

/** setState functions */
// TODO: implement stubs
const updateFilter = (prevState: State, event: React.MouseEvent<HTMLElement>) : void => {

}

const updateSearchTerm = (prevState: State, searchInput: string) : void =>{

}

const changeDate = (prevState: State, date: moment.Moment, dateString: string) : void => {

}

export class TimeInsights extends React.Component<Props, State> {

	readonly state : State = initialState;

	getTotalTime = (tasks: processedTask[]) : number => {
		const timeReducer = (acc : number, c : processedTask ) => acc + c.duration;
		const total = tasks.reduce(timeReducer, 0);
		return total;
	}

	// setState Methods
	private handleDateFilter = (event: React.MouseEvent<HTMLElement>) => {
		console.log(event);
	};
	private handleSearchInput = (input: string) => {
		console.log(input)
	};
	private handleDatePicker = (date: moment.Moment, dateString: string) => {
		console.log(date, dateString);
	};

	render() {
		const { dateFilter } = this.state;
		const { data } = this.props;

		const tasks : processedTask[] = processTasks(data).sort((a,b) => b.duration - a.duration);
		const total : number = this.getTotalTime(tasks);

		// Throw Away Color Array ( since we know our final length ), we copy this
		// TODO: Generate color based on %
		const colors = ['#08f7af','#304f6e','#12e1dc', '#228bee', '#6fb1f0'].reverse();

		const fitlerMenuOverLay = (
			<Menu>
				<Menu.Item onClick={this.handleDateFilter} key="0" value={"day"}>Past 24 Hours</Menu.Item>
				<Menu.Item onClick={this.handleDateFilter} key="1" value={"week"}>Last 7 Days</Menu.Item>
				<Menu.Item onClick={this.handleDateFilter} key="2" value={"m2d"}>Month To Date</Menu.Item>
				<Menu.Item onClick={this.handleDateFilter} key="3" value={"y2d"}>Year To Date</Menu.Item>
				<Menu.Item onClick={this.handleDateFilter} key="4" value={"all"}>All</Menu.Item>
				<Menu.SubMenu key="sub1" title={<span>Custom Range</span>}>
					<DatePicker onChange={this.handleDatePicker}/>
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
						dataSource={tasks}
						renderItem={renderTask(total, colors.map(c => c))}
					/>
				</div>
			</div>
		)
	}
};

export default TimeInsights;