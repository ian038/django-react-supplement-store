import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'

const SearchBar = () => {
    const [keyword, setKeyword] = useState('')
    let history = useHistory()

    const handleSubmit = e => {
        e.preventDefault()
        if(keyword) {
            history.push(`/?keyword=${keyword}&page=1`)
        } else {
            history.push(history.push(history.location.pathname))
        }
    }

    return (
        <Form onSubmit={handleSubmit} className='d-flex'>
            <Form.Control type="text" className='mr-sm-2 ml-sm-5' placeholder="Search..." value={keyword} onChange={e => setKeyword(e.target.value)} />
            <Button type='submit' variant='outline-success' style={{ marginLeft: '1rem' }}>Submit</Button>
        </Form> 
    )
}

export default SearchBar
