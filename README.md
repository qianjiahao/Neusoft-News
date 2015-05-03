# Neusoft-News
a news app of Neusoft University [html5]

一个小的app用来抓取学校官网上的信息。

###安装

    git clone git@github.com:qianjiahao/Neusoft-News.git
    cd Neusoft-News
    npm install

###运行

	start

###演示demo

    https://neusoft-news.herokuapp.com/

    测试账号:  admin/admin

###简介

	第一次用heroku部署，还不是很熟，不过挺有意思的，最重要是免费！缺点就是好慢。。。

	新闻、活动、通知、讲座这几个路由其实挺冗余的，就直接把公共方法抽离出来了。

	之前学了些前端的效果，比如加载条、回到顶部等，都自己写完加入了程序。

	由于内容较少，没有用数据库，直接抓取数据后直接显示，缺点是加载速度受网速影响。

	出于数据安全方面考虑，只录入了学生的学号和生日，并且预先对其加密。

	系统挺简单的，但是我觉得，我第一次这么重视安全性，这点是很有进步的~

> 觉得凑合的话，star鼓励下哈~