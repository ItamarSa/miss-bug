import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())

// Express Routing:
app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))


// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
            console.log('bugs', bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
    // console.log('bugs', bugs)
})

// Save Bug (CREATE/UPDATE)
app.get('/api/bug/save', (req, res) => {
    console.log('req.query:', req.query)
    const bug = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
    }
    console.log('bug', bug)
    bugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let viewItem = req.cookies.viewItem || []
    console.log('viewItem', viewItem)
    if (viewItem.length >= 3) {
        return res.status(400).send('Cannot get bug')
    } else if (!viewItem.includes(bugId)) {
        viewItem.push(bugId)
        res.cookie('viewItem', viewItem, {maxAge: 1000 * 20})
    }
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove Car (Delete)
app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.bugId

    bugService.remove(bugId)
        .then(() => {
            console.log(`bug ${bugId} removed!`);
            res.redirect('/api/bug')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })

})

// const port = 3030
// app.listen(port, () =>
//     loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
// )