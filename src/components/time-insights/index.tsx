import * as React from 'react';
import { List, Icon, Input } from 'antd';

import './index.css';


/** Shape for "raw" Task */
interface Task {
	_id: string,
	duration: number,
	name: string,
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
	filter : "desc"
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
			taskMap.set(t._id, {name: t.name, time: t.duration, users : newUserMap});
		}
	});

	const tasks : pTask[] = makeTaskList(taskMap);

	return tasks;
}

const getTotalTime = (tasks: pTask[]) : number => {
	const timeReducer = (acc : number, c : pTask ) => acc + c.time;
	const total = tasks.reduce(timeReducer, 0);
	return total;
}

export class TimeInsights extends React.Component<Props, State>{

	readonly state : State = initialState;


	render() {

		const { filter } = this.state;
		const { data } = this.props;

		const tasks : pTask[] = processTasks(data);

		const total : number = getTotalTime(tasks);

		// Percent Calculation for each task
		const generateAvatar = (time : number) => {
			return (
				<div className="taskAvatar">
					<div className="percentTime">{`${(time/total * 100).toFixed(1)} %`}</div>
					<div className="colorTag"></div>
				</div>
			);
		}

		const generateDescription = (users: Map<string, User>) : string => {
			let description = "";
			users.forEach( user => {
				description+= `${user.duration} by ${user.name}, `
			});
			description = description.slice(0, -2); //remove trailing comma
			return description;
		}


		const task = (task: pTask) => (
			<List.Item>
				<List.Item.Meta
					title={task.name}
					description={generateDescription(task.users)}
					avatar={generateAvatar(task.time)}
					className="task"
				/>
			</List.Item>
		);
	
		return (
			<div className="timeInsights">
				<div className="timeInsightsHeader">
					<div className="left">
						<div>Time Insights</div>
						<Icon onClick={(event: React.MouseEvent<HTMLElement>) => { console.log(event)}} type="filter" theme="outlined" />
					</div>
					<div className="right">
						<div>{total} of time</div>
					</div>
				</div>
				<List
					itemLayout="horizontal"
					dataSource={tasks}
					renderItem={task}
				/>
			</div>
		)
	}
};

export default TimeInsights;