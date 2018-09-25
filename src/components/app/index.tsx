import * as React from 'react';

import TimeInsights from '../time-insights';
import './App.css';

import dataStream from '../../tasks';

class App extends React.Component {
  public render() {
		const data : any = dataStream.tasks; 
    return (
      <div className="App">
      	<TimeInsights data={data}/>
      </div>
    );
  }
}

export default App;