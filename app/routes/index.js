var superagent = require('superagent');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs-extra');
var Q = require('q');
var crypto = require('crypto');
var cool = require('cool-ascii-faces');

module.exports = function(app) {

	app.use(function(req,res,next){

		recordVisitor(getClientIp(req));
		next();
	})

	app.get('/', function(req, res) {
		fs.ensureDir('./data', function(err, data) {
			if (err) return err;
		});

		res.render('index', {
			title: 'hello',
			sessionId: req.session.sessionId
		});

	});

	app.get('/login', function(req, res) {
		res.render('login', {
			title: 'login',
			cool: cool(),
			sessionId: req.session.sessionId
		});

	});

	app.post('/login', function(req, res) {

		var md5;

		md5 = crypto.createHash('md5');
		md5_id = md5.update(req.body.id).digest('hex');
		md5 = crypto.createHash('md5');
		md5_birth = md5.update(req.body.birth).digest('hex');

		fs.readJson('data/source.json', function(err, data) {
			if (err) console.log(err);
			var result = JSON.parse(data);
			var flag = false;
			result.map(function(ele) {
				if (ele.id == md5_id && ele.birth == md5_birth) {
					flag = true;
					req.session.sessionId = md5_id;
					res.redirect('/');
				}
			});
			if (!flag) {
				res.redirect('/login');
			}
		});

	});

	app.get('/logout', function(req, res) {

		req.session.sessionId = null;
		res.redirect('/');
	});


	app.get('/list', checkLogin);
	app.get('/list', function(req, res) {

		var option = req.query.option;

		switch (option) {
			case 'news':
				var url = 'http://news.neusoft.edu.cn/news/news/campus-news/';
				break;
			case 'notice':
				var url = 'http://news.neusoft.edu.cn/news/news/notices/notice/';
				break;
			case 'activity':
				var url = 'http://news.neusoft.edu.cn/news/news/notices/activity/';
				break;
			case 'lecture':
				var url = 'http://news.neusoft.edu.cn/news/news/notices/lecture/';
				break;
			default:
				console.log('bad case');
		}



		fetchList(url)
			.then(function(data) {

				res.render('list', {
					title: option,
					data: data,
					sessionId: req.session.sessionId
				});
			});

	});
	app.get('/detail', checkLogin);
	app.get('/detail', function(req, res) {

		var url = req.query.url;

		superagent.get(url)
			.end(function(err, data) {
				if (err) return err;

				var $ = cheerio.load(data.text);

				var result = [];


				var $ele = $('.article-content');

				var title = $ele.find('h2').text();
				var publishDate = $ele.find('.entry-date').text() || '暂无';
				var author = $ele.find('.author').text() || '暂无';
				var editor = $ele.find('.editor').text() || '暂无';
				var source = $ele.find('.source a').text() || '暂无';
				var data = $ele.find('.data').text();

				var re = /\t|\n|\r/g;
				var data = data.replace(re, '').split(' ');

				res.render('detail', {
					title: title,
					publishDate: publishDate,
					author: author,
					editor: editor,
					source: source,
					data: data,
					sessionId: req.session.sessionId
				});
			});

	});



	app.get('/tel', checkLogin);
	app.get('/tel', function(req, res) {

		var url = 'http://www.neusoft.edu.cn/life/';
		var option = req.query.option;

		superagent.get(url)
			.end(function(err, data) {
				if (err) return err;

				var $ = cheerio.load(data.text);
				var result = [];

				$('.cydh-box li').each(function(index, ele) {

					var $ele = $(ele).text().split('：');
					var name = $ele[0];
					var position = $ele[1];
					var tel = $ele[2];

					result.push({
						name: name,
						position: position,
						tel: tel
					});

				});
				res.render('tel', {
					title: 'tel',
					data: result,
					sessionId: req.session.sessionId
				})
			});


	});

	app.use(function(req, res) {
		res.render('404');
	});

	function checkLogin(req, res, next) {

		if (!req.session.sessionId) {
			res.redirect('/login');

		} else {
			next();
		}

	}

};

function fetchList(url) {

	var deferred = Q.defer();

	superagent.get(url)
		.end(function(err, data) {
			if (err) {
				deferred.reject(err);
				return;
			}

			var $ = cheerio.load(data.text);

			var result = [];

			$('.list-box ul li').each(function(index, ele) {
				var $ele = $(ele);
				result.push({
					href: $ele.find('a').attr('href'),
					title: $ele.find('a').text(),
					date: $ele.find('i').text()
				});
			});
			deferred.resolve(result);
		});

	return deferred.promise;
}

function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
};

function recordVisitor(address) {

	var file = 'data/visitor.txt';
	var ip = 'ip=' + address + ';';

	fs.appendFile(file, ip, function(err, data) {
		if (err) console.log(err);

	});

}