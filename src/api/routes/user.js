const { Router } = require('express')
const { token, password } = require('../../services/passport')
const {index, showMe, show, create, update, destroy, auth, showMyReservations} = require('../Controllers/user-controller')
const bodyParser = require('body-parser');



const router = new Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/',
    token({ required: true, roles: ['admin'] }),
    index)

router.get('/me',
    token({ required: true }),
    showMe)

router.get('/:id',
    token({ required: true, roles: ['admin'] }),
    show)

router.post('/signup',
    create)

router.post('/auth',
    password(),
    auth)

router.put('/',
    token({ required: true }),
    update)

router.delete('/:id',
    token({ required: true, roles: ['admin'] }),
    destroy)

module.exports = router

