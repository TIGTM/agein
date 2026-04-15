module.exports = {
  apps: [
    {
      name: 'agein',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3051
      },
      restart_delay: 3000,
      max_restarts: 10
    }
  ]
};
