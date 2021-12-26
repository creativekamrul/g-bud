import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
const getLocalData = () => {
      let list = localStorage.getItem('list');
      if (list){
          return JSON.parse(localStorage.getItem('list'))
      }else {
          return []
      }
}
function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalData());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show:false, msg:'Successfully Added Item', type:'success'});

  const handelSubmit = (e) => {
      e.preventDefault();
      if (!name){
        showAlert(true,'danger','Please Add An Item')
      }else if (name && isEditing){
        setList(
            list.map((item)=>{
                if (item.id === editID){
                    return {...item, title: name}
                }
                return item
            })
        )
          setName('');
        setEditID(null);
        setIsEditing(false);
        showAlert(true,'success', 'item edited')
      }else {
          showAlert(true, 'success', 'item added to the list')
          const newItem = {id:new Date().getTime().toString(), title:name};
          setList([...list, newItem]);
          setName('')
      }
  }
  const showAlert = (show=false,type="",msg="") =>   {
        setAlert({show,type,msg})
  }
  const clearList = ()  =>  {
      showAlert(true, 'danger', 'Cleared List');
      setList([])
  }
  const removeItem = (id) =>  {
      showAlert(true, 'danger', 'Item Removed')
      setList(list.filter((item)=>item.id !== id))
  }
  const editItem = (id) => {
      const specificItem = list.find((item)=> item.id===id)
      setIsEditing(true);
      setEditID(id);
      setName(specificItem.title)
  }
  useEffect(()=>{
      localStorage.setItem('list', JSON.stringify(list))
  },[list])
  return <section className="section-center">
            <form className="grocery-form" onSubmit={handelSubmit} >
                {alert.show&&<Alert {...alert}  removeAlert={showAlert} list={list}/>}
                <h3>Grocery Bud</h3>
                <div className="form-control">
                    <input type="text" className="grocery" placeholder="e.g. eggs" value={name} onChange={(e)=>{setName(e.target.value)}} />
                    <button className="submit-btn" type="submit" >
                        {isEditing?'Edit':'Add'}
                    </button>
                </div>
            </form>
            {list.length>0&&(
                <div className="grocery-container">
                    <List items={list} removeItem={removeItem} editItem={editItem}/>
                    <button className="clear-btn" onClick={clearList}>
                        Clear Items
                    </button>
                </div>
            )}
         </section>
}

export default App
