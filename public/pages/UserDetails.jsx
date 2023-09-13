import { userService } from "../services/user.service"

const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

export function UserDetails() {

    const [user, setUser] = useState(null)
    const { userId } = useParams()


    useEffect(() => {
        const logginUser = userService.getLoggedinUser()
        setUser(logginUser)
    },[])

    if (!user) return <h1>loadings....</h1>
    return user && <div>
        <h3>User Details</h3>
        <h4>{user.fullname}</h4>
        <p>User Name: <span>{user.username}</span></p>
        <Link to="/bug">Back to list</Link>
    </div>

}