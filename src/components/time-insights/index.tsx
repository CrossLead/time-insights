import * as React from 'react';
import { List, Icon } from 'antd';

import './index.css';


/** Shapes for props **/
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

/*** Processed Task Shape ***/

interface pTask {
	name: string,
	time: number,
	users: User[]
}

/** Shapes for State **/

const initialState = {
	filter : "desc",
	taskArray: []
}

interface User {
	duration: number, 
	name: string
}

type State = Readonly<typeof initialState>;

/** State Update Functions **/

// const updateFilter = () => "nothing";

const processTaskData = (prevState: State, props: Props) => {
	// console.log(props);
	// const taskMap = {}
	// 	data.forEach(t => {
	// 		if(taskMap[t._id]) {
	// 			taskMap[t._id].time += t.duration;
	// 			taskMap[t._id].users.push({duration: t.duration, name: t.user.name});
	// 		} else {
	// 			taskMap[t._id] = {name: t.name, time: t.duration, users : [ { duration: t.duration, name: t.user.name} ]};
	// 		}
	// 	})
	// 	const taskArray = Object.keys(taskMap).map(task_id => taskMap[task_id]);
}

export class TimeInsights extends React.Component<Props, State>{

	readonly state : State = initialState;

	// private handleFilter = (event: React.MouseEvent<HTMLElement>) => this.setState(updateFilter);
	// private initTaskArray = (data : Task[]) => this.setState(processTaskData);
		

	componentDidMount() {
		// const { data } = this.props;
		// this.setState((prevState: State) => {
		// 	return {...prevState, taskArray: this.initTaskArray(data)}
		// });
	}

	/**
	 *	initialize with props is bad? maybe pre-process tasks outside of component
	 *
	 *		constructor(props) {
	 *			super(props);
	 *			this.state = {
	 *				filter: "desc",
	 *				taskArray : this.initTaskArray(props.data);
	 *			}
	 *		}
	 *
	 */

	render() {

		const { filter } = this.state;
		const { data } = this.props;

		const generateTag = () => {
			return (
				<div className="color-tag"></div>
			);
		}

		const task = (task: Task) => (
			<List.Item>
				<List.Item.Meta
					title={task.name}
					description={task.user.name}
					avatar={generateTag()}
					className="task"
				/>
			</List.Item>
		);
	
		return (
			<div>
				<div>Time Insights</div>
				<Icon type="filter" theme="outlined" />
				<div>Duration:{20}hrs</div>
				<List
					itemLayout="horizontal"
					dataSource={data}
					renderItem={task}
				/>
			</div>
		)
	}
};

export default TimeInsights;