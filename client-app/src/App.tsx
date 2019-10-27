import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import { Header, Icon, List } from 'semantic-ui-react';

class App extends Component {
  state = {
    values: []
  }

  async componentDidMount() {
    var resp = await axios.get("http://localhost:5000/api/values");
    
    this.setState({
      values: resp.data
    });
  }

  render() {
    return (
      <div>
          <Header as='h2'>
            <Icon name='users'/>
            <Header.Content>Reactivities</Header.Content>
          </Header>
          <List>
          {this.state.values.map((value: any) => 
              <List.Item key={value.id}>{value.name}</List.Item>
            )}
          </List>
      </div>
    );
  };
}

export default App;
