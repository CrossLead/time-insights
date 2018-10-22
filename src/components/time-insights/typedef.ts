
/** Shape for "raw" Task (rawTask) */

export type rawTask = {
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

export type intermediateTask = {
	name: string,
	duration: number,
	due: string,
	users: Map<string, User>;
}

export function isIntermediateTask(item: intermediateTask | undefined): item is intermediateTask {
	return item !== undefined;
}

/** Shape for "fully pre-processed" Task (processedTask) */
export type processedTask = {
	name: string,
	duration: number,
	due: string,
	users: User[]
}

/** User type */
export type User = {
	duration: number, 
	name: string
}