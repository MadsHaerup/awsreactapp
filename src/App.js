import './App.css';
import awsConfig from './aws-exports';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify, {API, graphqlOperation } from 'aws-amplify';
import {listLists} from './graphql/queries'; 
import { useEffect, useReducer} from 'react';
import MainHeader from './components/headers/MainHeader';
import { Lists } from './components/Lists/Lists';
import { Button, Container, Form, Icon, Modal } from 'semantic-ui-react';
import { createList, deleteList } from './graphql/mutations';
import {onCreateList, onDeleteList} from './graphql/subscriptions';


//set up aws
Amplify.configure(awsConfig);

const initialState ={
  title:'',
  description: '',
  lists: [],
  isModalOpen: false,
}

function listReducer(state = initialState, action){
  switch(action.type){
    case 'DESCRIPTION_CHANGED':
      return {...state, description: action.value}
    case 'TITLE_CHANGED':
      return {...state, title: action.value}
    case 'UPDATE_LISTS':
      return {...state, lists:[...action.value, ...state.lists]}
    case 'OPEN_MODAL':
      return {...state, isModalOpen: true }
    case 'CLOSE_MODAL':
      deleteListById(action.value);
      return {...state, isModalOpen: false, title: '', description:''}
    case 'DELETE_LIST':
      return {...state}
    case 'DELETE_LIST_RESULT':
      const newList = state.lists.filter(item => item.id !== action.value)
      return {...state, lists: newList}
    default: 
    console.log('default', action)
      return state
  }
}
async function deleteListById(id){
  const result = await API.graphql(graphqlOperation(deleteList, {input:{id}}))
}

function App() {
const [state, dispatch] = useReducer(listReducer, initialState);

async function fetchList(){
  const {data} = await API.graphql(graphqlOperation(listLists))
  dispatch({type: 'UPDATE_LISTS', value: data.listLists.items})
  console.log(data)
}

  useEffect(() => {
   fetchList()
  }, [])


  useEffect(() => {
    let createListSub = API.graphql(graphqlOperation(onCreateList)).subscribe(
      {next:({provider, value}) => {
        dispatch({type: 'UPDATE_LISTS', value: [value.data.onCreateList]})
      }
    });
    let  deleteListSub = API.graphql(graphqlOperation(onDeleteList)).subscribe(
      {next:({provider, value}) => {
        dispatch({type: 'DELETE_LIST_RESULT', value: value.data.onDeleteList.id})
      }
    });
    return ()=> {
      createListSub.unsubscribe();
      deleteListSub.unsubscribe();
    }
  }, [])


  //sending data to the database
  async function saveList(){
    const {title, description} = state;
    const result = await API.graphql(
      graphqlOperation(createList,{input:
        {title, description}
      }));
      dispatch({type: 'CLOSE_MODAL'})
      console.log(result)
  }

  return (
    <AmplifyAuthenticator>
    <Container style={{height:'100vh'}}>
      <AmplifySignOut />
      <Button onClick={()=> dispatch({type: 'OPEN_MODAL'})} className="floatingButton">
        <span><Icon name="plus" className="floatingButton__icon"/></span> 
      </Button>
      <div className="App">
        <MainHeader />
        <Lists lists={state.lists} dispatch={dispatch} />
      </div>
    </Container>
    <Modal open={state.isModalOpen} dimmer="blurring">
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
        <Button negative onClick={()=> dispatch({type: 'CLOSE_MODAL'})}>Cancel</Button>
        <Button positive onClick={saveList}>Save</Button>
      </Modal.Actions>
    </Modal>
    </AmplifyAuthenticator>
  );
}

export default App;
