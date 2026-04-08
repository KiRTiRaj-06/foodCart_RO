import {useState,useContext} from 'react'

function SignUp() {
    const [name,setName] = useState(' ');
    const[pass,setPass] = useState(' ');
    const[email,setEmail]=useState(' ')

    const {setUser} = useContext(userContext)
    const handleLogin = (e) =>{
        e.preventDefault()
        setUser({name,pass,email})
    }   

return (
    <div className='flex flex-col justify-center items-center w-auto h-auto'>
        <div>
            <label htmlFor="name"> UserName</label>
            <input type="text" id='name' placeholder='Enter UserName' 
            className=''
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />
            <label htmlFor="pass"> </label>
            <input type="text" id='pass' placeholder='Enter PassWord' 
            className=''
            value={pass}
            onChange={(e)=> setPass(e.target.value)}
            />
            <label htmlFor="email"> Email</label>
            <input type="text" id='email' placeholder='Enter Email' 
            className=''
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />
            <button onClick={handleLogin} className='rounded-2xl bg-cyan-400 border-gray-500 p-3 m-2'>
                Submit
            </button>
        </div>
    </div>
    )
}

export default SignUp