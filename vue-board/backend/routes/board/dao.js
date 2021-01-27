//추가한 부분
var mysql = require('mysql');
// Connection 객체 생성 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dptmzpdl12',
  database : 'opentutorials'
});

// Connect
connection.connect(function (err) {   
  if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;   
  } 
});

exports.list = (req,res) => {
	let ipp = 10;
	let totalCount = 0;
	let block = 10;
	let total_page = 0;
	let page = 1;
	let start = 0;
	let end = ipp;
	let start_page = 1;
	let end_page = block;
	let where = "";

	body = req.query; //get

	if(body.keyword) where += ` AND subject like '%${body.keyword}%' `; 
	sql = ` SELECT  count(*) cnt FROM tb_board WHERE board_code = ? ${where} `;
	connection.query(sql,[body.board_code],(err,data)=>{
		if(err) throw err;
		totalCount = data[0].cnt;

		total_page = Math.ceil(totalCount/ipp);

		if(body.page) page = body.page;
		start = (page - 1) * 10;
		start_page = Math.ceil(page / block);
		end_page = start_page * block;
		
		if(total_page < end_page) end_page = total_page;

		let paging = {
			"totalCount":totalCount
			,"total_page": total_page
			,"page":page
			,"start_page":start_page
			,"end_page":end_page
			,"ipp":ipp
		}

		sql = ` SELECT * FROM tb_board WHERE board_code = ? ${where} ORDER BY num DESC LIMIT ?, ? `; 
		connection.query(sql,[body.board_code, start, end],(err,list)=> {
			if(err) throw err;

			res.send({success:true,list:list,paging:paging});
		}) 
	})
}

exports.add = (req,res) => {
	body = req.body; //전송된 데이터를 받는다.
	sql = " INSERT INTO  tb_board (board_code, subject, cont, id, regdate) values (?, ?, ?, ?,now()) ";
	connection.query(sql,
		[body.board_code
		, body.subject
		, body.cont
		, body.id]
		,(err,result)=>{
		if(err) throw err;

		res.send({success:true});
	})
}

exports.view = (req,res) => {
	body = req.query;
	num = req.params.num;
	sql = " SELECT * FROM tb_board WHERE board_code = ? AND num = ? ";
    
	connection.query(sql,[body.board_code, num],(err,view) => {
		if(err) throw err;
		
		res.send({success:true, view:view});
	})
}

exports.mod = (req,res) => { //수정 모듈
	body = req.body; //post
	sql = " UPDATE tb_board SET subject = ?, cont = ?, editdate = now() WHERE num = ? ";
	connection.query(sql,[body.subject, body.cont, body.num],(err,result) => {
		if(err) throw err;
		res.send({success:true});
	})
}

exports.del = (req,res) => { //수정 모듈
	body = req.body; //post
	num = req.params.num;
	sql = " DELETE FROM tb_board WHERE num = ? ";
	connection.query(sql,body.num,(err,result) => {
		if(err) throw err;
		res.send({success:true});
	})
}