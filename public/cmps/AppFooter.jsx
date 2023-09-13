import { showSuccessMsg } from '../services/event-bus.service.js'
const { useEffect } = React

export function AppFooter () {

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <footer>
            <p>
            (c) copyright all rights reserved to Itamar Sasson
            </p>
        </footer>
    )

}