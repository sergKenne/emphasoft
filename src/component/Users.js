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
            filtedUsers: [],
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

                }), () => console.log("users after setState:", this.state.users))
            }
        }catch(error) {
            console.log(error);
        }
    }

    sortBy = (e) => {

        if(e.target.value === "username") {
            this.setState(prevState => ({
                ...prevState,
                filtedUsers: this.state.filtedUsers.sort((a, b) => {
                    var usernameA = a.username.toLowerCase();
                    var usernameB = b.username.toLowerCase();
                    if (usernameA < usernameB) 
                    return -1;
                    if (usernameA > usernameB)
                    return 1;
                    return 0; 
                })
            }))
        } else {
            this.setState(prevState => ({
                ...prevState,
                filtedUsers: this.state.filtedUsers.sort((a,b) => a.id - b.id)
            }))
        }
    }

    filterByName = (e) => {
        this.setState({ searchUser: e.target.value }, () => {
            this.setState({
                ...this.state,
                filtedUsers: this.state.users.filter(el => {
                    return el.username.toLowerCase().includes(this.state.searchUser.toLowerCase()) || 
                    el.id.toString().includes(this.state.searchUser.toLowerCase());
                    
                })
            })

        });
    }

     componentDidMount() {
        this.fetchUsers();  
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
                        <h1 className="">Users</h1>
                        <div className="row form-row">
                            <div class=" col-md-12 col-lg-9">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search by username or by id ..." 
                                    onChange={this.filterByName}
                                    value={searchUser}
                                />
                            </div>
                            <div class="col-md-12 col-lg-3">
                                <div class="form-inline   mt-sm-2 mt-md-2 mt-lg-0">
                                    <label class="my-1 mr-2 ml-lg-auto" for="sort">Sort By</label>
                                    <select 
                                        class="custom-select  mr-sm-2" 
                                        id="sort" 
                                        onChange={this.sortBy}>
                                        <option value="id">Id</option>
                                        <option value="username">Username</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
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
