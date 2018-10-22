/** This is a "scratch" file, to test out ideas */

const { tasks } = require('./tasks.js');

const moment = require('moment');

/** NOTE:
  I refer to each raw datum as a "Task" and
  each "Task" has contributing "users"
  
	Below we use an object, and map tasks and nested users with their respective _ids.

	This process involves aggregating all information for each task, so we iterate
	through our raw data only once.

	This object is then mapped to an array for display. 
	
	An operations, can be made by looping through this array (order and filter)
	
	Example Input:
		[
			{
				"_id": "t1",
				"name": "Task 1",
				"duration": 60,
				"due": "2018-09-25T21:24:49.975Z",
				"user": {
					"_id": "u1",
					"name": "Nathan Douglas"
				}
			},
			{
				"_id": "t1",
				"name": "Task 1",
				"duration": 30,
				"due": "2018-09-25T21:24:49.975Z",
				"user": {
					"_id": "u1",
					"name": "Nathan Douglas"
				}
			},
			{
      "_id": "t2",
      "name": "Task 2",
			"duration": 30,
			"due": "2018-09-29T21:24:49.975Z",
      "user": {
        "_id": "u2",
        "name": "Mark Bradley"
      }                      
		]

	Example Output:
		[
			{
				"name": "Task 1",
				"time": 90,
				"due": "2018-09-25T21:24:49.975Z",
				"users": [
					{
						"duration": 90,
						"name": "Nathan Douglas"
					}
				]
			},
			{
				"name": "Task 2",
				"time": 30,
				"due": "2018-09-29T21:24:49.975Z",
				"users": [
					{
						"duration": 30,
						"name": "Mark Bradley"
					}
				]
			}
		] 
 */

// Object to be used as an intermediate for pre processing
const taskMap = {};

// Aggregating (pre-processing) the data...
tasks.forEach(t => {
	
	const task = taskMap[t._id];
	if(task) {
		taskMap[t._id].total += t.duration;
		 //look up user
		const user = taskMap[t._id].users[t.user._id];
		if(user) {
			// update existing user in task
			taskMap[t._id].users[t.user._id] = { ...user, duration : user.duration + t.duration };
		} else {
			// add new user to task
			taskMap[t._id].users[t.user._id] = { duration: t.duration, name: t.user.name };
		}
	} else {
		// Add new task
		const userMap = {};
		userMap[t.user._id] = { duration: t.duration, name: t.user.name };
		taskMap[t._id] = { due: t.due, name: t.name, total: t.duration, users : userMap};
	}
});


// Map tasks to an array
const taskArray = Object.keys(taskMap)
					.map(task_id => {
						let users = taskMap[task_id].users;

						users = Object.keys(users)
									.map(user_id => users[user_id])
									.sort((a,b) => b.duration - a.duration);

						taskMap[task_id].users = users;
						return taskMap[task_id];
					})
					.sort((a,b) => b.total - a.total);

// console.log(JSON.stringify(taskArray,null, 2));


/** Helpers? **/

// Get the total duration
const timeReducer = (acc, c) => acc + c.duration;
taskArray.reduce(timeReducer, 0);

const total = taskArray.reduce(timeReducer, 0);

// console.log('Total time spent: ', total);

// % duration for each task //NO LONGER USED
// const taskPercentContributions = taskArray.map(task => { 
// 	return {name: task.name, time: (task.time/total * 100).toFixed(1)};
// });

// console.log(taskPercentContributions);

// % duration for each task.user //NO LONGER USED
// taskArray.map(task => { 
// 	const task_total = task.time;
// 	Object.keys(task.users)
// 		.map(user_id => task.users[user_id])
// 		.forEach(user => {
// 			const toPrint = {...user, duration: (user.duration/task_total * 100).toFixed(1)};
// 			// console.log(task.name, toPrint);
// 		});
// });



/** To generate dummy "due date" data*/
// let count = 1;
// let d;
// let inter = setInterval(() => {
// 	if(count > 5) {
// 		clearInterval(inter);
// 	}
// 	else {
// 		d = new Date()
// 		console.log(d.toISOString());
// 		count++;
// 	}
// }, 1000);

/** Filtering */

// const filtered = taskArray.filter();


/** Date Filter Functions with Moment */

const pastDay = () => {
	const today = moment();
	const pastDay = moment(today).subtract(24, 'hours');
	const middle = moment(today).subtract(12, 'hours');

	if(middle < today && middle > pastDay) {
		console.log('PAST DAY:', moment(middle).format('MM-DD-YY'));
	}
}

const pastWeek = () => {
	const today = moment()
	const pastWeek = moment(today).subtract(7, 'days');
	const middle = moment(today).subtract(3, 'days');

	if(middle < today && middle > pastWeek) {
		console.log('PAST WEEK:', moment(middle).format('MM-DD-YY'));
	}
}

const pastMonth = () => {
	const today = moment()
	const pastMonth = moment(today).subtract(1, 'month');
	const middle = moment(today).subtract(15, 'days');

	if(middle < today && middle > pastMonth) {
		console.log('PAST MONTH:', moment(middle).format('MM-DD-YY'));
	}
}

const pastYear = () => {
	const today = moment()
	const pastYear = moment(today).subtract(1, 'month');
	const middle = moment(today).subtract(15, 'days');

	if(middle <= today && middle >= pastYear) {
		console.log('PAST YEAR:', moment(middle).format('MM-DD-YY'));
	}
}

const customRange = (dateRange) => (date) => {
	const start = moment(dateRange[0]);
	const end = moment(dateRange[1]);
	const date = moment(date);
	if(date <= end && date >= start) {
		return true;
	}
	return false;
}

/** String Filter Function on taskArray */

const searchUsers = (searchText, users) => {
	return users.filter((user) => user.name.indexOf(searchText) >= 0)[0] ? true : false;
}

const filterSearchText = (searchText) => (task) => task.name.indexOf(searchText) >=0 || searchUsers(searchText, task.users);

// console.log(JSON.stringify(taskArray,null, 2));

const filtered = taskArray.filter(filterSearchText("Task 1"));


