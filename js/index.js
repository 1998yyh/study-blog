const gitalk = new Gitalk({
  clientID: 'f087538d5f06a045eec0',
  clientSecret: 'a3bca129f513da4e017367469fe6740f81ea9cf7',
  repo: 'study-blog-gitalk',
  owner: '1998yyh',
  admin: ['1998yyh'],
  // facebook-like distraction free mode
  distractionFreeMode: false,
  id:location.pathname
})