import { utilService } from "./utils.service.js"
import fs from 'fs'

export const bugService = {
    query,
    getById,
    save,
    remove
}



// function setBookSort(sortBy = {}) {
    //     if (sortBy.price !== undefined)
//         gBooks.sort((b1, b2) => (b1.Price - b2.Price) * sortBy.price)
//     if (sortBy.rate !== undefined)
//         gBooks.sort((b1, b2) => (b1.rate - b2.rate) * sortBy.rate)
//     if (sortBy.name !== undefined)
//     gBooks.sort((b1,b2)=>b1.name.localeCompare(b2.name)*sortBy.name)

// }

const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy){
    let bugToReturn = bugs

    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugToReturn = bugToReturn.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugToReturn = bugToReturn.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels) {
        const regExp = new RegExp(filterBy.labels, 'i')
        bugToReturn = bugToReturn.filter(bug => bug.labels.some(label => regExp.test(label)))
    }

    return Promise.resolve(bugToReturn)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
    // return Promise.resolve()
}

function save(bug) {
    bug.createdAt = Date.now()
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}