import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react';
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'


function App() {
  const inputRef = useRef(null);
  const [Tasks, SetTasks] = useState([])
  const [Formdata, SetFormdata] = useState({
    name:"",
    completed: false,

  });
  const [Update, SetUpdate] = useState("")
  const currentDateAndDay = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });



  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/tasks")
      .then((res) => {
        SetTasks(res.data.task);
      })
      .catch(error =>
        console.log(error));
        

  }, [Formdata])







  const handlechange = (e) => {
    const { value, name } = e.target;

    SetFormdata((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };


  //Add task

  const Add = async () => {
    console.log(Formdata);

  await axios
      .post('http://localhost:5000/api/v1/tasks',{
        name:Formdata.name,
        completed: Formdata.completed
      })
      .then((res) => {
        SetFormdata(res.data)
      })
      .catch((err) => {
        console.log(err.message);
      });

  }


  //delete


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`);
    } catch (error) {
      console.log(error);
    }
    SetFormdata(Tasks)
  };


  //update

  const handleUpdate = async (id) => {
    inputRef.current.focus();

   await axios.patch(`http://localhost:5000/api/v1/tasks/${id}`,{
      name: Formdata.name
 })
      .then(response => {

        console.log(response.data.task.name)
        SetFormdata(Formdata)
        console.log(Formdata);
      })
      .catch(error => console.error(error))
    SetFormdata()

  }




  return (<>




    <div className='card'>


      <h1>To Do List  <img  src="/listIcon.png"  alt="" /> </h1> 
       <h3>{`Hey👋,${currentDateAndDay}`}</h3>
      <div className="search-wrapper">
        <input type="text" placeholder="Task.." name="name" ref={inputRef} onh3Change={handlechange} required />
        <button onClick={Add}>ADD TASK</button>
      </div>





      <div className='list-div'>
        <ul>
          {Tasks.map((data) =>
            <div className='map'>
              <li className='li' key={data._id}>
                <input className='checkbox' type="checkbox" />
                <span>{data.name}</span>
                
                <div className='icons'>
                 <FontAwesomeIcon className='icon1' icon={faTrash} onClick={() => handleDelete(data._id)}  style={{ cursor: 'pointer' }} />
                 <FontAwesomeIcon className='icon2' icon={faEdit} onClick={() => handleUpdate(data._id)} style={{ cursor: 'pointer' }} />
                 </div>
              </li>
            </div>
          )}
        </ul>
      </div>

    </div>

  </>
  )
}



export default App
