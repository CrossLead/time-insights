import * as React from 'react';
import { List, Icon, Input, Dropdown, Menu, DatePicker } from 'antd';

import './index.css';
import * as moment from 'moment';


/** Shape for "raw" Task (rawTask) */
interface rawTask {
	_id: string,
	duration: number,
	name: string,
	due: string,
	user: {
		_id: string,
		name: string
	}
}

/** Shape for "intermediate" Task (intermediateTask) */

interface intermediateTask {
	name: string,
	duration: number,
	due: string,
	users: Map<string, User>;
}

function isIntermediateTask(item: intermediateTask | undefined): item is intermediateTask {
	return item !== undefined;
}

/** Shape for "processed" Task (processedTask) */

interface processedTask {
	name: string,
	duration: number,
	due: string,
	users: User[]
}

/** Shape for user */

interface User {
	duration: number, 
	name: string
}

/** Shapes for State & Props */

const initialState = {
	dateFilter : "all",
	loading: false,
	searchInput: "",
	dateString: ""
}

type State = Readonly<typeof initialState>;

type Props = {
	data: rawTask[];
};

/** Static Methods */

const makeTaskList = (taskMap: Map<string, intermediateTask>) : processedTask[] => {
	const list : processedTask[] = [];
	taskMap.forEach(item => {
		if(isIntermediateTask(item)) {
			let userArray : User[] = [];
			item.users.forEach(user => {
				userArray.push(user);
			});
			userArray.sort((a,b) => b.duration - a.duration);
			const processedTask : processedTask = {
				...item,
				users: userArray
			};
			list.push(processedTask);
		}
	})
	return list;
};

const processTasks = (data: rawTask[]) : processedTask[] => {

	const taskMap : Map<string, intermediateTask> = new Map<string, intermediateTask>();

	data.forEach(t => {
		//look up task
		let task = taskMap.get(t._id);
		if(task) {
			// update task...
			task.duration += t.duration;
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
			taskMap.set(t._id, {name: t.name, due: t.due, duration: t.duration, users : newUserMap});
		}
	});

	const tasks : processedTask[] = makeTaskList(taskMap);

	return tasks;
}

/** HELPERS **/

// Total Time
const getTotalTime = (tasks: processedTask[]) : number => {
	const timeReducer = (acc : number, c : processedTask ) => acc + c.duration;
	const total = tasks.reduce(timeReducer, 0);
	return total;
}

// Legend render
const generateLegend = (tasks : processedTask[], colors: string[], total: number) => {
	return (
	<div className="timeInsightsLegend">{
		tasks.map((t, key) => <div key={key} style={{display: 'inline-block', background: colors.pop(), height: '16px', width: `${(t.duration/total * 100).toFixed(1)}%` }}></div>)
	}</div>
	);
}

/** Task Render Helpers **/
const generateAvatar = (time : number, total: number, color: string | undefined) : JSX.Element => {
	return (
		<div className="taskAvatar">
			<div className="percentTime">{`${Math.floor(time/total * 100)}%`}</div>
			<div className="colorTag" style={{background: color}}></div>
		</div>
	);
}

const generateDescription = (users: User[], due: string) : JSX.Element => {
	let main = `${users[0].duration/60} hr `;
	let rest =  `by ${users[0].name}`
	let dueDate = ` || due: ${moment(due).format('MM/DD/YY')}`;
	if(users.length > 1) {
		rest += `, +${users.length - 1}`;
	}
	return (
	<div className="descriptionText">
		<span className="userDuration">{main}</span>
		{rest}
		<span className="taskDueDate">{dueDate}</span>
	</div>)
}

// Task Render Function
const task = (total: number, colors: string[]) => (task: processedTask) => (
	<List.Item>
		<List.Item.Meta
			title={task.name}
			description={generateDescription(task.users, task.due)}
			avatar={generateAvatar(task.duration, total, colors.pop())}
			className="task"
		/>
	</List.Item>
);

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
		const total : number = getTotalTime(tasks);

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
					{generateLegend(tasks, colors.map(c => c), total)}
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
						renderItem={task(total, colors.map(c => c))}
					/>
				</div>
			</div>
		)
	}
};

export default TimeInsights;