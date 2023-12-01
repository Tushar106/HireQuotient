import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [data, setData] = useState();
  const [backUp,setBackUp]=useState();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [editIndex,setEditIndex]=useState(-1);
  const [selected,setSelected]=useState([]);
  const [search,setSearch]=useState('');
  const [checkAll,setCheck]=useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        console.log(data.data)
        await setData(data.data);
        await setBackUp(data.data);
        await setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [])
  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[page*10+index][field] = value;
    setData(newData);
    setBackUp(newData);
  };

  const handleCheckboxChange = async(index) => {
    const isChecked = selected.includes(index);
    if (isChecked) {
      await setSelected(selected.filter((item) => item !== index));
    } else {
       setSelected([...selected, index]);
    }
  };
 
  const deleteAll=()=>{
    const c = data.filter( x => !selected.filter( y => y === x.id).length);
    setData([...c]);
    setBackUp([...c]);
    setCheck(false);
    setSelected([]);
  }
  const handleSelectAll=()=>{
    setCheck(!checkAll);
    console.log(checkAll)
    if(!checkAll){
    const cur=data.slice(page * 10, page * 10 + 10);
    let arr=[]
    cur.map(item=>{
      if(!selected.includes(item.id)){
        arr=[...arr,item.id]
      }
    })
    setSelected([...selected,...arr]);
    }
    else{
    const cur=data.slice(page * 10, page * 10 + 10);
    let arr=[]
    cur.map(item=>{
      if(selected.includes(item.id)){
        arr=[...arr,item.id]
      }
    })
    console.log(arr)
    const c = selected.filter( x => !arr.filter( y => y === x).length);
    console.log(c);
    setSelected([...c]);
    }
  }
  const handleSearch=(e)=>{
    const search=e.target.value;
    setSearch(e.target.value);
    if(search===""){
      setData(backUp);
    }
    else{
      const filteredData = data.filter(
        (row) =>
          row.name.toLowerCase().includes(search.toLowerCase()) ||
          row.email.toLowerCase().includes(search.toLowerCase())||
          row.role.toLowerCase().includes(search.toLowerCase())
      );
      setData(filteredData);
    }
  }


  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 pt-1 pb-1">
        <div className="flex flex-row justify-between">
        <div class="pb-1 bg-white dark:bg-gray-900">
          <label for="table-search" class="sr-only">Search</label>
          <div class="relative mt-1">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text" id="table-search" class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" onChange={handleSearch} />
          </div>
        </div>
        <button  className={`font-medium text-blue-600 dark:text-blue-500 hover:underline p-1 bg-red-${selected.length==0?400:600} px-2 rounded`} disabled={selected.length==0} onClick={deleteAll}  >
          <svg className="w-4 h-4 text-gray-800 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                      </svg>
                      </button>
        </div>
        
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4 py-3">
                <div className="flex items-center">
                  <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={handleSelectAll} checked={checkAll} />
                  <label for="checkbox-all-search" className="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" className="px-6 py-2">
                Name
              </th>
              <th scope="col" className="px-6 py-2">
                Email
              </th>
              <th scope="col" className="px-6 py-2">
                Role
              </th>
              <th scope="col" className="px-6 py-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading ? <>


              {data.slice(page * 10, page * 10 + 10).map((item, index) => {
                return (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                         checked={selected.includes(item.id)}
                         onChange={() => handleCheckboxChange(item.id)} />
                        <label for="checkbox-table-search-1" className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {editIndex==index?
                      <input type="name" name="floating_email" id="floating_email" class="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={item.name}  onChange={(e) => handleInputChange(index, 'name', e.target.value)} required />
   
                      :<>{item.name}</>
                      }
                      
                    </th>
                    <td className="px-6 py-4">
                    {editIndex==index?
                      <input type="name" name="floating_email" id="floating_email" class="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={item.email}  onChange={(e) => handleInputChange(index, 'email', e.target.value)} required />
                      :<>{item.email}</>
                      }

                      
                    </td>
                    <td className="px-6 py-4">
                    {editIndex==index?
                      <input type="name" name="floating_email" id="floating_email" class="block px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" value={item.role}  onChange={(e) => handleInputChange(index, 'role', e.target.value)} required />
                      :<>{item.role}</>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {editIndex==index?<>
                        <button href="#" className="edit font-medium text-blue-600 dark:text-blue-500 hover:underline p-1" onClick={()=>{
                          setEditIndex(-1);
                        }}>
                          Save
                        </button>
                      </>:
                        <><button href="#" className="edit font-medium text-blue-600 dark:text-blue-500 hover:underline p-1" onClick={()=>{
                        setEditIndex(index);
                      }}>
                        <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                          <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                          <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                        </svg></button>
                      <button  className="delete font-medium text-blue-600 dark:text-blue-500 hover:underline p-1" onClick={(index)=>{
                        const filteredPeople = data.filter((obj) => item.id !== obj.id);
                        setData(filteredPeople);
                        setBackUp(filteredPeople);
                      }}><svg className="w-4 h-4 text-gray-800 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
                      </svg></button></>}
                    </td>
                  </tr>
                )
              })}
            </> : <>Loading</>}

          </tbody>
        </table>
        {!loading && <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-1" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">{selected.length} of {data.length} row(s) selected</span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">

            <li>
              <button className="first-page flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => {
                setPage(0);
                setCheck(false)
              }} disabled={page == 0 ? true : false}>
                <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4m6-8L7 5l4 4" />
                </svg>
              </button>
            </li>
            <li>
              <button className="previous-page flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => {
                setPage(page - 1);
                setCheck(false)
              }} disabled={page == 0 ? true : false}>
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13" />
                </svg>
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{page + 1}</a>
            </li>
            <li>
              <button className="next-page flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => {
                setCheck(false)
                setPage(page + 1)
              }} disabled={page == (data.length % 10 == 0 ? (data.length / 10 - 1) | 0 : (data.length / 10) | 0)}>
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" />
                </svg>
              </button>
            </li>

            <li>
              <button className="last-page flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={() => {
                setCheck(false)
                setPage((data.length % 10 == 0 ? (data.length / 10 - 1) | 0 : (data.length / 10) | 0))
              }} disabled={page == (data.length % 10 == 0 ? (data.length / 10 - 1) | 0 : (data.length / 10) | 0)}>
                <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                </svg>
              </button>
            </li>

          </ul>
        </nav>}
      </div>


    </>
  )
}

export default App
