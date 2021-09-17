import './App.css';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, {API, graphqlOperation } from 'aws-amplify';
import {listLists} from './graphql/queries'; 
import { useEffect, useState } from 'react';
import MainHeader from './components/headers/MainHeader';

//set up aws
Amplify.configure(awsConfig);

function App() {
const [list, setList] = useState([]);

async function fetchList(){
  const {data} = await API.graphql(graphqlOperation(listLists))
  setList(data.listLists.items)
  console.log(data)
}

  useEffect(() => {
   fetchList()
  }, [])

  return (
    <AmplifyAuthenticator>
    <div className="App">
    <AmplifySignOut />
      <MainHeader />
      <ul>
        {list.map((item) => (
          <li key={item.id} >{item.title}</li>
        ))}
      </ul>
    </div>
    </AmplifyAuthenticator>
  );
}

export default App;
