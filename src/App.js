// import react from 'react';
import {useState,useEffect} from 'react';

import './App.css';

function App() {
  
  const [title, settitle] = useState("");
  const [completed, setcompleted] = useState(false);
  const [list,setlist] = useState([]);

  const fetchData = async ()=>{
    await fetch('http://localhost:5000/tasks').then((res)=>res.json()).then((res)=>setlist(res)).catch((err)=>console.log(err.message))
  }

  useEffect(()=>{
    fetchData()
  },[]);

  console.log(list);
  
  //post data
  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {title,completed};

    await fetch('http://localhost:5000/tasks',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    }).then((res)=>res.json()).then((res)=>setlist([...list,res])).catch((err)=>console.log(err.message));  
  }

  //update task
  const toggleTask = async (id)=>{
    const singledata = await fetch(`http://localhost:5000/tasks/${id}`)
    
   const reqdata = await singledata.json();

    const updatedata = {...reqdata, completed:!reqdata.completed}

    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method:"PUT",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(updatedata)
    });

    const data = await res.json();

    setlist(list.map((item)=>item.id===id ? {...item,completed:data.completed} : item));

  }

  //Delete Task
  const deleteTask = async (id)=>{
     await fetch(`http://localhost:5000/tasks/${id}`,{
      method:'DELETE'
     });

     setlist(list.filter(item=>item.id!==id));
  }

  return (
    <div className="App">
      <div className='heading'>
         <h2>To Do list</h2>
      </div>
      <div className='form-container'>
        <form className='form' onSubmit={handleSubmit}>
           <div className='sub-form'>
              <input type='text' name='text' value={title} placeholder='Enter task' className='input-field' onChange={(e)=>settitle(e.target.value)}/>
           </div>
           <div className='sub-form'>
              <input type='checkbox' name='completed' checked={completed} value={completed} onChange={(e)=>setcompleted(e.currentTarget.checked)} />
           </div>
           <div className='sub-form'>
              <input type='submit' value='Submit' className='submit-btn'/>
           </div>
        </form>
      </div>
      <div className='output-container'>
         {list.map((item)=>(
          <div className='sub-output' key={item.id}>
             <p className='title' onClick={()=>toggleTask(item.id)}>{item.completed ? <strike>{item.title}</strike> : item.title}</p>
             <p className='close-btn' onClick={()=>deleteTask(item.id)}>X</p>
          </div>
         ))}
      </div>
    </div>
  );
}

export default App;
