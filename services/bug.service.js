import { utilService } from "./utils.service.js"
import fs from 'fs'

export const bugService = {
    query
}

const bugs = utilService.readJsonFile('data/bug.json')

function query(){
    return Promise.resolve(bugs)
}