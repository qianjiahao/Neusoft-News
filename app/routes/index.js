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
					data:data
				});
			});
	});

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
				console.log(result)

				res.render('tel',{
					title:'tel',
					data:result
				})
			});

		
	});
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


