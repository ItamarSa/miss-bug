import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'

const PAGE_SIZE = 3
const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const debouncedSetFilter = useRef(utilService.debounce(onSetFilterBy, 500))

    useEffect(() => {
        // loadBugs()
        bugService.query(filterBy)
            .then(bugs => setBugs(bugs))
            .catch(err => console.log('err:', err))
    }, [filterBy])

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onSetFilterBy(filterBy) {
        console.log('filterBy:', filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onChangePageIdx(diff) {
        if (filterBy.pageIdx + diff < 0) {
            setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: 0 }))
        } else if (((filterBy.pageIdx + diff) * PAGE_SIZE) > bugs.length) {
            setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: (filterBy.pageIdx + diff) - 1 }))
        } else {
            setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: filterBy.pageIdx + diff }))
        }
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('bug description?')
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <button className="add-btn" onClick={onAddBug}>Add Bug ⛐</button>
                <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
            <div className='btn-paging-container'>
                <button className="pagination-button" onClick={() => { onChangePageIdx(-1) }}>-</button>
                {filterBy.pageIdx + 1}
                <button className="pagination-button" onClick={() => { onChangePageIdx(1) }}>+</button>
                <button className="cancel-button" onClick={() => setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: undefined }))}>Cancel pagination</button>
            </div>
        </main>
    )
}
