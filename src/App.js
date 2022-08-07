import logo from './logo.svg';
import './App.css';
import Resource from './resource/Resource';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import ResourceDetails from './resourceDetails/ResourceDetails';
import CreateItem from './createItem/CreateItem';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/resource' element={<Resource/>}/>
        <Route exact path='/resource-details/:resourceId' element={<ResourceDetails/>} />
        <Route exact path='/create-item-page/:resourceId' element={<CreateItem/>} />
        <Route path="/" element={<Navigate to ="/resource" />}/>
      </Routes>
    </Router>
  );
}

export default App;
