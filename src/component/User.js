import React from 'react'

const User = ({user}) => {
    return (
        <div>
            <div className="card mb-2  d-flex flex-row align-items-center">
                <div className="card-image">
                    <i className="fas fa-user-circle"></i>
                </div>
                <div className="card-body">
                    <h6>Id:{"  "} {user.id}</h6>
                    <h5 className="card-title">{user.username}</h5>
                </div>
            </div>
        </div>
    )
}

export default User
