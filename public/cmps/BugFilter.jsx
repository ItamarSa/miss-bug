const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)


    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        console.log('value',value)

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { title, severity, labels, sortBy, } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title: </label>
                <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

                <label htmlFor="severity">Min Severity: </label>
                <input value={severity} onChange={handleChange} type="number" placeholder="By Min Severity" id="severity" name="severity" />

                <label htmlFor="labels">Labels: </label>
                <input value={labels} onChange={handleChange} type="text" placeholder="labels" id="labels" name="labels" />
                

                <button>Set Filter</button>
            </form>

            <select value={sortBy} name="sortBy" id="bugs" onChange={handleChange}>
                    <option value="">Sort by</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Create date</option>
                </select>
        </section>
    )
}