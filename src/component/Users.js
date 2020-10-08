import React, { Component} from 'react';
import Storage from '../Storage'
import axios from 'axios';
import User from './User';
import Loading from './Loading'

class Users extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            users: [],
            searchUser: "",
            loading: true,
            filtedUsers: []
        }  
    }

    fetchUsers = async () => {
        var config = {
            method: 'get',
            url: 'https://emphasoft-test-assignment.herokuapp.com/api/v1/users/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${Storage.getToken()}`
            },
        };

        try{
            const response = await axios(config);
            const users = await response.data.sort((a,b) => a.id - b.id);
            if(users !== "undefined" || users.length !== 0) {
                this.setState(prevState => ({
                    loading: false,
                    users: [...prevState.users, ...users],
                    filtedUsers: [...prevState.users, ...users],

                }), () => console.log("users after render:", this.state.users))
            }
        }catch(error) {
            console.log(error);
        }
    }

    componentDidMount() {
        this.fetchUsers();  
    }

    filterByName = (e) => {
        this.setState({ searchUser: e.target.value }, () => {
            this.setState({
                ...this.state,
                filtedUsers: this.state.users.filter(el => {
                    return el.username.toLowerCase().includes(this.state.searchUser.toLowerCase())
                    
                })
            })

        });
    }

    render() {
        const { loading, searchUser, filtedUsers} = this.state;
       
        if(loading) {
            return <Loading/>
        }

        return (
            <div className="users">
                <div className="users-header">
                    <div className="container">
                        <h1 className="text-center">Users</h1>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search names ..." 
                            onChange={this.filterByName}
                            value={searchUser}
                        />
                    </div>    
                </div>
                <div className="container">
                    <div className="list-wrap">
                        <ul className="users-list">
                            {!filtedUsers.length 
                                ? <h2 className="text-center pt-4 mt-4">User not found</h2> 
                                : filtedUsers.map(user => {
                                    return <User key={user.id} user={user} />
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        )
        
    }
}

export default Users;
