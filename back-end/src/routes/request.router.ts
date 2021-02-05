import express from 'express';
import logger from '../log';
import requestService from '../services/request.service';

const router = express.Router();

// get requests

// add a request to the database
router.post('/', (req, res, next) => {
    requestService.addRequest(req.body).then((data)=> {
        logger.debug('request added to db: ', data);
        res.sendStatus(201);
    }).catch((err) => {
        logger.error('Could not add request to db: ', err);
        res.sendStatus(500);
    })
});

// when client sends a PUT request to update a request
router.put('/update', (req, res, next) => {
    logger.debug(req.body);
    requestService.updateRequest(req.body).then( data => {
      res.send( data );
    });
  });

export default router;