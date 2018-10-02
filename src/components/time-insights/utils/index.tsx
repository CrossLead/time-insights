import * as React from 'react';
import * as moment from 'moment';
import { List } from 'antd';

import { User, rawTask, intermediateTask, processedTask } from '../typedef';
import { isIntermediateTask } from '../typedef';


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

export const renderTask = (total: number, colors: string[]) => (task: processedTask) => (
	<List.Item>
		<List.Item.Meta
			title={task.name}
			description={generateDescription(task.users, task.due)}
			avatar={generateAvatar(task.duration, total, colors.pop())}
			className="task"
		/>
	</List.Item>
);

export const renderLegend = (tasks : processedTask[], colors: string[], total: number) => {
	return (
	<div className="timeInsightsLegend">{
		tasks.map((t, key) => <div key={key} style={{display: 'inline-block', background: colors.pop(), height: '16px', width: `${(t.duration/total * 100).toFixed(1)}%` }}></div>)
	}</div>
	);
}

export const makeTaskList = (taskMap: Map<string, intermediateTask>) : processedTask[] => {
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

export const processTasks = (data: rawTask[]) : processedTask[] => {

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

export const applyFilters = (taskArray: processedTask[], dateFilter: string, searchString: string, dateStrings: string[] ) : processedTask[] => {
	let filtered : processedTask[] = taskArray;

	if(dateFilter ==="DAY") {
		filtered = taskArray.filter(pastDay);
	}
	if(dateFilter ==="WEEK") {
		filtered = taskArray.filter(pastWeek);
	}
	if(dateFilter ==="MONTH") {
		filtered = taskArray.filter(pastMonth);
	}
	if(dateFilter ==="YEAR") {
		filtered = taskArray.filter(pastYear);
	}
	if(dateFilter ==="CUSTOM") {
		filtered = taskArray.filter(customRange(dateStrings));
	}

	if(searchString) {
		filtered = filtered.filter(filterSearchText(searchString));
	}
	return filtered;
}


const searchUsers = (searchText: string, users : User[]): boolean => {
	return users.filter((user) => user.name.indexOf(searchText) >= 0)[0] ? true : false;
}

const filterSearchText = (searchText: string) => (task: processedTask) : boolean => task.name.indexOf(searchText) >=0 || searchUsers(searchText, task.users);

const pastDay = ({due} : processedTask ): boolean => {
	const today = moment();
	const pastDay = moment(today).subtract(24, 'hours');
	const dueDate = moment(due);
	if(dueDate < today && dueDate > pastDay) return true;
	return false;
}

const pastWeek = ({due} : processedTask ): boolean => {
	const today = moment()
	const pastWeek = moment(today).subtract(7, 'days');
	const dueDate = moment(due);
	if(dueDate < today && dueDate > pastWeek) return true;
	return false;
}

const pastMonth = ({due} : processedTask ): boolean => {
	const today = moment()
	const pastMonth = moment(today).subtract(1, 'month');
	const dueDate = moment(due);
	if(dueDate < today && dueDate > pastMonth) return true;
	return false;
}

const pastYear = ({due} : processedTask ): boolean => {
	const today = moment()
	const pastYear = moment(today).subtract(1, 'month');
	const dueDate = moment(due);
	if(dueDate <= today && dueDate >= pastYear) return true;
	return false;
}

const customRange = (dateRange:  string[]) => ({due} : processedTask): boolean => {
	const start = moment(dateRange[0]);
	const end = moment(dateRange[1]);
	const date = moment(due);
	if(date <= end && date >= start) return true;
	return false;
}