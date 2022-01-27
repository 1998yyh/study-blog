const gitalk = new Gitalk({
  clientID: 'f087538d5f06a045eec0',
  clientSecret: 'a3bca129f513da4e017367469fe6740f81ea9cf7',
  repo: 'Github repo',
  owner: 'Github repo owner',
  admin: ['Github repo collaborators, only these guys can initialize github issues'],
  // facebook-like distraction free mode
  distractionFreeMode: false
})