import { signUp } from '@/lib/actions'
import React from 'react'

const SignUpPage = () => {
    return (
        <main className='min-h-screen flex justify-center items-center'>
            <form action={signUp} className='flex flex-col gap-3'>
                <input type="text" name="username" id="username" className='input' placeholder='Enter your username' />
                <input type="password" name="password" id="password" className='input' placeholder='Enter your password' />
                <button type="submit" className='btn btn-success'>Sign Up</button>
            </form>
        </main>
    )
}

export default SignUpPage