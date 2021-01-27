const router = require('express').Router();
const dao = require('./dao');

router.get("/",dao.list);
router.get('/:num',dao.view); //상세페이지 추가
router.post("/",dao.add);  //api/board post 방식으로 접근 시 모듈 실행
router.put('/',dao.mod);  //상세 라우터 추가
router.post('/delete',dao.del);

router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})

module.exports = router;