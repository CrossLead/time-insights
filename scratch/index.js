/** This is a "scratch" file, to test out ideas */

const { tasks } = require('./tasks.js');

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
				"user": {
					"_id": "u1",
					"name": "Nathan Douglas"
				}
			},
			{
				"_id": "t1",
				"name": "Task 1",
				"duration": 30,
				"user": {
					"_id": "u1",
					"name": "Nathan Douglas"
				}
			},
			{
      "_id": "t2",
      "name": "Task 2",
      "duration": 30,
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
				"users": {
					"u1": {
						"duration": 90,
						"name": "Nathan Douglas"
					}
				}
			},
			{
				"name": "Task 2",
				"time": 30,
				"users": {
					"u2": {
						"duration": 30,
						"name": "Mark Bradley"
					}
				}
			}
		] 
 */

// Object to be used as an intermediate for pre processing
const taskMap = {};

// Aggregating (pre-processing) the data...
tasks.forEach(t => {
	
	const task = taskMap[t._id];
	if(task) {
		taskMap[t._id].time += t.duration;
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
		taskMap[t._id] = {name: t.name, time: t.duration, users : userMap};
	}
});


// Map tasks to an array
const taskArray = Object.keys(taskMap).map(task_id => taskMap[task_id]);

// console.log(JSON.stringify(taskArray,null, 2));


/** Helpers? **/

// Get the total duration
const timeReducer = (acc, c) => acc + c.time;
taskArray.reduce(timeReducer, 0);

const total = taskArray.reduce(timeReducer, 0);

// console.log('Total time spent: ', total);

// % duration for each task
const taskPercentContributions = taskArray.map(task => { 
	return {name: task.name, time: (task.time/total * 100).toFixed(1)};
});

// console.log(taskPercentContributions);

// % duration for each task.user
taskArray.map(task => { 
	const task_total = task.time;
	Object.keys(task.users)
		.map(user_id => task.users[user_id])
		.forEach(user => {
			const toPrint = {...user, duration: (user.duration/task_total * 100).toFixed(1)};
			// console.log(task.name, toPrint);
		});
});
