const Deployer = require('ssh-deploy-release');
 
const options = {
    localPath: 'build',
    host: '81.68.255.181',
    username: 'root',
    password: 'M5Pbg;Ln2W[pe6',
    deployPath: '/var/stk'
};
 
const deployer = new Deployer(options);
deployer.deployRelease(() => {
    console.log('Deployer is done !')
});
