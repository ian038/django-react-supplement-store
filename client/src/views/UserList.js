import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserList = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const userList = useSelector(state => state.userList)
    const { users, loading, error } = userList
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const userDelete = useSelector(state => state.userDelete)
    const { success } = userDelete

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            history.push('/login')
        }
    }, [dispatch, history, success, userInfo])

    const removeUser = userId => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId))
        }
    }

    return (
        <div>
            <h1>Users</h1>
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>): (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? (<i className='fas fa-check' style={{ color: 'green' }}></i>): (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button className='btn-sm' variant='danger' onClick={() => removeUser(user._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default UserList
