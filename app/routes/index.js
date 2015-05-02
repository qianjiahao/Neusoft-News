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
			title:'hello'
		});

	});

	app.get('/list',function(req,res){

		var option = req.query.option;
		var file = path.join(dir,option + '.json');

		fs.readJson(file,function(err,data){
			if(err) return err;

			res.render('list',{
				title:option,
				data:JSON.parse(data)
			});
		});
	});

	app.get('/detail',function(req,res){

		var url = req.query.url;

		fetchDetail(url)
			.then(function(data){
				console.log(data);

				res.render('detail',{
					title:data.title,
					publishDate:data.publishDate,
					author:data.author,
					editor:data.editor,
					source:data.source,
					data:data.data
				})
			});

	})

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
				})
			},function(err){
				return err;
			});

	});

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
				})
			},function(err){
				return err;
			});

	});

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
				})
			},function(err){
				return err;
			});

	});

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
				})
			},function(err){
				return err;
			});

	});
}

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
					// console.log(result);
					
				});
				deferred.resolve(result);
			});

		return deferred.promise;
}


function fetchDetail(url){

	var deferred = Q.defer();

		superagent.get(url)
			.end(function(err,data){
				if(err) {
					deferred.reject(err);
					return ;
				}

				var $  = cheerio.load(data.text);

				var result = [];

				$('.article-content').each(function(index,ele){
					var $ele = $(ele);
					var title = $ele.find('h2').text();
					var publishDate = $ele.find('.entry-date').text() || '暂无';
					var author = $ele.find('.author').text() || '暂无';
					var editor = $ele.find('.editor').text() || '暂无';
					var source = $ele.find('.source a').text() || '暂无';
					var data = $ele.find('.data').text() || '暂无';
					result.push({
						title:$ele.find('h2').text(),
						publishDate:publishDate,
						author:author,
						editor:editor,
						source:source,
						data:data
					});
					console.log(result);
					
				});
				deferred.resolve(result);
			});

		return deferred.promise;
}

