module.exports = {
  apps: [
    {
      name: 'tbk-api',
      script: 'tsx',
      args: 'src/server.ts',
      node_args: '--openssl-legacy-provider',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
