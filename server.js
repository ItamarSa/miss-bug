import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/PDFService.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:
app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))


// // Get Bugs (READ)
// app.get('/api/bug', (req, res) => {
//     bugService.query()
//         .then(bugs => {
//             pdfService.buildBugsPDF(bugs)
//             console.log('success: PDF created.')
//             res.send(bugs)
//             console.log('bugs', bugs)
//         })
//         .catch(err => {
//             loggerService.error('Cannot get bugs', err)
//             res.status(400).send('Cannot get bugs')
//         })
//     // console.log('bugs', bugs)
// })

// Get Bugs (READ-filterBy)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        severity: +req.query.severity || 0,
        labels: req.query.labels || ''
    }
    bugService.query(filterBy)
        .then(bugs => {
            pdfService.buildBugsPDF(bugs)
            console.log('success: PDF created.')
            res.send(bugs)
            console.log('bugs', bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
    // console.log('bugs', bugs)
})

// Save Bug (CREATE)
app.post('/api/bug', (req, res) => {
    console.log('req.body:', req.body)
    const bug = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
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

// Save Bug (UPDATE)
app.put('/api/bug', (req, res) => {
    console.log('req.body:', req.body)
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
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
app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId

    bugService.remove(bugId)
        .then(() => {
            console.log(`bug ${bugId} removed!`)
            // res.redirect('/api/bug')
            res.send('Car removed successfully')
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