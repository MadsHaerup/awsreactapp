import './App.css';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, {API, graphqlOperation } from 'aws-amplify';
import {listLists} from './graphql/queries'; 
import { useEffect, useReducer, useState } from 'react';
import MainHeader from './components/headers/MainHeader';
import { Lists } from './components/Lists/Lists';
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react';
import { createList } from './graphql/mutations';
import {onCreateList} from './graphql/subscriptions';


//set up aws
Amplify.configure(awsConfig);

const initialState ={
  title:'',
  description: ''
}

function listReducer(state = initialState, action){
  switch(action.type){
    case 'DESCRIPTION_CHANGED':
      return {...state, description: action.value}
    case 'TITLE_CHANGED':
      return {...state, title: action.value}
    default: 
    console.log('default', action)
      return state
  }
}

function App() {
 
const [state, dispatch] = useReducer(listReducer, initialState);
const [lists, setLists] = useState([]);
const [newList, setNewList]=useState('');
const [isModalOpen, setIsModalOpen] = useState(false);

async function fetchList(){
  const {data} = await API.graphql(graphqlOperation(listLists))
  setLists(data.listLists.items)
  console.log(data)
}

  useEffect(() => {
   fetchList()
  }, [])

  useEffect(() => {
  if(newList !== ''){
    setLists([newList,...lists])
  }
  }, [newList])
  function addToList({data}){
    setNewList(data.onCreateList);
  }

  useEffect(() => {
    let subscription = API.graphql(graphqlOperation(onCreateList)).subscribe(
      {next:({provider, value}) => addToList(value)
    })
  }, [])

  function toggleModal(shouldOpen){
    setIsModalOpen(shouldOpen)
  }

  //sending data to the database
  async function saveList(){
    const {title, description} = state;
    const result = await API.graphql(
      graphqlOperation(createList,{input:
        {title, description}
      }));
      toggleModal(false);
      console.log(result)
  }

  return (
    <AmplifyAuthenticator>
    <Container style={{height:'100vh'}}>
      <AmplifySignOut />
      <Button onClick={()=>toggleModal(true)} className="floatingButton">
        <span><Icon name="plus" className="floatingButton__icon"/></span> 
      </Button>
      <div className="App">
        <MainHeader />
        <Lists lists={lists}/>
      </div>
    </Container>
    <Modal open={isModalOpen} dimmer="blurring">
      <Modal.Header>Create your list</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
          value={state.title}
          onChange={(e)=>dispatch({type:'TITLE_CHANGED', value:e.target.value })} 
          error={true ? false :{content: "Please add a name"}} 
          label="Title" 
          placeholder="My list"></Form.Input>

          <Form.TextArea 
          onChange={(e)=>dispatch({type:'DESCRIPTION_CHANGED', value:e.target.value })} 
          value={state.description}
          label="Description" 
          placeholder="about your list"></Form.TextArea>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={()=>toggleModal(false)}>Cancel</Button>
        <Button positive onClick={saveList}>Save</Button>
      </Modal.Actions>
    </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
