const Project = require('../db/models/project')
const router = require('express').Router()

router.post('/', async (req, res, next) => {
  // const name = req.body.name

  // if (!name) {
  //   return res.status(400).json({
  //     success: false,
  //     error: 'You must provide a name'
  //   })
  // }

  // const project = new Project({name: name})

  // project
  //   .save()
  //   .then(() => {
  //     return res.status(201).json({
  //       success: true,
  //       id: project._id,
  //       message: 'Project created!'
  //     })
  //   })
  //   .catch(error => {
  //     return res.status(400).json({
  //       error,
  //       message: 'Project not created!'
  //     })
  //   })
  try {
    if (!req.user) res.sendStatus(401)
    const newProject = new Project({
      name: req.body.name,
      linepoints: req.body.linepoints
    })
    await newProject.save()
    res.send(newProject)
  } catch (error) {
    next(error)
  }
})

module.exports = router
