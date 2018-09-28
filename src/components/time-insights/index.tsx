import * as React from 'react';
import { List, Icon, Input, Dropdown, Menu, DatePicker } from 'antd';

import './index.css';
import * as moment from 'moment';


/** Shape for "raw" Task */
interface Task {
	_id: string,
	duration: number,
	name: string,
	due: string,
	user: {
		_id: string,
		name: string
	}
}

type Props = {
	data: Task[];
};

/** Shape for "processed" Task (pTask) */

interface pTask {
	name: string,
	time: number,
	due: string,
	users: Map<string, User>
}

interface User {
	duration: number, 
	name: string
}

function isPTask(item: pTask | undefined): item is pTask {
	return item !== undefined;
}

/** Shapes for State */

const initialState = {
	dateFilter : "all",
	loading: false,
	searchInput: "",
	dateString: ""
}

type State = Readonly<typeof initialState>;

/** setState functions */



/** Static Methods */

const makeTaskList = (taskMap: Map<string, pTask>) : pTask[] => {
	const list : pTask[] = [];
	taskMap.forEach(item => {
		if(isPTask(item)) {
			list.push(item);
		}
	})
	return list;
};

const processTasks = (data: Task[]) : pTask[] => {

	const taskMap : Map<string, pTask> = new Map<string, pTask>();

	data.forEach(t => {
		//look up task
		let task = taskMap.get(t._id);
		if(task) {
			// update task...
			task.time += t.duration;

			// look up user
			let user = task.users.get(t.user._id);
			if(user) {
				// update existing user
				task.users.set(t.user._id, { ...user, duration: user.duration + t.duration });
			} else {
				// set new user
				task.users.set(t.user._id, { duration: t.duration, name: t.user.name });
			}
			taskMap.set(t._id, task);
		} else {
			// set new task
			const newUserMap : Map<string, User> = new Map<string, User>();
			newUserMap.set(t.user._id, {duration: t.duration, name: t.user.name});
			taskMap.set(t._id, {name: t.name, due: t.due, time: t.duration, users : newUserMap});
		}
	});

	const tasks : pTask[] = makeTaskList(taskMap);

	return tasks;
}

/** Helpers **/

// Total Time
const getTotalTime = (tasks: pTask[]) : number => {
	const timeReducer = (acc : number, c : pTask ) => acc + c.time;
	const total = tasks.reduce(timeReducer, 0);
	return total;
}

// Legend render
const generateLegend = (tasks : pTask[], colors: string[], total: number) => {
	return (
	<div className="timeInsightsLegend">{
		tasks.map((t, key) => <div key={key} style={{display: 'inline-block', background: colors.pop(), height: '10px', width: `${(t.time/total * 100).toFixed(1)}%` }}></div>)
	}</div>
	);
}

// Task Render Function
const task = (total: number, colors: string[]) => (task: pTask) => (
	<List.Item>
		<List.Item.Meta
			title={task.name}
			description={generateDescription(task.users)}
			avatar={generateAvatar(task.time, total, colors.pop())}
			className="task"
		/>
	</List.Item>
);

// Task Render Helpers
const generateAvatar = (time : number, total: number, color: string | undefined) => {
	return (
		<div className="taskAvatar">
			<div className="percentTime">{`${Math.floor(time/total * 100)}%`}</div>
			<div className="colorTag" style={{background: color}}></div>
		</div>
	);
}

const generateDescription = (users: Map<string, User>) : string => {
	let description = "";
	users.forEach( user => description+=`${user.duration/60} hrs by ${user.name}, `);
	return description.slice(0, -2); //remove trailing comma
}

const updateFilter = (prevState: State, event: React.MouseEvent<HTMLElement>) => {
	// console.log(event);
	// return {
	// 	...prevState, 
	// 	filter : value
	// }
}

const updateSearchTerm = (prevState: State, searchInput: string) : State =>{
	return {
		...prevState, searchInput
	}
}

const changeDate = (prevState: State, date: moment.Moment, dateString: string) : State => {
	return {
		...prevState, dateString
	}
}

export class TimeInsights extends React.Component<Props, State> {

	readonly state : State = initialState;


	// setState Methods
	private handleFilter = (event: React.MouseEvent<HTMLElement>) => this.setState(updateFilter);
	private handleSearchInput = (input: string) => this.setState(updateSearchTerm);
	private handleDateChange = (date: moment.Moment, dateString: string) => this.setState(changeDate);

	render() {
		const { filter } = this.state;
		const { data } = this.props;

		const tasks : pTask[] = processTasks(data);
		const total : number = getTotalTime(tasks);

		// Throw Away Color Array ( since we know our final length ), we copy this
		const colors = ['#08f7af','#304f6e','#12e1dc', '#228bee', '#6fb1f0']

		const fitlerMenuOverLay = (
			<Menu>
				<Menu.Item onClick={this.handleFilter} key="0" value={"day"}>Past 24 Hours</Menu.Item>
				<Menu.Item onClick={this.handleFilter} key="1" value={"week"}>Last 7 Days</Menu.Item>
				<Menu.Item onClick={this.handleFilter} key="2" value={"m2d"}>Month To Date</Menu.Item>
				<Menu.Item onClick={this.handleFilter} key="3" value={"y2d"}>Year To Date</Menu.Item>
				<Menu.Item onClick={this.handleFilter} key="4" value={"all"}>All</Menu.Item>
				<Menu.SubMenu key="sub1" title={<span>Custom Range</span>}>
					<DatePicker onChange={this.handleDateChange}/>
				</Menu.SubMenu>
			</Menu>
		);
	
		return (
			<div className="timeInsights">
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
				{generateLegend(tasks, colors.map(c => c), total)}
				<div className="listHeader">
					<div className="container">
						<h4>Task's List</h4>
						<Input.Search
							className="searchBar"
							placeholder="Search Tasks"
							onSearch={this.handleSearchInput}
							style={{ width: 200 }}
						/>
					</div>
				</div>
				<List
					itemLayout="horizontal"
					dataSource={tasks}
					renderItem={task(total, colors.map(c => c))}
				/>
			</div>
		)
	}
};

export default TimeInsights;