var superagent = require('superagent');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs-extra');
var Q = require('q');
var dir = '../data';

module.exports = function(app){


	app.get('/',function(req,res){

		fs.ensureDir('./data',function(err,data){
			if(err) return err;
		});
		res.render('index',{
			title:'hello',
			sessionId:req.session.sessionId
		});

	});

	app.get('/login',function(req,res){
		res.render('login',{
			title:'login',
			sessionId:req.session.sessionId
		});
	});

	app.post('/login',function(req,res){

		var id = req.body.id;
		var birth = req.body.birth;

		fs.readJson('../data/target.json',function(err,data){
			if(err) console.log(err);
			var result = JSON.parse(data);
			var flag = false;
			result.map(function(ele){
				if(ele.id == id && ele.birth == birth){
					flag = true;
					req.session.sessionId = id;
					res.redirect('/');
				}
			});
			if(!flag){
				res.redirect('/login');
			}
		});

	});

	app.get('/logout',function(req,res){

		req.session.sessionId = null;
		res.redirect('/');
	});

	app.get('/list',checkLogin);
	app.get('/list',function(req,res){

		var option = req.query.option;
		var file = path.join(dir,option + '.json');

		fs.readJson(file,function(err,data){
			if(err) return err;

			res.render('list',{
				title:option,
				data:JSON.parse(data),
				sessionId:req.session.sessionId
			});
		});
	});
	app.get('/detail',checkLogin);
	app.get('/detail',function(req,res){

		var url = req.query.url;

		superagent.get(url)
			.end(function(err,data){
				if(err) return err;

				var $  = cheerio.load(data.text);

				var result = [];


				var $ele = $('.article-content');

				var title = $ele.find('h2').text();
				var publishDate = $ele.find('.entry-date').text() || '暂无';
				var author = $ele.find('.author').text() || '暂无';
				var editor = $ele.find('.editor').text() || '暂无';
				var source = $ele.find('.source a').text() || '暂无';
				var data = $ele.find('.data').text();

				var re = /\t|\n|\r/g;
				var data = data.replace(re,'').split(' ');
				
				res.render('detail',{
					title:title,
					publishDate:publishDate,
					author:author,
					editor:editor,
					source:source,
					data:data,
					sessionId:req.session.sessionId
				});
			});
	});

	app.get('/news',checkLogin);
	app.get('/news',function(req,res){

		var option = 'news';
		var url = 'http://news.neusoft.edu.cn/news/news/campus-news/';
		var file = path.join(dir, option + '.json');

		fetchList(url)
			.then(function(data){
				return JSON.stringify(data);
			})
			.then(function(json){
				fs.outputJson(file,json);
			})
			.then(function(){
				fs.readJson(file,function(err,data){
					res.redirect('/list?option=' + option);
				});
			},function(err){
				return err;
			});


	});
	app.get('/notice',checkLogin);
	app.get('/notice',function(req,res){

		var option = 'notice';
		var url = 'http://news.neusoft.edu.cn/news/news/notices/notice/';
		var file = path.join(dir,option + '.json');


		fetchList(url)
			.then(function(data){
				return JSON.stringify(data);
			})
			.then(function(json){
				fs.outputJson(file,json);
			})
			.then(function(){
				fs.readJson(file,function(err,data){
					res.redirect('/list?option=' + option);
				});
			},function(err){
				return err;
			});

	});
	app.get('/activity',checkLogin);
	app.get('/activity',function(req,res){

		var option = 'activity';
		var url = 'http://news.neusoft.edu.cn/news/news/notices/activity/';
		var file = path.join(dir,option + '.json');


		fetchList(url)
			.then(function(data){
				return JSON.stringify(data);
			})
			.then(function(json){
				fs.outputJson(file,json);
			})
			.then(function(){
				fs.readJson(file,function(err,data){
					res.redirect('/list?option=' + option);
				});
			},function(err){
				return err;
			});

	});
	app.get('/lecture',checkLogin);
	app.get('/lecture',function(req,res){

		var option = 'lecture';
		var url = 'http://news.neusoft.edu.cn/news/news/notices/lecture/';
		var file = path.join(dir,option + '.json');


		fetchList(url)
			.then(function(data){
				return JSON.stringify(data);
			})
			.then(function(json){
				fs.outputJson(file,json);
			})
			.then(function(){
				fs.readJson(file,function(err,data){
					res.redirect('/list?option=' + option);
				});
			},function(err){
				return err;
			});

	});
	app.get('/tel',checkLogin);
	app.get('/tel',function(req,res){

		var url = 'http://www.neusoft.edu.cn/life/';
		var option = req.query.option;

			superagent.get(url)
			.end(function(err,data){
				if(err) return err;

				var $ = cheerio.load(data.text);
				var result = [];

				$('.cydh-box li').each(function(index,ele){

					var $ele = $(ele).text().split('：');
					var name = $ele[0];
					var position = $ele[1];
					var tel = $ele[2];

					result.push({
						name:name,
						position:position,
						tel:tel
					});

				});
				res.render('tel',{
					title:'tel',
					data:result,
					sessionId:req.session.sessionId
				})
			});

		
	});

	function checkLogin(req,res,next){

		if(!req.session.sessionId){
			res.redirect('/login');
		}else{
			console.log(req.session.sessionId);
			next();
		}
	}

};

function fetchList(url){

	var deferred = Q.defer();

		superagent.get(url)
			.end(function(err,data){
				if(err) {
					deferred.reject(err);
					return ;
				}

				var $  = cheerio.load(data.text);

				var result = [];

				$('.list-box ul li').each(function(index,ele){
					var $ele = $(ele);
					result.push({
						href:$ele.find('a').attr('href'),
						title:$ele.find('a').text(),
						date:$ele.find('i').text()
					});
				});
				deferred.resolve(result);
			});

		return deferred.promise;
}


